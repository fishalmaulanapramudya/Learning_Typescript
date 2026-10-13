const form = document.getElementById('studentForm');
const formTitle = document.getElementById('formTitle');
const cancelButton = document.getElementById('cancelEdit');
const messageBox = document.getElementById('messageBox');
const tableBody = document.querySelector('#studentTable tbody');
const studentCount = document.getElementById('studentCount');
const activeClass = document.getElementById('activeClass');
const logoutButton = document.getElementById('logoutButton');
const confirmModal = document.getElementById('confirmModal');
const confirmMessage = document.getElementById('confirmMessage');
const confirmDelete = document.getElementById('confirmDelete');
const confirmCancel = document.getElementById('confirmCancel');

let editingId = null;
let pendingDeleteId = null;

function getToken() {
    return localStorage.getItem('token');
}

function redirectToLogin() {
    localStorage.removeItem('token');
    window.location.href = '/login';
}

function showMessage(text, tone = 'success') {
    messageBox.textContent = text;
    messageBox.className = `message-box ${tone}`;
}

function apiFetch(url, options = {}) {
    const token = getToken();
    const headers = {
        'Content-Type': 'application/json',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers ?? {})
    };

    return fetch(url, {
        ...options,
        headers
    });
}

function openConfirmModal(studentId, studentName) {
    pendingDeleteId = studentId;
    confirmMessage.textContent = `Apakah Anda yakin ingin menghapus siswa ${studentName}?`;
    confirmModal.classList.remove('hidden');
    confirmModal.setAttribute('aria-hidden', 'false');
}

function closeConfirmModal() {
    pendingDeleteId = null;
    confirmModal.classList.add('hidden');
    confirmModal.setAttribute('aria-hidden', 'true');
}

async function loadStudents() {
    try {
        const token = getToken();
        if (!token) {
            redirectToLogin();
            return;
        }

        const response = await apiFetch('/api/students');
        const payload = await response.json();

        if (!response.ok || !payload.success) {
            if (response.status === 401) {
                redirectToLogin();
                return;
            }
            throw new Error(payload.message || 'Gagal memuat data siswa.');
        }

        const students = payload.data ?? [];
        studentCount.textContent = String(students.length);
        activeClass.textContent = students.length > 0 ? 'Aktif' : 'Kosong';

        if (!tableBody) {
            return;
        }

        if (students.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="6" class="empty-state">Belum ada data siswa.</td>
                </tr>
            `;
            return;
        }

        tableBody.innerHTML = students
            .map(
                (student) => `
                    <tr>
                        <td>${student.nis}</td>
                        <td>${student.nama}</td>
                        <td>${student.kelas}</td>
                        <td>${student.jurusan}</td>
                        <td>${student.email}</td>
                        <td>
                            <div class="table-actions">
                                <button type="button" class="action-button edit" data-id="${student.id}" data-name="${student.nama}">Edit</button>
                                <button type="button" class="action-button delete" data-id="${student.id}" data-name="${student.nama}">Hapus</button>
                            </div>
                        </td>
                    </tr>
                `
            )
            .join('');
    } catch (error) {
        showMessage(error.message || 'Terjadi kesalahan.', 'error');
    }
}

async function submitStudent(event) {
    event.preventDefault();

    const formData = new FormData(form);
    const payload = {
        nis: String(formData.get('nis') ?? '').trim(),
        nama: String(formData.get('nama') ?? '').trim(),
        kelas: String(formData.get('kelas') ?? '').trim(),
        jurusan: String(formData.get('jurusan') ?? '').trim(),
        email: String(formData.get('email') ?? '').trim()
    };

    const url = editingId ? `/api/students/${editingId}` : '/api/students';
    const method = editingId ? 'PUT' : 'POST';

    try {
        const response = await apiFetch(url, {
            method,
            body: JSON.stringify(payload)
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            if (response.status === 401) {
                redirectToLogin();
                return;
            }
            throw new Error(result.message || 'Data siswa gagal disimpan.');
        }

        showMessage(result.message || 'Data siswa berhasil disimpan.', 'success');
        form.reset();
        editingId = null;
        formTitle.textContent = 'Tambah Siswa';
        cancelButton.hidden = true;
        await loadStudents();
    } catch (error) {
        showMessage(error.message || 'Terjadi kesalahan.', 'error');
    }
}

async function handleTableClick(event) {
    const target = event.target;

    if (!(target instanceof HTMLElement)) {
        return;
    }

    const actionButton = target.closest('button[data-id]');
    if (!actionButton) {
        return;
    }

    const studentId = Number(actionButton.dataset.id);
    const action = actionButton.classList.contains('edit') ? 'edit' : 'delete';
    const studentName = actionButton.dataset.name ?? 'siswa ini';

    if (action === 'edit') {
        try {
            const response = await apiFetch(`/api/students/${studentId}`);
            const payload = await response.json();

            if (!response.ok || !payload.success) {
                if (response.status === 401) {
                    redirectToLogin();
                    return;
                }
                throw new Error(payload.message || 'Gagal mengambil detail siswa.');
            }

            const student = payload.data;
            editingId = student.id;
            formTitle.textContent = 'Edit Siswa';
            cancelButton.hidden = false;
            document.getElementById('nis').value = student.nis;
            document.getElementById('nama').value = student.nama;
            document.getElementById('kelas').value = student.kelas;
            document.getElementById('jurusan').value = student.jurusan;
            document.getElementById('email').value = student.email;
            form.scrollIntoView({ behavior: 'smooth', block: 'start' });
            showMessage('Mode edit aktif.', 'success');
        } catch (error) {
            showMessage(error.message || 'Terjadi kesalahan.', 'error');
        }
        return;
    }

    if (action === 'delete') {
        openConfirmModal(studentId, studentName);
    }
}

async function deleteStudent(studentId) {
    try {
        const response = await apiFetch(`/api/students/${studentId}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            if (response.status === 401) {
                redirectToLogin();
                return;
            }
            throw new Error(result.message || 'Gagal menghapus siswa.');
        }

        showMessage(result.message || 'Siswa berhasil dihapus.', 'success');
        if (editingId === studentId) {
            form.reset();
            editingId = null;
            formTitle.textContent = 'Tambah Siswa';
            cancelButton.hidden = true;
        }
        await loadStudents();
    } catch (error) {
        showMessage(error.message || 'Terjadi kesalahan.', 'error');
    } finally {
        closeConfirmModal();
    }
}

cancelButton.addEventListener('click', () => {
    editingId = null;
    form.reset();
    formTitle.textContent = 'Tambah Siswa';
    cancelButton.hidden = true;
    showMessage('Mode tambah aktif kembali.', 'success');
});

confirmCancel.addEventListener('click', closeConfirmModal);
confirmDelete.addEventListener('click', () => {
    if (pendingDeleteId) {
        deleteStudent(pendingDeleteId);
    }
});

logoutButton.addEventListener('click', () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
});

form.addEventListener('submit', submitStudent);
tableBody.addEventListener('click', handleTableClick);

if (!getToken()) {
    redirectToLogin();
} else {
    loadStudents();
}

import { StudentRepository } from '../repositories/StudentRepository.js';
import type { CreateStudentDTO, StudentRecord, UpdateStudentDTO } from '../types/StudentTypes.js';

export class StudentService {
    constructor(private readonly studentRepository = new StudentRepository()) {}

    async findAll(): Promise<StudentRecord[]> {
        return this.studentRepository.findAll();
    }

    async findById(id: number): Promise<StudentRecord> {
        const student = await this.studentRepository.findById(id);

        if (!student) {
            throw new Error('Siswa tidak ditemukan.');
        }

        return student;
    }

    async create(data: CreateStudentDTO): Promise<StudentRecord> {
        const payload = this.validateStudentData(data) as CreateStudentDTO;
        const existing = await this.studentRepository.findAll();

        if (existing.some((student) => student.nis === payload.nis)) {
            throw new Error('NIS sudah terdaftar.');
        }

        const email = payload.email.toLowerCase();
        if (existing.some((student) => student.email.toLowerCase() === email)) {
            throw new Error('Email sudah terdaftar.');
        }

        return this.studentRepository.create(payload);
    }

    async update(id: number, data: UpdateStudentDTO): Promise<StudentRecord> {
        const payload = this.validateStudentData(data, true) as Partial<CreateStudentDTO>;
        const existing = await this.studentRepository.findById(id);

        if (!existing) {
            throw new Error('Siswa tidak ditemukan.');
        }

        if (payload.nis && payload.nis !== existing.nis) {
            const dataByNis = await this.studentRepository.findAll();
            if (dataByNis.some((student) => student.nis === payload.nis && student.id !== id)) {
                throw new Error('NIS sudah digunakan siswa lain.');
            }
        }

        if (payload.email && payload.email.toLowerCase() !== existing.email.toLowerCase()) {
            const dataByEmail = await this.studentRepository.findAll();
            const emailToCheck = payload.email.toLowerCase();
            if (dataByEmail.some((student) => student.email.toLowerCase() === emailToCheck && student.id !== id)) {
                throw new Error('Email sudah digunakan siswa lain.');
            }
        }

        const result = await this.studentRepository.update(id, payload);

        if (!result) {
            throw new Error('Gagal memperbarui data siswa.');
        }

        return result;
    }

    async delete(id: number): Promise<boolean> {
        const existing = await this.studentRepository.findById(id);

        if (!existing) {
            throw new Error('Siswa tidak ditemukan.');
        }

        return this.studentRepository.delete(id);
    }

    private validateStudentData(data: Partial<CreateStudentDTO> & Partial<UpdateStudentDTO>, isUpdate = false): Partial<CreateStudentDTO> {
        const fields: Array<keyof CreateStudentDTO> = ['nis', 'nama', 'kelas', 'jurusan', 'email'];
        const payload: Partial<CreateStudentDTO> = {};

        for (const field of fields) {
            const rawValue = data[field];

            if (rawValue === undefined || rawValue === null) {
                continue;
            }

            const value = String(rawValue).trim();

            if (!value && !isUpdate) {
                throw new Error('Semua field wajib diisi.');
            }

            if (!value && isUpdate) {
                continue;
            }

            const patterns: Record<keyof CreateStudentDTO, RegExp> = {
                nis: /^\d{6,15}$/,
                nama: /^.{2,100}$/,
                kelas: /^.{2,20}$/,
                jurusan: /^.{2,50}$/,
                email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
            };

            if (!patterns[field].test(value)) {
                throw new Error(this.getValidationMessage(field));
            }

            payload[field] = value;
        }

        if (!isUpdate && Object.keys(payload).length !== fields.length) {
            throw new Error('Semua field wajib diisi.');
        }

        if (isUpdate && Object.keys(payload).length === 0) {
            throw new Error('Minimal satu field harus diubah.');
        }

        return payload;
    }

    private getValidationMessage(field: string): string {
        const messages: Record<string, string> = {
            nis: 'NIS harus berisi angka saja dan minimal 6 digit.',
            nama: 'Nama minimal 2 karakter.',
            kelas: 'Kelas tidak valid.',
            jurusan: 'Jurusan tidak valid.',
            email: 'Format email tidak valid.'
        };

        return messages[field] ?? 'Data tidak valid.';
    }
}

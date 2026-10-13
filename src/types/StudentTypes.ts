export interface CreateStudentDTO {
    nis: string;
    nama: string;
    kelas: string;
    jurusan: string;
    email: string;
}

export interface UpdateStudentDTO {
    nis?: string;
    nama?: string;
    kelas?: string;
    jurusan?: string;
    email?: string;
}

export interface StudentRecord {
    id: number;
    nis: string;
    nama: string;
    kelas: string;
    jurusan: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}

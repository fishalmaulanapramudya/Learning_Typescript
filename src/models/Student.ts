import type { StudentRecord } from '../types/StudentTypes.js';

export class Student {
    constructor(
        public readonly id: number,
        public nis: string,
        public nama: string,
        public kelas: string,
        public jurusan: string,
        public email: string,
        public createdAt: string,
        public updatedAt: string
    ) {}

    toRecord(): StudentRecord {
        return {
            id: this.id,
            nis: this.nis,
            nama: this.nama,
            kelas: this.kelas,
            jurusan: this.jurusan,
            email: this.email,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt
        };
    }
}

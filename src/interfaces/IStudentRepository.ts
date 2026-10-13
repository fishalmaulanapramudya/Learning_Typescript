import type { CreateStudentDTO, StudentRecord, UpdateStudentDTO } from '../types/StudentTypes.js';

export interface IStudentRepository {
    findAll(): Promise<StudentRecord[]>;
    findById(id: number): Promise<StudentRecord | null>;
    create(data: CreateStudentDTO): Promise<StudentRecord>;
    update(id: number, data: UpdateStudentDTO): Promise<StudentRecord | null>;
    delete(id: number): Promise<boolean>;
}

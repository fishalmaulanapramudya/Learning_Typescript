import type { Request, Response } from 'express';
import { StudentService } from '../services/StudentService.js';

export class StudentController {
    constructor(private readonly studentService = new StudentService()) {}

    async getStudents(req: Request, res: Response): Promise<void> {
        try {
            const students = await this.studentService.findAll();
            res.status(200).json({
                success: true,
                data: students
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Gagal mengambil data siswa.';
            res.status(500).json({ success: false, message });
        }
    }

    async getStudentById(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);

            if (!Number.isInteger(id)) {
                res.status(400).json({ success: false, message: 'ID siswa tidak valid.' });
                return;
            }

            const student = await this.studentService.findById(id);
            res.status(200).json({ success: true, data: student });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Gagal mengambil data siswa.';
            const status = message === 'Siswa tidak ditemukan.' ? 404 : 400;
            res.status(status).json({ success: false, message });
        }
    }

    async createStudent(req: Request, res: Response): Promise<void> {
        try {
            const student = await this.studentService.create(req.body ?? {});
            res.status(201).json({
                success: true,
                message: 'Siswa berhasil ditambahkan.',
                data: student
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Gagal menambahkan siswa.';
            res.status(400).json({ success: false, message });
        }
    }

    async updateStudent(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);

            if (!Number.isInteger(id)) {
                res.status(400).json({ success: false, message: 'ID siswa tidak valid.' });
                return;
            }

            const student = await this.studentService.update(id, req.body ?? {});
            res.status(200).json({
                success: true,
                message: 'Siswa berhasil diperbarui.',
                data: student
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Gagal memperbarui siswa.';
            const status = message.includes('tidak ditemukan') ? 404 : 400;
            res.status(status).json({ success: false, message });
        }
    }

    async deleteStudent(req: Request, res: Response): Promise<void> {
        try {
            const id = Number(req.params.id);

            if (!Number.isInteger(id)) {
                res.status(400).json({ success: false, message: 'ID siswa tidak valid.' });
                return;
            }

            await this.studentService.delete(id);
            res.status(200).json({
                success: true,
                message: 'Siswa berhasil dihapus.'
            });
        } catch (error) {
            const message = error instanceof Error ? error.message : 'Gagal menghapus siswa.';
            const status = message === 'Siswa tidak ditemukan.' ? 404 : 400;
            res.status(status).json({ success: false, message });
        }
    }
}

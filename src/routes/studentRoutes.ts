import { Router } from 'express';
import { StudentController } from '../controllers/StudentController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();
const studentController = new StudentController();

router.use(authMiddleware);
router.get('/students', studentController.getStudents.bind(studentController));
router.get('/students/:id', studentController.getStudentById.bind(studentController));
router.post('/students', studentController.createStudent.bind(studentController));
router.put('/students/:id', studentController.updateStudent.bind(studentController));
router.delete('/students/:id', studentController.deleteStudent.bind(studentController));

export default router;

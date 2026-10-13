import { Router } from 'express';
import { UserController } from '../controllers/UserController.js';
import { authMiddleware } from '../middleware/authMiddleware.js';

const router = Router();
const userController = new UserController();

router.post('/login', userController.login.bind(userController));
router.post('/register', userController.register.bind(userController));

router.use(authMiddleware);
router.get('/users', userController.getUsers.bind(userController));
router.get('/users/:id', userController.getUserById.bind(userController));
router.put('/users/:id', userController.updateUser.bind(userController));
router.delete('/users/:id', userController.deleteUser.bind(userController));
router.get('/logout', userController.logout.bind(userController));

export default router;

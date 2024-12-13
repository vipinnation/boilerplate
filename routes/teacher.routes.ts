import { Router } from 'express';
import TeacherController from '../app/controller/teacher.controller';

const router = Router();

// Create new teacher
router.post('/', TeacherController.create);

// Get all teachers
router.get('/', TeacherController.getAll);

// Get teacher by ID
router.get('/:id', TeacherController.getById);

// Update teacher
router.put('/:id', TeacherController.update);

// Delete teacher
router.delete('/:id', TeacherController.delete);

export const teacherRoutes = router;

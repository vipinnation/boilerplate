import { Router } from 'express';
import StudentController from '../app/controller/student.controller';

const router = Router();

// Create new student
router.post('/', StudentController.create);

// Get all students
router.get('/', StudentController.getAll);

// Get student by ID
router.get('/:id', StudentController.getById);

// Update student
router.put('/:id', StudentController.update);

// Delete student
router.delete('/:id', StudentController.delete);

export const studentRoutes = router;

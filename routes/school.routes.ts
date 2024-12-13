import { Router } from 'express';
import { SchoolController } from '../app/controller/school.controller';

const router = Router();

// Create new school
router.post('/', SchoolController.create);

// Get all schools
router.get('/', SchoolController.getAll);

// Get school by ID 
router.get('/:id', SchoolController.getById);

// Update school
router.put('/:id', SchoolController.update);

// Delete school
router.delete('/:id', SchoolController.delete);

export const schoolRoutes = router;

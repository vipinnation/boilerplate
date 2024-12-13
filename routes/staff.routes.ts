import { Router } from 'express';
import StaffController from '../app/controller/staff.controller';

const router = Router();

// Create new staff member
router.post('/', StaffController.create);

// Get all staff members
router.get('/', StaffController.getAll);

// Get staff member by ID
router.get('/:id', StaffController.getById);

// Update staff member
router.put('/:id', StaffController.update);

// Delete staff member
router.delete('/:id', StaffController.delete);

router.patch('/:id/block', StaffController.block);

export const staffRoutes = router;

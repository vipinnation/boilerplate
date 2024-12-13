import { Router } from 'express';
import ParentController from '../app/controller/parent.controller';

const router = Router();

// Create new parent
router.post('/', ParentController.create);

// Get all parents
router.get('/', ParentController.getAll);

// Get parent by ID
router.get('/:id', ParentController.getById);

// Update parent
router.put('/:id', ParentController.update);

// Delete parent
router.delete('/:id', ParentController.delete);

export const parentRoutes = router;

import { Router } from 'express';
import { createBranch, getAllBranches, getBranchById, updateBranch, deleteBranch } from '../app/controller/branches.controller';

const router = Router();

router.post('/', createBranch);
router.get('/', getAllBranches);
router.get('/:id', getBranchById);
router.patch('/:id', updateBranch);
router.delete('/:id', deleteBranch);

export const branchRoutes = router;

import { Router } from 'express';
import { BranchController } from '../controllers/branch.controller';
// import { authMiddleware } from '../middlewares/auth.middleware';
// import { rbacMiddleware } from '../middlewares/rbac.middleware';

const router = Router();
const branchController = new BranchController();

// router.use(authMiddleware); // Protect all branch routes

router.post(
  '/', 
  // rbacMiddleware(['manage_branches']),
  branchController.createBranch
);
router.get(
  '/', 
  // rbacMiddleware(['view_branches']),
  branchController.getAllBranches
);
router.get(
  '/:id', 
  // rbacMiddleware(['view_branches']),
  branchController.getBranchById
);
router.patch(
  '/:id', 
  // rbacMiddleware(['manage_branches']),
  branchController.updateBranch
);
router.delete(
  '/:id', 
  // rbacMiddleware(['manage_branches']),
  branchController.deleteBranch
);

export default router;

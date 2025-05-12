
import { Router } from 'express';
import { RoleController } from '../controllers/role.controller';
// import { authMiddleware } from '../middlewares/auth.middleware';
// import { rbacMiddleware } from '../middlewares/rbac.middleware';

const router = Router();
const roleController = new RoleController();

// router.use(authMiddleware); // Protect all role routes

router.post(
  '/', 
  // rbacMiddleware(['manage_roles']),
  roleController.createRole
);
router.get(
  '/', 
  // rbacMiddleware(['view_roles']),
  roleController.getAllRoles
);
router.get(
  '/:id', 
  // rbacMiddleware(['view_roles']),
  roleController.getRoleById
);
router.patch(
  '/:id', 
  // rbacMiddleware(['manage_roles']),
  roleController.updateRole
);
router.delete(
  '/:id', 
  // rbacMiddleware(['manage_roles']),
  roleController.deleteRole
);

export default router;

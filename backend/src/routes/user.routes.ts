
import { Router } from 'express';
import { UserController } from '../controllers/user.controller';
// import { authMiddleware } from '../middlewares/auth.middleware'; // TODO: Implement and use
// import { rbacMiddleware } from '../middlewares/rbac.middleware'; // TODO: Implement and use

const router = Router();
const userController = new UserController();

// router.use(authMiddleware); // Protect all user routes

router.post(
  '/', 
  // rbacMiddleware(['create_user']), // Example permission
  userController.createUser
);
router.get(
  '/', 
  // rbacMiddleware(['view_users']),
  userController.getAllUsers
);
router.get(
  '/:id', 
  // rbacMiddleware(['view_users']),
  userController.getUserById
);
router.patch(
  '/:id', 
  // rbacMiddleware(['edit_user']),
  userController.updateUser
);
router.delete(
  '/:id', 
  // rbacMiddleware(['delete_user']),
  userController.deleteUser
);

export default router;

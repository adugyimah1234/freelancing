
import { Router } from 'express';
import defaultRoutes from './default.routes';
import userRoutes from './user.routes';
import roleRoutes from './role.routes';
import branchRoutes from './branch.routes';
import authRoutes from './auth.routes'; // Assuming auth routes will be created

const router = Router();

router.use('/', defaultRoutes);
router.use('/auth', authRoutes); // Auth routes typically don't need /api prefix if JWT is used for subsequent /api calls
router.use('/users', userRoutes);
router.use('/roles', roleRoutes);
router.use('/branches', branchRoutes);
// TODO: Add routes for other entities (students, parents, classes, fees, exams, etc.)

export default router;

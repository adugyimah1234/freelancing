import { Router } from 'express';
import defaultRoutes from './default.routes';
// import userRoutes from './user.routes'; // Example for future modules
// import authRoutes from './auth.routes'; // Example for future modules

const router = Router();

router.use('/', defaultRoutes);
// router.use('/users', userRoutes);
// router.use('/auth', authRoutes);

export default router;

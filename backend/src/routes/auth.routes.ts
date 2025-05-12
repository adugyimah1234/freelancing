
import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller';
// import { authMiddleware } from '../middlewares/auth.middleware'; // For profile route

const router = Router();
const authController = new AuthController();

/**
 * @openapi
 * tags:
 *   name: Auth
 *   description: Authentication operations
 */

/**
 * @openapi
 * /auth/login:
 *   post:
 *     tags: [Auth]
 *     summary: Log in a user
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', authController.login);

/**
 * @openapi
 * /auth/profile:
 *   get:
 *     tags: [Auth]
 *     summary: Get current user's profile
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponseDto'
 *       401:
 *         description: Unauthorized
 */
router.get(
    '/profile', 
    // authMiddleware, // TODO: Implement and use this
    authController.getProfile
);


// TODO: Add routes for password reset, registration (if self-registration is allowed)
// router.post('/forgot-password', authController.forgotPassword);
// router.post('/reset-password', authController.resetPassword);

export default router;

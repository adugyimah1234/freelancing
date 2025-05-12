import { Router } from 'express';
import { getHealth, getRoot } from '../controllers/default.controller';

const router = Router();

/**
 * @openapi
 * /:
 *   get:
 *     tags:
 *       - Default
 *     summary: Get API welcome message
 *     responses:
 *       200:
 *         description: Successful response with welcome message.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Hello World from Branch Buddy Backend (Node.js/Express)!
 */
router.get('/', getRoot);

/**
 * @openapi
 * /health:
 *   get:
 *     tags:
 *       - Default
 *     summary: Health check endpoint
 *     responses:
 *       200:
 *         description: Successful response indicating the service is healthy.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: UP
 *                 message:
 *                   type: string
 *                   example: Branch Buddy Backend is running healthy!
 */
router.get('/health', getHealth);

export default router;

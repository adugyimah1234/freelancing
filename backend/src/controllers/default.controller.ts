import type { Request, Response } from 'express';

export const getRoot = (req: Request, res: Response) => {
  res.status(200).json({ message: 'Hello World from Branch Buddy Backend (Node.js/Express)!' });
};

export const getHealth = (req: Request, res: Response) => {
  res.status(200).json({ status: 'UP', message: 'Branch Buddy Backend is running healthy!' });
};

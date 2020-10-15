import { NextFunction, Request, Response } from 'express';

export default function authenticationRequired(
  req: Request,
  res: Response,
  next: NextFunction,
): Response | void {
  if (req.isAuthenticated()) return next();
  return res.status(401).send();
}

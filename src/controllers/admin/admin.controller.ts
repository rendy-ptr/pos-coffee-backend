import { Request, Response } from 'express';

export const registerAdmin = async (
  req: Request,
  res: Response
): Promise<void> => {
  res.send('Admin registration endpoint is not implemented yet');
};

import type { Request, Response } from 'express';

export const getMenus = async (req: Request, res: Response) => {
  res.json({
    message: 'List of menus',
    data: [{ id: 1, name: 'Espresso', price: 2.5 }],
  });
};

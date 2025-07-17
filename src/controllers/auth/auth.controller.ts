import type { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { hashPassword, comparePassword } from '@/utils/hash';
import jwt from 'jsonwebtoken';
import { baseLogger } from '@/middlewares/logger';

const prisma = new PrismaClient();

// const ROUTES: { [key: string]: string } = {
//   customer: '/dashboard/customer',
//   kasir: '/dashboard/kasir',
//   admin: '/dashboard/admin',
//   default: '/',
// };

export const registerCustomer = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, email, password } = req.body;

  // Check Required Fields
  if (!name || !email || !password) {
    res.status(400).json({ message: 'All fields are required' });
    return;
  }
  try {
    // Check Email Duplicate
    const exitingCustomer = await prisma.customer.findUnique({
      where: { email },
    });
    if (exitingCustomer) {
      res.status(400).json({ message: 'Email already exists' });
      return;
    }
    // Hash Password
    const hashedPassword = await hashPassword(password);

    // Create Customer
    const createCustomer = await prisma.customer.create({
      data: {
        name: name,
        email: email,
        password: hashedPassword,
      },
    });

    //  Success Response
    baseLogger.info(
      `Customer registered successfully | customer-id: ${createCustomer.id}`
    );
    res.status(201).json({
      success: true,
      message: 'Customer Registration successful! Please log in.',
      data: {
        id: createCustomer.id,
        name: createCustomer.name,
      },
      redirectUrl: '/auth/login',
    });
  } catch (error) {
    if (error instanceof Error) {
      baseLogger.error('Error registering customer', {
        error: error.message,
        stack: error.stack ?? 'No stack trace available',
      });
    } else {
      baseLogger.error('Error registering customer', { error: String(error) });
    }
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

export const loginAuth = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  //  Check Required Fields
  if (!email || !password) {
    res.status(400).json({ message: 'Email and password are required' });
  }

  try {
    // Check Login
    const user = await prisma.customer.findUnique({
      where: {
        email: email,
      },
    });

    // Check login
    if (!user) {
      res.status(401).json({ message: 'Not Registered' });
      return;
    }
    // Check Customer if Deleted
    if (user.isDeleted) {
      res.status(403).json({ message: 'Account is deactivated' });
      return;
    }
    // Check Password
    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }
    // Generate JWT Token
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );

    // Set token in HTTP-only cookie
    res.cookie('token', `Bearer ${token}`, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600 * 1000,
    });

    // Tentukan redirect URL berdasarkan role
    // const redirectUrl = ROUTES[user.role] || ROUTES.default;
    // if (redirectUrl === ROUTES.default) {
    //   baseLogger.warn(`Unknown role detected: ${user.role}`);
    // }

    // Success Response
    // baseLogger.info(`Login successfully | role: ${user.role}`);
    // res.status(201).json({
    //   success: true,
    //   message: 'Login Successful',
    //   data: {
    //     id: user.id,
    //     name: user.name,
    //     role: user.role,
    //     redirectUrl: redirectUrl,
    //   },
    // });
  } catch (error) {
    if (error instanceof Error) {
      baseLogger.error('Error login', {
        error: error.message,
        stack: error.stack ?? 'No stack trace available',
      });
    } else {
      baseLogger.error('Error login', { error: String(error) });
    }
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};

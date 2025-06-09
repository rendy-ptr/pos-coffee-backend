import type { Request, Response } from 'express';
import { PrismaClient, RoleType } from '@prisma/client';
import { hashPassword, comparePassword } from '@/utils/hash';
import jwt from 'jsonwebtoken';
import { baseLogger } from '@/middlewares/logger';

const prisma = new PrismaClient();

export const registerCustomer = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { name, email, password } = req.body;

  // Check Required Fields
  if (!name || !email || !password) {
    res.status(400).json({ message: 'All fields are required' });
  }
  try {
    // Check Email Duplicate
    const exitingCustomer = await prisma.customer.findUnique({
      where: { email },
    });
    if (exitingCustomer) {
      res.status(400).json({ message: 'Email already exists' });
    }
    // Hash Password
    const hashedPassword = await hashPassword(password);

    // Create Customer
    const createCustomer = await prisma.customer.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: RoleType.customer,
      },
    });

    //  Success Response
    baseLogger.info(
      `Customer registered successfully | customer-id: ${createCustomer.id}`
    );
    res.status(201).json({
      success: true,
      message: 'Customer registered successfully',
      data: {
        id: createCustomer.id,
        name: createCustomer.name,
      },
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
    // Check Customer
    const customer = await prisma.customer.findUnique({ where: { email } });

    // Check Customer if role is customer
    if (!customer || customer.role !== RoleType.customer) {
      res.status(401).json({ message: 'Invalid email or role' });
      return;
    }
    // Check Customer if Deleted
    if (customer.is_deleted) {
      res.status(403).json({ message: 'Account is deactivated' });
      return;
    }
    // Check Password
    const isPasswordValid = await comparePassword(password, customer.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Invalid email or password' });
      return;
    }
    // Generate JWT Token
    const token = jwt.sign(
      {
        id: customer.id,
        email: customer.email,
        role: customer.role,
      },
      process.env.JWT_SECRET as string,
      { expiresIn: '1h' }
    );
    // Success Response
    res.status(201).json({
      message: 'Login Successful',
      data: {
        id: customer.id,
        name: customer.name,
        token: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error('Error logging in customer:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

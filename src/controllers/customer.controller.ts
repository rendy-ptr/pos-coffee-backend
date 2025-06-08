import type { Request, Response } from 'express';
import { PrismaClient, RoleType } from '@prisma/client';
import { hashPassword, comparePassword } from '../utils/hash.ts';
import jwt from 'jsonwebtoken';

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
    res.status(201).json({
      message: 'Customer created successfully',
      data: {
        id: createCustomer.id,
        name: createCustomer.name,
        email: createCustomer.email,
        role: createCustomer.role,
      },
    });
  } catch (error) {
    console.error('Error registering customer:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

export const loginCustomer = async (
  req: Request,
  res: Response
): Promise<void> => {
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
        email: customer.email,
        role: customer.role,
        token: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error('Error logging in customer:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

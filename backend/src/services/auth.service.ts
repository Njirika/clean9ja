import { prisma } from '../config/prisma';
import bcrypt from 'bcryptjs';
import { ApiError } from '../utils/ApiError';
import { generateToken } from '../utils/jwt';
import { dispatchEmail } from './dispatch.service';

export class AuthService {
  async register(data: any) {
    const { firstName, lastName, email, phone, password } = data;

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { phone }],
      },
    });

    if (existingUser) {
      throw new ApiError(400, 'User with this email or phone already exists.');
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        firstName,
        lastName,
        email,
        phone,
        passwordHash,
        role: 'customer',
      },
    });

    const token = generateToken(user.id, user.role);

    // Fire-and-forget welcome email (queued on a worker host, inline on serverless).
    await dispatchEmail({ name: 'welcome', data: { to: user.email, name: user.firstName } });

    return { user, token };
  }

  async login(data: any) {
    const { email, password } = data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      throw new ApiError(401, 'Invalid email or password.');
    }

    const token = generateToken(user.id, user.role);

    return { user, token };
  }

  async getMe(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        phone: true,
        role: true,
        avatarUrl: true,
        isVerified: true,
        preferredLanguage: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new ApiError(404, 'User not found.');
    }

    return user;
  }
}

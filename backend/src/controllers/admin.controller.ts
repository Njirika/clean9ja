import { Request, Response, NextFunction } from 'express';
import { prisma } from '../config/prisma';
import { ApiResponse } from '../utils/ApiResponse';

export const getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const totalUsers = await prisma.user.count({ where: { role: 'customer' } });
    const totalStaff = await prisma.user.count({ where: { role: { in: ['cleaner', 'admin'] } } });
    const totalBookings = await prisma.booking.count();

    // Calculate total earnings (sum of all completed bookings). Prefer the
    // finalPrice once set, otherwise fall back to the quoted price.
    const bookings = await prisma.booking.findMany({
      where: { status: 'completed' },
      select: { finalPrice: true, quotedPrice: true }
    });
    const totalEarnings = bookings.reduce(
      (sum: number, b: any) => sum + Number(b.finalPrice ?? b.quotedPrice),
      0
    );

    // Get recent bookings
    const recentBookings = await prisma.booking.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        customer: { select: { firstName: true, lastName: true, email: true } },
        service: { select: { name: true } }
      }
    });

    res.status(200).json(ApiResponse.success('Dashboard stats retrieved', {
      totalUsers,
      totalStaff,
      totalBookings,
      totalEarnings,
      recentBookings
    }));
  } catch (error) {
    next(error);
  }
};

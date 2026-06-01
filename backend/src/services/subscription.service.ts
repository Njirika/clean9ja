import { prisma } from '../config/prisma';

export class SubscriptionService {
  async getUserSubscriptions(userId: string) {
    return prisma.subscription.findMany({
      where: { customerId: userId },
      include: { service: true, address: true },
    });
  }

  async createSubscription(userId: string, data: any) {
    return prisma.subscription.create({
      data: {
        ...data,
        customerId: userId,
        nextBookingDate: new Date(data.nextBookingDate),
      },
    });
  }

  async updateSubscriptionStatus(id: string, userId: string, status: any) {
    return prisma.subscription.updateMany({
      where: { id, customerId: userId },
      data: { status },
    });
  }
}

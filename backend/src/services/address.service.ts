import { prisma } from '../config/prisma';
import { ApiError } from '../utils/ApiError';

export class AddressService {
  async getUserAddresses(userId: string) {
    return prisma.address.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAddressById(id: string, userId: string) {
    const address = await prisma.address.findUnique({
      where: { id },
    });
    if (!address || address.userId !== userId) {
      throw new ApiError(404, 'Address not found');
    }
    return address;
  }

  async createAddress(userId: string, data: any) {
    // If setting as default, unset others
    if (data.isDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    return prisma.address.create({
      data: {
        ...data,
        userId,
      },
    });
  }

  async updateAddress(id: string, userId: string, data: any) {
    const address = await this.getAddressById(id, userId);

    if (data.isDefault && !address.isDefault) {
      await prisma.address.updateMany({
        where: { userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    return prisma.address.update({
      where: { id },
      data,
    });
  }

  async deleteAddress(id: string, userId: string) {
    await this.getAddressById(id, userId);
    return prisma.address.delete({
      where: { id },
    });
  }
}

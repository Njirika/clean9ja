import { prisma } from '../config/prisma';
import { ApiError } from '../utils/ApiError';

export class ServiceService {
  async getAllServices(includeInactive = false) {
    return prisma.service.findMany({
      where: includeInactive ? {} : { isActive: true },
      orderBy: { sortOrder: 'asc' },
    });
  }

  async getServiceBySlug(slug: string) {
    const service = await prisma.service.findUnique({
      where: { slug },
    });
    if (!service) throw new ApiError(404, 'Service not found');
    return service;
  }

  async createService(data: any) {
    return prisma.service.create({ data });
  }

  async updateService(id: string, data: any) {
    return prisma.service.update({
      where: { id },
      data,
    });
  }

  async deleteService(id: string) {
    return prisma.service.delete({
      where: { id },
    });
  }

  async toggleServiceStatus(id: string, isActive: boolean) {
    return prisma.service.update({
      where: { id },
      data: { isActive },
    });
  }
}

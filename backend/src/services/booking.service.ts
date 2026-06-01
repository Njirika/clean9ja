import { prisma } from '../config/prisma';
import { ApiError } from '../utils/ApiError';
import { dispatchEmail, dispatchSms } from './dispatch.service';
import { calculateQuotePrice } from '../utils/pricing';

export class BookingService {
  async getQuote(serviceId: string, numberOfRooms?: number, propertySizeSqm?: number) {
    const service = await prisma.service.findUnique({ where: { id: serviceId } });
    if (!service) throw new ApiError(404, 'Service not found');

    const finalPrice = calculateQuotePrice(service, numberOfRooms, propertySizeSqm);

    return {
      serviceId: service.id,
      serviceName: service.name,
      basePrice: service.basePrice,
      quotedPrice: finalPrice,
      estimatedDurationMinutes: service.estimatedDurationMinutes,
    };
  }

  async createBooking(userId: string, data: any) {
    const quote = await this.getQuote(data.serviceId, data.numberOfRooms, data.propertySizeSqm);

    // Generate unique booking reference
    const bookingReference = `CLN-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;

    const booking = await prisma.booking.create({
      data: {
        bookingReference,
        customerId: userId,
        serviceId: data.serviceId,
        addressId: data.addressId,
        scheduledDate: new Date(data.scheduledDate),
        scheduledTimeSlot: data.scheduledTimeSlot,
        numberOfRooms: data.numberOfRooms,
        propertySizeSqm: data.propertySizeSqm,
        specialInstructions: data.specialInstructions,
        quotedPrice: quote.quotedPrice,
        status: 'pending',
      },
    });

    // Notify the customer (queued on a worker host, inline on serverless).
    const customer = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, phone: true, firstName: true },
    });
    if (customer) {
      const date = booking.scheduledDate.toDateString();
      await dispatchEmail({
        name: 'bookingConfirmation',
        data: { to: customer.email, name: customer.firstName, bookingRef: bookingReference, date },
      });
      await dispatchSms({ name: 'bookingReminder', data: { phone: customer.phone, date } });
    }

    return booking;
  }

  async getUserBookings(userId: string) {
    return prisma.booking.findMany({
      where: { customerId: userId },
      include: {
        service: { select: { name: true, imageUrl: true } },
        address: true,
        cleaner: { select: { user: { select: { firstName: true, lastName: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getAllBookings() {
    return prisma.booking.findMany({
      include: {
        customer: { select: { firstName: true, lastName: true, email: true } },
        service: { select: { name: true } },
        cleaner: { select: { user: { select: { firstName: true, lastName: true } } } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getBookingById(id: string, userId: string, userRole: string) {
    const booking = await prisma.booking.findUnique({
      where: { id },
      include: {
        service: true,
        address: true,
        customer: { select: { firstName: true, lastName: true, email: true, phone: true } },
        cleaner: { select: { user: { select: { firstName: true, lastName: true, phone: true } } } },
      },
    });

    if (!booking) throw new ApiError(404, 'Booking not found');

    if (userRole === 'customer' && booking.customerId !== userId) {
      throw new ApiError(403, 'You do not have permission to view this booking');
    }

    if (userRole === 'cleaner' && booking.assignedCleanerId !== userId) {
      throw new ApiError(403, 'You are not assigned to this booking');
    }

    return booking;
  }
}

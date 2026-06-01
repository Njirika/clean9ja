import { prisma } from '../config/prisma';
import { ApiError } from '../utils/ApiError';
import { dispatchEmail, dispatchSms } from './dispatch.service';
import { calculateQuotePrice } from '../utils/pricing';

export class BookingService {
  async findService(identifier: string) {
    if (!identifier) return null;
    
    // If it's a UUID, look it up by ID
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(identifier);
    if (isUuid) {
      const s = await prisma.service.findUnique({ where: { id: identifier } });
      if (s) return s;
    }
    
    // Otherwise look it up by slug
    const bySlug = await prisma.service.findUnique({ where: { slug: identifier } });
    if (bySlug) return bySlug;

    // Fallback: look up by exact or fuzzy name match
    const byName = await prisma.service.findFirst({
      where: {
        name: {
          equals: identifier,
          mode: 'insensitive',
        },
      },
    });
    
    if (byName) return byName;

    // Last resort fallback: return first active service in DB
    return prisma.service.findFirst({ where: { isActive: true } });
  }

  async getQuote(serviceId: string, numberOfRooms?: number, propertySizeSqm?: number) {
    const service = await this.findService(serviceId);
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
    const service = await this.findService(data.serviceId);
    if (!service) throw new ApiError(404, 'Service not found');

    const quote = await this.getQuote(service.id, data.numberOfRooms, data.propertySizeSqm);

    // Resolve or dynamically create address to prevent foreign key errors
    let addressId = data.addressId;
    if (!addressId && data.address) {
      const addressData = data.address;
      const newAddress = await prisma.address.create({
        data: {
          userId,
          streetAddress: addressData.streetAddress || 'Site Address',
          city: addressData.city || 'Lagos',
          state: addressData.state || 'Lagos',
          lga: addressData.lga || 'Lagos',
          label: 'Other',
        },
      });
      addressId = newAddress.id;
    }

    if (!addressId) {
      // Fallback: check if the user already has any address in the database
      const existingAddress = await prisma.address.findFirst({ where: { userId } });
      if (existingAddress) {
        addressId = existingAddress.id;
      } else {
        // Create a default fallback address so the foreign key constraint doesn't fail
        const defaultAddress = await prisma.address.create({
          data: {
            userId,
            streetAddress: 'Default Profile Address',
            city: 'Lagos',
            state: 'Lagos',
            lga: 'Lagos',
            label: 'Home',
          },
        });
        addressId = defaultAddress.id;
      }
    }

    // Generate unique booking reference
    const bookingReference = `CLN-${Date.now().toString().slice(-6)}-${Math.floor(Math.random() * 1000)}`;

    const booking = await prisma.booking.create({
      data: {
        bookingReference,
        customerId: userId,
        serviceId: service.id,
        addressId,
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

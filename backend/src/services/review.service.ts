import { prisma } from '../config/prisma';
import { ApiError } from '../utils/ApiError';

export class ReviewService {
  async createReview(userId: string, data: any) {
    const booking = await prisma.booking.findUnique({ where: { id: data.bookingId } });
    if (!booking) throw new ApiError(404, 'Booking not found');
    if (booking.customerId !== userId) throw new ApiError(403, 'Unauthorized');
    if (!booking.assignedCleanerId) throw new ApiError(400, 'No cleaner assigned to this booking');

    return prisma.review.create({
      data: {
        bookingId: data.bookingId,
        customerId: userId,
        cleanerId: booking.assignedCleanerId,
        rating: data.rating,
        comment: data.comment,
        beforePhotos: data.beforePhotos || [],
        afterPhotos: data.afterPhotos || [],
      },
    });
  }

  /** Public approved reviews for site-wide testimonials. */
  async getPublicReviews(limit = 9) {
    return prisma.review.findMany({
      where: { isPublic: true, comment: { not: null } },
      include: {
        customer: { select: { firstName: true, lastName: true, avatarUrl: true } },
        booking: { select: { service: { select: { name: true } } } },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
  }

  async getReviewsForCleaner(cleanerId: string) {
    return prisma.review.findMany({
      where: { cleanerId, isPublic: true },
      include: { customer: { select: { firstName: true, avatarUrl: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
}

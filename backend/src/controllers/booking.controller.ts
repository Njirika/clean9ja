import { Request, Response, NextFunction } from 'express';
import { BookingService } from '../services/booking.service';
import { ApiResponse } from '../utils/ApiResponse';

const bookingService = new BookingService();

export const getQuote = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { serviceId, numberOfRooms, propertySizeSqm } = req.body;
    const quote = await bookingService.getQuote(serviceId, numberOfRooms, propertySizeSqm);
    res.status(200).json(ApiResponse.success('Quote generated', quote));
  } catch (error) {
    next(error);
  }
};

export const createBooking = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const booking = await bookingService.createBooking(req.user.id, req.body);
    res.status(201).json(ApiResponse.success('Booking created', booking));
  } catch (error) {
    next(error);
  }
};

export const getBookings = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let bookings;
    if (req.user.role === 'admin') {
      bookings = await bookingService.getAllBookings();
    } else {
      bookings = await bookingService.getUserBookings(req.user.id);
    }
    res.status(200).json(ApiResponse.success('Bookings retrieved', bookings));
  } catch (error) {
    next(error);
  }
};

export const getBookingById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const booking = await bookingService.getBookingById(req.params.id as string, req.user.id, req.user.role);
    res.status(200).json(ApiResponse.success('Booking retrieved', booking));
  } catch (error) {
    next(error);
  }
};

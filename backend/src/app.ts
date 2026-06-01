import express, { Application, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import { env } from './config/env';
import { errorHandler } from './middlewares/error.middleware';
import { ApiError } from './utils/ApiError';
import { ApiResponse } from './utils/ApiResponse';

import authRoutes from './routes/auth.routes';
import serviceRoutes from './routes/service.routes';
import addressRoutes from './routes/address.routes';
import bookingRoutes from './routes/booking.routes';
import subscriptionRoutes from './routes/subscription.routes';
import reviewRoutes from './routes/review.routes';
import promoRoutes from './routes/promo.routes';
import blogRoutes from './routes/blog.routes';
import uploadRoutes from './routes/upload.routes';
import adminRoutes from './routes/admin.routes';
import notificationRoutes from './routes/notification.routes';
import path from 'path';
import { apiLimiter } from './middlewares/rateLimiter.middleware';

const app: Application = express();

// Set security HTTP headers
app.use(helmet());

// Parse json request body
app.use(express.json());

// Parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// Parse cookies
app.use(cookieParser());

// Enable CORS
app.use(
  cors({
    origin: env.frontendUrl,
    credentials: true,
  })
);

// Serve static files from the uploads directory
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));

// HTTP request logger middleware
if (env.nodeEnv === 'development') {
  app.use(morgan('dev'));
}

// Basic Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false,
  message: ApiResponse.error('Too many requests, please try again later.'),
});
app.use('/api', limiter);

// Health check endpoint
app.get('/api/health', (req: Request, res: Response) => {
  res.status(200).json(ApiResponse.success('Server is healthy'));
});

// Apply rate limiter to all API routes
app.use('/api', apiLimiter);

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/subscriptions', subscriptionRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/promo-codes', promoRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);

// Send back a 404 error for any unknown api request
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new ApiError(404, 'Not found'));
});

// Centralized error handler
app.use(errorHandler);

export default app;

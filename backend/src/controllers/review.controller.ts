import { Request, Response, NextFunction } from 'express';
import { ReviewService } from '../services/review.service';
import { ApiResponse } from '../utils/ApiResponse';

const reviewService = new ReviewService();

export const createReview = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const review = await reviewService.createReview(req.user.id, req.body);
    res.status(201).json(ApiResponse.success('Review submitted successfully', review));
  } catch (error) {
    next(error);
  }
};

export const getPublicReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : undefined;
    const reviews = await reviewService.getPublicReviews(limit);
    res.status(200).json(ApiResponse.success('Public reviews retrieved', reviews));
  } catch (error) {
    next(error);
  }
};

export const getCleanerReviews = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const reviews = await reviewService.getReviewsForCleaner(req.params.cleanerId as string);
    res.status(200).json(ApiResponse.success('Reviews retrieved', reviews));
  } catch (error) {
    next(error);
  }
};

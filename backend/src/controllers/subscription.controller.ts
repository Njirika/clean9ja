import { Request, Response, NextFunction } from 'express';
import { SubscriptionService } from '../services/subscription.service';
import { ApiResponse } from '../utils/ApiResponse';

const subscriptionService = new SubscriptionService();

export const getUserSubscriptions = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subscriptions = await subscriptionService.getUserSubscriptions(req.user.id);
    res.status(200).json(ApiResponse.success('Subscriptions retrieved', subscriptions));
  } catch (error) {
    next(error);
  }
};

export const createSubscription = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const subscription = await subscriptionService.createSubscription(req.user.id, req.body);
    res.status(201).json(ApiResponse.success('Subscription created', subscription));
  } catch (error) {
    next(error);
  }
};

export const updateSubscriptionStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await subscriptionService.updateSubscriptionStatus(req.params.id as string, req.user.id, req.body.status);
    res.status(200).json(ApiResponse.success('Subscription status updated'));
  } catch (error) {
    next(error);
  }
};

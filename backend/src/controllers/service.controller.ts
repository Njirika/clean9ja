import { Request, Response, NextFunction } from 'express';
import { ServiceService } from '../services/service.service';
import { ApiResponse } from '../utils/ApiResponse';

const serviceService = new ServiceService();

export const getAllServices = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const includeInactive = req.user?.role === 'admin' && req.query.includeInactive === 'true';
    const services = await serviceService.getAllServices(includeInactive);
    res.status(200).json(ApiResponse.success('Services retrieved', services));
  } catch (error) {
    next(error);
  }
};

export const getServiceBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const service = await serviceService.getServiceBySlug(req.params.slug as string);
    res.status(200).json(ApiResponse.success('Service retrieved', service));
  } catch (error) {
    next(error);
  }
};

export const createService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const service = await serviceService.createService(req.body);
    res.status(201).json(ApiResponse.success('Service created', service));
  } catch (error) {
    next(error);
  }
};

export const updateService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const service = await serviceService.updateService(req.params.id as string, req.body);
    res.status(200).json(ApiResponse.success('Service updated', service));
  } catch (error) {
    next(error);
  }
};

export const deleteService = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await serviceService.deleteService(req.params.id as string);
    res.status(200).json(ApiResponse.success('Service deleted'));
  } catch (error) {
    next(error);
  }
};

export const toggleServiceStatus = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const service = await serviceService.toggleServiceStatus(req.params.id as string, req.body.isActive);
    res.status(200).json(ApiResponse.success('Service status updated', service));
  } catch (error) {
    next(error);
  }
};

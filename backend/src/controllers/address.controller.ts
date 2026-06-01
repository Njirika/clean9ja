import { Request, Response, NextFunction } from 'express';
import { AddressService } from '../services/address.service';
import { ApiResponse } from '../utils/ApiResponse';

const addressService = new AddressService();

export const getUserAddresses = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const addresses = await addressService.getUserAddresses(req.user.id);
    res.status(200).json(ApiResponse.success('Addresses retrieved', addresses));
  } catch (error) {
    next(error);
  }
};

export const getAddressById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const address = await addressService.getAddressById(req.params.id as string, req.user.id);
    res.status(200).json(ApiResponse.success('Address retrieved', address));
  } catch (error) {
    next(error);
  }
};

export const createAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const address = await addressService.createAddress(req.user.id, req.body);
    res.status(201).json(ApiResponse.success('Address created', address));
  } catch (error) {
    next(error);
  }
};

export const updateAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const address = await addressService.updateAddress(req.params.id as string, req.user.id, req.body);
    res.status(200).json(ApiResponse.success('Address updated', address));
  } catch (error) {
    next(error);
  }
};

export const deleteAddress = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await addressService.deleteAddress(req.params.id as string, req.user.id);
    res.status(200).json(ApiResponse.success('Address deleted'));
  } catch (error) {
    next(error);
  }
};

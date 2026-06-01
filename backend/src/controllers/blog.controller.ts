import { Request, Response, NextFunction } from 'express';
import { BlogService } from '../services/blog.service';
import { ApiResponse } from '../utils/ApiResponse';

const blogService = new BlogService();

export const getAllPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const includeUnpublished = req.user?.role === 'admin' && req.query.includeUnpublished === 'true';
    const posts = await blogService.getAllPosts(includeUnpublished);
    res.status(200).json(ApiResponse.success('Blog posts retrieved', posts));
  } catch (error) {
    next(error);
  }
};

export const getPostBySlug = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await blogService.getPostBySlug(req.params.slug as string);
    res.status(200).json(ApiResponse.success('Blog post retrieved', post));
  } catch (error) {
    next(error);
  }
};

export const createPost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await blogService.createPost(req.body);
    res.status(201).json(ApiResponse.success('Blog post created', post));
  } catch (error) {
    next(error);
  }
};

export const updatePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const post = await blogService.updatePost(req.params.id as string, req.body);
    res.status(200).json(ApiResponse.success('Blog post updated', post));
  } catch (error) {
    next(error);
  }
};

export const deletePost = async (req: Request, res: Response, next: NextFunction) => {
  try {
    await blogService.deletePost(req.params.id as string);
    res.status(200).json(ApiResponse.success('Blog post deleted'));
  } catch (error) {
    next(error);
  }
};

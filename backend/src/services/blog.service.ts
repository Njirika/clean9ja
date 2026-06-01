import { prisma } from '../config/prisma';
import { ApiError } from '../utils/ApiError';

export class BlogService {
  async getAllPosts(includeUnpublished = false) {
    return prisma.blogPost.findMany({
      where: includeUnpublished ? {} : { isPublished: true },
      orderBy: { publishedDate: 'desc' },
    });
  }

  async getPostBySlug(slug: string) {
    const post = await prisma.blogPost.findUnique({ where: { slug } });
    if (!post) throw new ApiError(404, 'Blog post not found');
    return post;
  }

  async createPost(data: any) {
    return prisma.blogPost.create({ data });
  }

  async updatePost(id: string, data: any) {
    return prisma.blogPost.update({ where: { id }, data });
  }

  async deletePost(id: string) {
    return prisma.blogPost.delete({ where: { id } });
  }
}

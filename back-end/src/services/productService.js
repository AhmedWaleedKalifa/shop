import prisma from '../config/db.js';

export const createProduct = async (data) => {
  return await prisma.product.create({ data });
};

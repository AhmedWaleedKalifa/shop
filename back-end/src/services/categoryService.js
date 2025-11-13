import prisma from '../config/db.js';

export const createCategory = async (data) => {
  return await prisma.category.create({ data });
};

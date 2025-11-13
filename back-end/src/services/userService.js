import prisma from '../config/db.js';

export const createUser = async (data) => {
  return await prisma.user.create({ data });
};

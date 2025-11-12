import prisma from '../config/db.js';

export const createProduct = async (data) => {
  return await prisma.product.create({ data });
};

export const matchProducts = async (productId, matchId) => {
  return await prisma.product.update({
    where: { id: productId },
    data: {
      matches: {
        connect: { id: matchId }
      }
    },
    include: { matches: true }
  });
};

export const getProductMatches = async (id) => {
  return await prisma.product.findUnique({
    where: { id: Number(id) },
    include: { matches: true }
  });
};

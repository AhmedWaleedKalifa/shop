const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.create({
    data:{
      email:"ahmed2210waleed@gmail.com",
      name:"Ahmed",
      role:"ADMIN",
      password:"WsAaZyM3023593"
    }
  })
  console.log(user)
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

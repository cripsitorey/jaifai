
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const users = await prisma.user.findMany();
  console.log('--- USERS IN DB ---');
  users.forEach(u => {
      console.log(`User: ${u.username}, Tenant: ${u.tenantId}, Hash: ${u.passwordHash.substring(0, 10)}...`);
  });
  console.log('-------------------');
}

main()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());

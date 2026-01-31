
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  // 1. Create Tenant
  const tenant = await prisma.tenant.create({
    data: {
      name: 'Residencial El Bosque',
      slug: 'el-bosque',
      address: 'Av. Principal 123',
    }
  });

  console.log('Created Tenant:', tenant.name);

  // 2. Create Property
  const property = await prisma.property.create({
    data: {
      tenantId: tenant.id,
      identifier: 'Admin Unit',
      isClaimed: true,
    }
  });

  // 3. Create Admin User
  const passwordHash = await bcrypt.hash('admin123', 10);
  
  const admin = await prisma.user.create({
    data: {
      tenantId: tenant.id,
      propertyId: property.id,
      username: 'admin',
      passwordHash,
      role: 'ADMIN',
    }
  });

  console.log('Created User: admin / admin123');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

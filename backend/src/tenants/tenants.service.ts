import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Tenant, Property } from '@prisma/client';

@Injectable()
export class TenantsService {
  constructor(private prisma: PrismaService) {}

  async findAll(): Promise<Tenant[]> {
    return this.prisma.tenant.findMany();
  }

  async findOne(id: string): Promise<Tenant | null> {
    return this.prisma.tenant.findUnique({
      where: { id },
      include: { properties: true },
    });
  }

  async create(data: { name: string; slug: string; address?: string }): Promise<Tenant> {
    return this.prisma.tenant.create({
      data,
    });
  }

  async findBySlug(slug: string): Promise<Tenant | null> {
    return this.prisma.tenant.findUnique({
      where: { slug },
    });
  }
}

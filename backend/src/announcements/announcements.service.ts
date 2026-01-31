import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AnnouncementsService {
  constructor(private prisma: PrismaService) {}

  async findAll(tenantId: string) {
    return this.prisma.announcement.findMany({
      where: { tenantId },
      orderBy: { createdAt: 'desc' },
    });
  }
}

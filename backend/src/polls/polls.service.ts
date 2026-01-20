import { Injectable, BadRequestException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { randomBytes, createHash } from 'crypto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PollsService {
  constructor(private prisma: PrismaService) {}

  async create(data: any) {
    return this.prisma.poll.create({ data });
  }

  async findAll(tenantId: string, propertyId?: string) {
    const polls = await this.prisma.poll.findMany({ 
        where: { tenantId }, 
        include: { options: true },
        orderBy: { createdAt: 'desc' }
    });

    if (!propertyId) {
        return polls.map(poll => ({ ...poll, hasVoted: false }));
    }

    const receipts = await this.prisma.voteReceipt.findMany({
        where: {
            propertyId,
            pollId: { in: polls.map(p => p.id) }
        }
    });

    const votedPollIds = new Set(receipts.map(r => r.pollId));

    return polls.map(poll => ({
        ...poll,
        hasVoted: votedPollIds.has(poll.id)
    }));
  }

  async findOne(id: string) {
    return this.prisma.poll.findUnique({ where: { id }, include: { options: true } });
  }

  async castVote(userId: string, pollId: string, optionId: string) {
    // 1. Fetch User details (Property check)
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { property: true },
    });

    if (!user || !user.propertyId) {
       throw new BadRequestException('User must be linked to a property to vote.');
    }

    // 2. Fetch Poll and Validate
    const poll = await this.prisma.poll.findUnique({ where: { id: pollId } });
    if (!poll || !poll.isActive) {
        throw new BadRequestException('Poll is not active.');
    }
    const now = new Date();
    if (now < poll.startDate || now > poll.endDate) {
        throw new BadRequestException('Poll is not currently open.');
    }

    // 3. Check for Double Voting (VoteReceipt)
    const existingReceipt = await this.prisma.voteReceipt.findUnique({
        where: {
            pollId_propertyId: {
                pollId,
                propertyId: user.propertyId,
            }
        }
    });

    if (existingReceipt) {
        throw new ConflictException('This property has already voted in this poll.');
    }

    // 4. Record Vote Transactionally
    // Generate an anonymous hash for receipt
    const receiptHash = createHash('sha256')
      .update(`${pollId}-${user.propertyId}-${randomBytes(16).toString('hex')}`)
      .digest('hex');

    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
        // Increment Option Count
        await tx.pollOption.update({
            where: { id: optionId },
            data: { voteCount: { increment: 1 } },
        });

        // Create Receipt
        const receipt = await tx.voteReceipt.create({
            data: {
                pollId,
                propertyId: user.propertyId!, // We already checked user.propertyId is truthy above
                encryptedHash: receiptHash,
            }
        });

        // Log Audit (Simplified)
        await tx.auditLog.create({
            data: {
                tenantId: user.tenantId,
                action: 'VOTE_CAST',
                automatedMessage: `Vote cast for poll ${pollId} by property ${user.propertyId}`,
            }
        });

        return receipt;
    });
  }
}

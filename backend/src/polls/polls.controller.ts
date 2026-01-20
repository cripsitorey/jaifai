import { Controller, Get, Post, Body, Param, UseGuards, Request } from '@nestjs/common';
import { PollsService } from './polls.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // Will create this guard next

@Controller('polls')
export class PollsController {
  constructor(private readonly pollsService: PollsService) {}

  @Post()
  // @UseGuards(JwtAuthGuard) // Commented out until guard is created
  create(@Body() createPollDto: any) {
    return this.pollsService.create(createPollDto);
  }

  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@Request() req: any) {
    return this.pollsService.findAll(req.user?.tenantId, req.user?.propertyId); 
  }

  @Post(':id/vote')
  @UseGuards(JwtAuthGuard)
  async vote(@Param('id') pollId: string, @Body('optionId') optionId: string, @Request() req: any) {
      return this.pollsService.castVote(req.user.userId, pollId, optionId);
  }
}

import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';
import { TenantsModule } from './tenants/tenants.module';
import { PollsModule } from './polls/polls.module';

import { BackOfficeModule } from './admin/admin.module';

@Module({
  imports: [PrismaModule, AuthModule, TenantsModule, PollsModule, BackOfficeModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

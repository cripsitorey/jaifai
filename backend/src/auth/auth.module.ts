import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { QrService } from './qr.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'secretKey', // In production, use env var
      signOptions: { expiresIn: '365d' }, // 365 days as requested
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, QrService],
  exports: [AuthService, QrService],
})
export class AuthModule {}

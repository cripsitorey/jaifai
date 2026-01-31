import { Controller, Post, Body, Get, UseGuards, Request, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() req: any) {
    // Ideally use a LocalAuthGuard, but for scaffolding simple body check:
    const user = await this.authService.validateUser(req.username, req.password);
    if (!user) {
        throw new UnauthorizedException('Invalid credentials');
    }
    return this.authService.login(user);
  }

  @Post('claim')
  async claim(@Body() body: { token: string; username: string; password: string }) {
    return this.authService.claimProperty(body.token, body.username, body.password);
  }
}

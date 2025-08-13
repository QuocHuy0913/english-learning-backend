import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { UsersService } from '../users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('register')
  async register(@Body() userDTO: RegisterDto) {
    return await this.authService.register(
      userDTO.name,
      userDTO.email,
      userDTO.password,
    );
  }

  @Post('login')
  async login(@Body() userDTO: LoginDto) {
    return await this.authService.login(userDTO.email, userDTO.password);
  }

  @Post('refresh')
  async refresh(@Body() body: { refreshToken: string }) {
    return await this.authService.setRefreshToken(body.refreshToken);
  }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  async profile(@Req() req: any) {
    const user = await this.usersService.findById(req.user.id);
    return user;
  }
}

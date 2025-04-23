import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import {
  ApiTags,
  ApiResponse,
  ApiOperation,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @ApiOperation({ summary: 'realizar login' })
  @ApiResponse({
    status: 200,
    example: {
      success: true,
      data: {
        access_token: 'string',
      },
    },
  })
  @ApiUnauthorizedResponse({
    example: {
      success: false,
      message: 'Email ou senha inválida',
      path: '/auth/login',
      timestamp: '2025-04-23T18:25:59.825Z',
    },
  })
  async login(@Body() dto: LoginDto) {
    const user = await this.authService.validateUser(dto.email, dto.password);

    return { data: await this.authService.login(user.email, user.id) };
  }
}

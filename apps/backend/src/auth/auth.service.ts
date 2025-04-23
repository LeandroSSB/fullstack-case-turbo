import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import * as bcrypt from 'bcrypt';
import { WinstonLogger } from 'src/logger/logger.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UserService,
    private jwtService: JwtService,
    private readonly logger: WinstonLogger,
  ) {}

  async validateUser(email: string, password: string) {
    // Lógica que permite caso necessário, o usuário saber se o usuário existe ou não
    const user = await this.userService.findByEmail(email);
    if (!user) {
      this.logger.warn(`Usuario não encontrado para o email: ${email}`);
      throw new UnauthorizedException('Email ou senha inválida');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      this.logger.warn(`Senha incorreta para o email: ${email}`);
      throw new UnauthorizedException('Email ou senha inválida');
    }

    return user;
  }

  async login(email: string, id: number) {
    const payload = { email, sub: id };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

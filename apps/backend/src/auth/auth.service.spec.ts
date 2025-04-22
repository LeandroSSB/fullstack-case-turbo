import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { JwtService } from '@nestjs/jwt';
import { WinstonLogger } from '../logger/logger.service';
import * as bcrypt from 'bcrypt';
import { UnauthorizedException } from '@nestjs/common';

jest.mock('bcrypt');

describe('AuthService', () => {
  let service: AuthService;
  let userService: UserService;
  let jwtService: JwtService;
  let logger: WinstonLogger;

  const mockUserService = {
    findByEmail: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn(),
  };

  const mockLogger = {
    warn: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: UserService, useValue: mockUserService },
        { provide: JwtService, useValue: mockJwtService },
        { provide: WinstonLogger, useValue: mockLogger },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userService = module.get<UserService>(UserService);
    jwtService = module.get<JwtService>(JwtService);
    logger = module.get<WinstonLogger>(WinstonLogger);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return the user if email and password are valid', async () => {
      const email = 'test@email.com';
      const password = '123456';
      const user = { id: 1, email, password: 'hashed_password' };

      mockUserService.findByEmail.mockResolvedValue(user);

      const spy = jest.spyOn(bcrypt, 'compare').mockImplementation(async () => true);

      const result = await service.validateUser(email, password);

      expect(mockUserService.findByEmail).toHaveBeenCalledWith(email);
      expect(spy).toHaveBeenCalledWith(password, user.password);
      expect(result).toEqual(user);
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      const email = 'test@email.com';
      const password = '123456';

      mockUserService.findByEmail.mockResolvedValue(null);

      await expect(service.validateUser(email, password)).rejects.toThrow(UnauthorizedException);
      expect(mockUserService.findByEmail).toHaveBeenCalledWith(email);
      expect(logger.warn).toHaveBeenCalledWith(`Usuario não encontrado para o email: ${email}`);
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const email = 'test@email.com';
      const password = '123456';
      const user = { id: 1, email, password: 'hashed_password' };

      mockUserService.findByEmail.mockResolvedValue(user);
      const spy = jest.spyOn(bcrypt, 'compare').mockImplementation(async () => false);

      await expect(service.validateUser(email, password)).rejects.toThrow(UnauthorizedException);
      expect(mockUserService.findByEmail).toHaveBeenCalledWith(email);
      expect(spy).toHaveBeenCalledWith(password, user.password);
      expect(logger.warn).toHaveBeenCalledWith(`Senha incorreta para o email: ${email}`);
    });
  });

  describe('login', () => {
    it('should return an access token', async () => {
      const email = 'test@email.com';
      const id = 1;
      const token = 'mocked_token';

      mockJwtService.sign.mockReturnValue(token);

      const result = await service.login(email, id);

      expect(mockJwtService.sign).toHaveBeenCalledWith({ email, sub: id });
      expect(result).toEqual({ access_token: token });
    });
  });
});
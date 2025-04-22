import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  const mockAuthService = {
    validateUser: jest.fn(),
    login: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should return an access token if credentials are valid', async () => {
      const dto: LoginDto = { email: 'test@email.com', password: '123456' };
      const user = { id: 1, email: dto.email };
      const token = { access_token: 'mocked_token' };

      mockAuthService.validateUser.mockResolvedValue(user);
      mockAuthService.login.mockResolvedValue(token);

      const result = await controller.login(dto);

      expect(mockAuthService.validateUser).toHaveBeenCalledWith(dto.email, dto.password);
      expect(mockAuthService.login).toHaveBeenCalledWith(user.email, user.id);
      expect(result).toEqual({ data: token });
    });

    it('should throw UnauthorizedException if credentials are invalid', async () => {
      const dto: LoginDto = { email: 'test@email.com', password: 'wrong_password' };

      mockAuthService.validateUser.mockRejectedValue(new UnauthorizedException());

      await expect(controller.login(dto)).rejects.toThrow(UnauthorizedException);
      expect(mockAuthService.validateUser).toHaveBeenCalledWith(dto.email, dto.password);
    });
  });
});
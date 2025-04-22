import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { WinstonLogger } from '../logger/logger.service';
import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';
import { NotFoundException, HttpException, HttpStatus } from '@nestjs/common';

describe('UserController', () => {
  let controller: UserController;
  let userService: UserService;
  let logger: WinstonLogger;

  const mockUserService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    findByEmail: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  };

  const mockLogger = {
    log: jest.fn(),
    warn: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        { provide: UserService, useValue: mockUserService },
        { provide: WinstonLogger, useValue: mockLogger },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
    logger = module.get<WinstonLogger>(WinstonLogger);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a user successfully', async () => {
      const dto: CreateUserDto = { email: 'test@email.com', name: 'Test', password: '123456' };
      mockUserService.findByEmail.mockResolvedValue(null);
      mockUserService.create.mockResolvedValue({ id: 1, ...dto });

      const result = await controller.create(dto);

      expect(mockUserService.findByEmail).toHaveBeenCalledWith(dto.email);
      expect(mockUserService.create).toHaveBeenCalledWith(dto);
      expect(logger.log).toHaveBeenCalledWith(`Usuário criado: ${dto.email}`);
      expect(result).toEqual({ message: 'Usuário criado com sucesso', data: { id: 1, ...dto } });
    });

    it('should throw conflict exception if email already exists', async () => {
      const dto: CreateUserDto = { email: 'test@email.com', name: 'Test', password: '123456' };
      mockUserService.findByEmail.mockResolvedValue({ id: 1, ...dto });

      await expect(controller.create(dto)).rejects.toThrow(
        new HttpException('A user with this email already exists', HttpStatus.CONFLICT),
      );
      expect(mockUserService.findByEmail).toHaveBeenCalledWith(dto.email);
    });
  });

  describe('findAll', () => {
    it('should return all users', async () => {
      const users = [{ id: 1, name: 'User1', email: 'user1@email.com' }];
      mockUserService.findAll.mockResolvedValue(users);

      const result = await controller.findAll();

      expect(mockUserService.findAll).toHaveBeenCalled();
      expect(result).toEqual({ message: '', data: users });
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      const user = { id: 1, name: 'User1', email: 'user1@email.com' };
      mockUserService.findOne.mockResolvedValue(user);

      const result = await controller.findOne(1);

      expect(mockUserService.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual({ message: '', data: user });
    });

    it('should throw NotFoundException if user does not exist', async () => {
      mockUserService.findOne.mockResolvedValue(null);

      await expect(controller.findOne(1)).rejects.toThrow(NotFoundException);
      expect(mockUserService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('should update a user successfully', async () => {
      const dto: UpdateUserDto = { name: 'Updated Name' };
      const user = { id: 1, name: 'Updated Name', email: 'user1@email.com' };
      mockUserService.findOne.mockResolvedValue(user);
      mockUserService.update.mockResolvedValue(user);

      const result = await controller.update(1, dto);

      expect(mockUserService.findOne).toHaveBeenCalledWith(1);
      expect(mockUserService.update).toHaveBeenCalledWith(1, dto);
      expect(logger.log).toHaveBeenCalledWith(`Usuário atualizado: ID 1`);
      expect(result).toEqual({ message: 'Usuário atualizado com sucesso', data: user });
    });

    it('should throw NotFoundException if user does not exist', async () => {
      const dto: UpdateUserDto = { name: 'Updated Name' };
      mockUserService.findOne.mockResolvedValue(null);

      await expect(controller.update(1, dto)).rejects.toThrow(NotFoundException);
      expect(mockUserService.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('remove', () => {
    it('should delete a user successfully', async () => {
      const user = { id: 1, name: 'User1', email: 'user1@email.com' };
      mockUserService.findOne.mockResolvedValue(user);
      mockUserService.delete.mockResolvedValue(user);

      const result = await controller.remove(1);

      expect(mockUserService.findOne).toHaveBeenCalledWith(1);
      expect(mockUserService.delete).toHaveBeenCalledWith(1);
      expect(logger.warn).toHaveBeenCalledWith(`Usuário removido: ID 1`);
      expect(result).toEqual({ message: 'Usuário removido com sucesso', data: user });
    });

    it('should throw NotFoundException if user does not exist', async () => {
      mockUserService.findOne.mockResolvedValue(null);

      await expect(controller.remove(1)).rejects.toThrow(NotFoundException);
      expect(mockUserService.findOne).toHaveBeenCalledWith(1);
    });
  });

});

import { UserService } from './user.service';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';

jest.mock('bcrypt');

describe('UserService', () => {
  let service: UserService;
  let prisma: DeepMockProxy<PrismaService>;
  let cacheManager: { del: jest.Mock };

  beforeEach(() => {
    prisma = mockDeep<PrismaService>();
    cacheManager = { del: jest.fn() };
    service = new UserService(prisma, cacheManager as any);
  });

  it('should create a user with hashed password', async () => {
    const dto: CreateUserDto = {
      email: 'test@email.com',
      name: 'Test',
      password: '123456',
    };

    prisma.user.create.mockResolvedValue({
      id: 1,
      ...dto,
      password: 'hashed',
      createdAt: new Date(),
      updatedAt: new Date(),
    });

    const spy = jest
      .spyOn(bcrypt, 'hash')
      .mockImplementation(async () => 'mocked_hash');

    await service.create(dto);

    expect(spy).toHaveBeenCalledWith('123456', undefined);
    expect(spy).toHaveBeenCalledTimes(1);

    expect(prisma.user.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({ email: dto.email }),
      }),
    );
    expect(cacheManager.del).toHaveBeenCalledWith('/users');

    spy.mockRestore();
  });

  it('should find user by id', async () => {
    const user = { id: 1, email: 'test@email.com' };

    prisma.user.findUnique.mockResolvedValue(user as any);

    const result = await service.findOne(1);

    expect(result).toBeDefined();
    expect(result).toEqual(user);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { id: 1 },
      select: { id: true, name: true, email: true },
    });
  });

  it('should find all users', async () => {
    const users = [
      {
        id: 1,
        name: 'User1',
        email: 'user1@email.com',
        password: 'hashed',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        name: 'User2',
        email: 'user2@email.com',
        password: 'hashed',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    prisma.user.findMany.mockResolvedValue(users);

    const result = await service.findAll();

    expect(result).toEqual(users);
    expect(prisma.user.findMany).toHaveBeenCalledWith({
      select: { id: true, name: true, email: true },
    });
  });

  it('should update a user', async () => {
    const updateDto: UpdateUserDto = { name: 'Updated Name' };
    const updatedUser = {
      id: 1,
      name: 'Updated Name',
      email: 'test@email.com',
      password: 'hashed',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    prisma.user.update.mockResolvedValue(updatedUser);

    const result = await service.update(1, updateDto);

    expect(result).toEqual(updatedUser);
    expect(prisma.user.update).toHaveBeenCalledWith({
      where: { id: 1 },
      data: updateDto,
      select: { id: true, name: true, email: true },
    });
    expect(cacheManager.del).toHaveBeenCalledWith('/users');
  });

  it('should delete a user', async () => {
    const deletedUser = {
      id: 1,
      name: 'User1',
      email: 'user1@email.com',
      password: 'hashed',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    prisma.user.delete.mockResolvedValue(deletedUser);

    const result = await service.delete(1);

    expect(result).toEqual(deletedUser);
    expect(prisma.user.delete).toHaveBeenCalledWith({
      where: { id: 1 },
      select: { id: true, name: true, email: true },
    });
    expect(cacheManager.del).toHaveBeenCalledWith('/users');
  });

  it('should find a user by email', async () => {
    const email = 'test@email.com';
    const user = {
      id: 1,
      name: 'Test',
      email,
      password: 'hashed',
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    prisma.user.findUnique.mockResolvedValue(user);

    const result = await service.findByEmail(email);

    expect(result).toEqual(user);
    expect(prisma.user.findUnique).toHaveBeenCalledWith({ where: { email } });
  });
});

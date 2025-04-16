import { Inject, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service'; 
import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';
import { Cache } from 'cache-manager';
import * as bcrypt from 'bcrypt';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  async create(data: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user =  await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: hashedPassword,
      },
    });
    await this.cacheManager.del('/users');
    return user;
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async findAll() {
    const users = await this.prisma.user.findMany({ select: { id: true, name: true, email: true } });
    return users;
  }

  async findOne(id: number) {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async update(id: number, data: UpdateUserDto) {
    const user =  await this.prisma.user.update({
      where: { id },
      data,
    });
    await this.cacheManager.del('/users');
    return user;
  }
  
  async delete(id: number) {
    const user = await this.prisma.user.delete({
      where: { id },
    });
    await this.cacheManager.del('/users');
    return user;
  }

}
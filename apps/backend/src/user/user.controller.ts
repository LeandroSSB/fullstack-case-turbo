import { Body, Controller, Delete, Get, HttpException, HttpStatus, NotFoundException, Param, ParseIntPipe, Post, Put, UseGuards } from '@nestjs/common';
import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';
import { UserService } from './user.service';
import { CacheTTL } from 'src/common/decorators/cache-ttl.decorator';
import { WinstonLogger } from 'src/logger/logger.service';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(
    private userService: UserService,
    private readonly logger: WinstonLogger,
  ) {}

  @Post()
  async create(@Body() dto: CreateUserDto) {
    const findEmail = await this.userService.findByEmail(dto.email)
    if (findEmail) {
      throw new HttpException('A user with this email already exists', HttpStatus.CONFLICT);
    }
    const user = await this.userService.create(dto);
    this.logger.log(`Usuário criado: ${user.email}`)
    return { message: 'Usuário criado com sucesso', data: user };
  }

  @Get()
  @CacheTTL(120)
  async findAll() {
    const users = await this.userService.findAll();
    return { message: '', data: users };
  }

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.userService.findOne(id);
    if (!user){
      throw new NotFoundException()
    }
    
    return { message: '', data: user };
  }
  
  @UseGuards(JwtAuthGuard)
  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() dto: UpdateUserDto) {
    const foundUser = await this.userService.findOne(id);
    if (!foundUser){
      throw new NotFoundException()
    }

    const user = await this.userService.update(foundUser.id, dto);

    this.logger.log(`Usuário atualizado: ID ${id}`);
    return { message: 'Usuário atualizado com sucesso', data: user };
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id', ParseIntPipe) id: number) {
    const foundUser = await this.userService.findOne(id);
    if (!foundUser){
      throw new NotFoundException()
    }

    const user = await this.userService.delete(id);
    this.logger.warn(`Usuário removido: ID ${id}`);
    return { message: 'Usuário removido com sucesso', data: user };
  }

}
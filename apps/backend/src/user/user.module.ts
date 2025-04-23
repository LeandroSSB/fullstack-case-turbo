import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { WinstonLogger } from 'src/logger/logger.service';

@Module({
  providers: [UserService, WinstonLogger],
  controllers: [UserController],
})
export class UserModule {}

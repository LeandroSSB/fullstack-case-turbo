import { Module } from '@nestjs/common';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { PrismaModule } from './prisma/prisma.module';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-ioredis-yet';
import { WinstonLogger } from './logger/logger.service';
import configuration from './config/configuration';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [configuration],
    }),
    CacheModule.registerAsync({
      isGlobal: true,
      useFactory: async () => ({
        store: redisStore({
          host: 'host.docker.internal',
          port: 6379,
        }),
        ttl: 60,
      }),
    }),
    PrismaModule,
    UserModule,
    AuthModule,
  ],
  providers: [
    {
      provide: 'LoggerService',
      useClass: WinstonLogger,
    },
  ],
  exports: ['LoggerService'],
})
export class AppModule {}

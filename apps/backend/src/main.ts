import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomCacheInterceptor, ResponseInterceptor, AllExceptionsFilter } from './common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';
import { WinstonLogger } from './logger/logger.service';
import { ValidationPipe } from '@nestjs/common';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Global cache
  app.useGlobalInterceptors(new CustomCacheInterceptor(app.get(CACHE_MANAGER), app.get(Reflector)));
  const configService = app.get(ConfigService);
  // Logger config 
  app.useLogger(new WinstonLogger(configService));
  
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // remove propriedades extras
      forbidNonWhitelisted: true, // lança erro se enviar algo que não está no DTO
      transform: true,            // transforma payloads em instâncias das classes
    }),
  );
  
  // Response pattern
  app.useGlobalInterceptors(new ResponseInterceptor());

  // Error response pattern
  app.useGlobalFilters(new AllExceptionsFilter());


  const PORT = configService.get<number>('port') ?? 3000;
  await app.listen(PORT);
}
bootstrap();

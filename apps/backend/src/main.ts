import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomCacheInterceptor } from './common/interceptors/cache.interceptor';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { ConfigService } from '@nestjs/config';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new CustomCacheInterceptor(app.get(CACHE_MANAGER), app.get(Reflector)));
  await app.listen(new ConfigService().get<string>('port') ?? "secret" ?? 3000);
}
bootstrap();

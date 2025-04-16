import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { CustomCacheInterceptor } from './common/interceptors/cache.interceptor';
import { CACHE_MANAGER } from '@nestjs/cache-manager';


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalInterceptors(new CustomCacheInterceptor(app.get(CACHE_MANAGER), app.get(Reflector)));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

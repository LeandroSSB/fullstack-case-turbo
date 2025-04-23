import { ExecutionContext, Injectable } from '@nestjs/common';
import { Request } from 'express';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Reflector } from '@nestjs/core';
import { Cache } from 'cache-manager';
import { Inject } from '@nestjs/common';
import { CACHE_MANAGER, CacheInterceptor } from '@nestjs/cache-manager';

@Injectable()
export class CustomCacheInterceptor extends CacheInterceptor {
  constructor(
    @Inject(CACHE_MANAGER) protected cacheManager: Cache,
    protected reflector: Reflector,
  ) {
    super(cacheManager, reflector);
  }

  trackBy(context: ExecutionContext): string | undefined {
    const request = context.switchToHttp().getRequest<Request>();
    const key = request.originalUrl; // chave única por rota + query
    return key;
  }

  async intercept(
    context: ExecutionContext,
    next: import('@nestjs/common').CallHandler,
  ): Promise<Observable<any>> {
    const ttl =
      this.reflector.get<number>('cache-ttl', context.getHandler()) ?? 60;

    return (await super.intercept(context, next)).pipe(
      tap(async (response) => {
        const key = this.trackBy(context);
        if (key) {
          await this.cacheManager.set(key, response, ttl);
        }
      }),
    );
  }
}

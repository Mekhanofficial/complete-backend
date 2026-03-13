import { redisIoAdapter } from '@nestjs/platform-redis';
import {NestFactory} from '@nestjs/core';
import {AppModule} from './app.module';
import {RedisIoAdapter} from './common/redis-io.adapter';
import {ValidationPipe, Validator} from '@nestjs/common';

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const redisIoAdapter = new RedisIoAdapter(app);
    await redisIoAdapter.connectToRedis();
    app.useWebSocketAdapter(redisIoAdapter);

    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new ValidationPipe());
    app.enableCors();

    await app.listen(3000);
}

bootstrap();
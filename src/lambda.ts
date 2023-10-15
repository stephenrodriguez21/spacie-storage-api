// lambda.ts
import { Handler, Context } from 'aws-lambda';
import { Server } from 'http';
import { createServer, proxy } from 'aws-serverless-express';
import { eventContext } from 'aws-serverless-express/middleware';

import { NestFactory, Reflector } from '@nestjs/core';
import { ExpressAdapter } from '@nestjs/platform-express';
import { AppModule } from './app.module';
import { useContainer } from 'class-validator';
import { ClassSerializerInterceptor, ValidationPipe, VersioningType } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const express = require('express');

// NOTE: If you get ERR_CONTENT_DECODING_FAILED in your browser, this is likely
// due to a compressed response (e.g. gzip) which has not been handled correctly
// by aws-serverless-express and/or API Gateway. Add the necessary MIME types to
// binaryMimeTypes below
const binaryMimeTypes: string[] = [];

let cachedServer: Server;

async function bootstrapServer(): Promise<Server> {
    if (!cachedServer) {
        const expressApp = express();
        const nestApp = await NestFactory.create(AppModule, new ExpressAdapter(expressApp))
        useContainer(nestApp.select(AppModule), { fallbackOnErrors: true });
        const configService = nestApp.get(ConfigService);

        nestApp.enableShutdownHooks();
        nestApp.setGlobalPrefix(configService.get('app.apiPrefix'), {
            exclude: ['/'],
        });
        nestApp.enableVersioning({
            type: VersioningType.URI,
        });
        nestApp.useGlobalPipes(new ValidationPipe());
        nestApp.useGlobalInterceptors(new ClassSerializerInterceptor(nestApp.get(Reflector)));

        const options = new DocumentBuilder()
            .setTitle('API')
            .setDescription('API docs')
            .setVersion('1.0')
            .addBearerAuth()
            .build();

        const document = SwaggerModule.createDocument(nestApp, options);
        SwaggerModule.setup('docs', nestApp, document);
        nestApp.use(eventContext());
        await nestApp.init();
        cachedServer = createServer(expressApp, undefined, binaryMimeTypes);
    }
    return cachedServer;
}

export const handler: Handler = async (event: any, context: Context) => {
    cachedServer = await bootstrapServer();
    return proxy(cachedServer, event, context, 'PROMISE').promise;
}
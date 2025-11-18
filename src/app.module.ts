import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { envSchema, EnvModule, EnvService } from '@/config/env';
import { InfrastructureModule } from '@/modules/infrastructure/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      validate: (env) => envSchema.parse(env),
      isGlobal: true,
    }),
    EnvModule,
    TypeOrmModule.forRootAsync({
      imports: [EnvModule],
      inject: [EnvService],
      useFactory: (envService: EnvService) => ({
        type: 'postgres',
        host: envService.get('POSTGRES_HOST'),
        port: envService.get('POSTGRES_PORT'),
        database: envService.get('POSTGRES_DATABASE'),
        username: envService.get('POSTGRES_USER'),
        password: envService.get('POSTGRES_PASSWORD'),
        logging: envService.get('NODE_ENV') === 'development',
        synchronize: false,
        entities: [join(__dirname, '**', '*.entity.{ts,js}')],
        migrations: [
          join(
            __dirname,
            'config',
            'database',
            'migrations',
            '**',
            '*{.ts,.js}',
          ),
        ],
        migrationsTableName: 'typeorm_migrations',
        migrationsRun: false,
      }),
    }),
    InfrastructureModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}

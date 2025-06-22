import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { User } from './users/entities/user.entity';

@Module({
  imports: [
    // Load environment variables from api/.env
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    // TypeORM configuration for PostgreSQL with async setup for ConfigService
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: parseInt(configService.get<string>('DB_PORT') || '5432', 10),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [User], // Only include the User entity for now
        synchronize: false,
        migrationsRun: false,
        migrations: [__dirname + '/../database/migrations/*.{ts,js}'],
        cli: {
          migrationsDir: 'database/migrations',
        },
        logging: true,
      }),
    }),
    // No other modules like AuthModule, BookingsModule etc. for now
  ],
  controllers: [AppController], // Use the default AppController
  providers: [AppService],     // Use the default AppService
})
export class AppModule {}
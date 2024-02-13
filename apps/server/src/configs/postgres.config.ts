import { Inject, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';

@Injectable()
export class PostgresConfig implements TypeOrmOptionsFactory {
  constructor(
    private readonly configService: ConfigService,
    @Inject('POSTGRES_ENTITIES')
    private readonly entities: any[],
  ) {}

  createTypeOrmOptions(): TypeOrmModuleOptions | Promise<TypeOrmModuleOptions> {
    const host = this.configService.get('J2_POSTGRES_HOST');
    const port = this.configService.get('J2_POSTGRES_PORT');
    const database = this.configService.get('J2_POSTGRES_DB');
    const username = this.configService.get('J2_POSTGRES_USER');
    const password = this.configService.get('J2_POSTGRES_PASSWORD');
    return {
      type: 'postgres',
      host,
      port,
      username,
      password,
      database,
      entities: this.entities,
      synchronize: true,
    };
  }
}

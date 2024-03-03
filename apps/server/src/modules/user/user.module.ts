import { Module } from '@nestjs/common';
import { ServicesModule } from 'src/service/services.module';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { SchemaModule } from 'src/schema/schema.module';

@Module({
  imports: [ServicesModule, SchemaModule],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService],
})
export class UserModule {}

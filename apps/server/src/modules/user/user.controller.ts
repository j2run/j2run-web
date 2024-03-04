import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import * as express from 'express';
import {
  ChangePasswordRequest,
  ChangePasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from './user.dto';
import { UserService } from './user.service';
import { UserEntity } from 'src/schema/user.entity';

@ApiBearerAuth()
@ApiTags('user')
@UseGuards(AuthGuard('jwt-access'))
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('info')
  getInfo(@Req() request: express.Request) {
    const user = request.user as UserEntity;
    this.userService.hideField(user);
    return user;
  }

  @Post('reset-password')
  resetPassword(
    @Req() request: express.Request,
    @Body() dto: ResetPasswordRequest,
  ): Promise<ResetPasswordResponse> {
    const user = request.user as UserEntity;
    return this.userService.resetPassword(dto, user);
  }

  @Post('change-password')
  changePassword(
    @Req() request: express.Request,
    @Body() dto: ChangePasswordRequest,
  ): Promise<ChangePasswordResponse> {
    const user = request.user as UserEntity;
    return this.userService.changePassword(dto, user);
  }
}

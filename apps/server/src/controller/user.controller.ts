import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import * as express from 'express';
import { ResetPasswordRequest, ResetPasswordResponse } from 'src/dtos/user.dto';
import { UserDocument } from 'src/schema/user.schema';
import { UserService } from 'src/service/user.service';

@ApiBearerAuth()
@ApiTags('user')
@UseGuards(AuthGuard('jwt-access'))
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('info')
  getInfo(@Req() request: express.Request) {
    const user = request.user as UserDocument;
    this.userService.hideField(user);
    return user;
  }

  @Post('reset-password')
  resetPassword(
    @Req() request: express.Request,
    @Body() dto: ResetPasswordRequest,
  ): Promise<ResetPasswordResponse> {
    const user = request.user as UserDocument;
    return this.userService.resetPassword(dto, user);
  }
}

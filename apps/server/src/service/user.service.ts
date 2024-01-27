import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import * as bcrypt from 'bcrypt';
import {
  ChangePasswordRequest,
  ChangePasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from 'src/dtos/user.dto';
import { User, UserDocument } from 'src/schema/user.schema';
import { MSG_PASSWORD_OLD_ILEGAL } from 'src/constants/message.constant';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<UserDocument>,
  ) {}

  findById(id: string) {
    return this.userModel.findOne({
      _id: new Types.ObjectId(id),
    });
  }

  findByEmail(email: string) {
    return this.userModel.findOne({
      email,
    });
  }

  findByEmailVerified(email: string) {
    return this.userModel.findOne({
      email,
      isVerified: true,
    });
  }

  findByVerifyCode(code: string) {
    return this.userModel.findOne({
      verifyToken: code,
    });
  }

  findByForgotPasswordCode(email: string, code: string) {
    return this.userModel.findOne({
      forgotPasswordToken: code,
      email,
    });
  }

  removeAllAccountWithoutUserId(email: string, userId: string) {
    return this.userModel.deleteMany({
      email,
      _id: {
        $ne: new Types.ObjectId(userId),
      },
    });
  }

  insert(user: UserDocument) {
    return this.userModel.create(user);
  }

  save(user: UserDocument) {
    return this.userModel.bulkSave([user]);
  }

  hideField(user: UserDocument) {
    user.password = undefined;
    user.verifyToken = undefined;
    user.forgotPasswordToken = undefined;
  }

  async resetPassword(
    dto: ResetPasswordRequest,
    user: UserDocument,
  ): Promise<ResetPasswordResponse> {
    if (!user.isResetPassword) {
      throw new ForbiddenException();
    }
    user.isResetPassword = null;
    user.password = await bcrypt.hash(dto.password, 12);
    await this.userModel.bulkSave([user]);
    return { status: true };
  }

  async changePassword(
    dto: ChangePasswordRequest,
    user: UserDocument,
  ): Promise<ChangePasswordResponse> {
    const isPasswordMatches = await bcrypt.compare(
      dto.oldPassword,
      user.password,
    );
    if (!isPasswordMatches) {
      throw new ForbiddenException(MSG_PASSWORD_OLD_ILEGAL);
    }

    user.password = await bcrypt.hash(dto.newPassword, 12);
    await this.userModel.bulkSave([user]);

    // TODO
    // Send mail

    return {
      status: true,
    };
  }
}

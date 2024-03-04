import { ForbiddenException, Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import {
  ChangePasswordRequest,
  ChangePasswordResponse,
  ResetPasswordRequest,
  ResetPasswordResponse,
} from './user.dto';
import { MSG_PASSWORD_OLD_ILEGAL } from 'src/utils/constants/message.constant';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Not, Repository } from 'typeorm';
import { UserEntity } from 'src/schema/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userEntityRepository: Repository<UserEntity>,
  ) {}

  findById(id: number) {
    return this.userEntityRepository.findOne({
      where: {
        id,
      },
    });
  }

  findByEmail(email: string) {
    return this.userEntityRepository.findOne({
      where: {
        email,
      },
    });
  }

  findByEmailVerified(email: string) {
    return this.userEntityRepository.findOne({
      where: {
        email,
        isVerified: true,
      },
    });
  }

  create() {
    return this.userEntityRepository.create();
  }

  async insert(users: UserEntity[]) {
    return this.userEntityRepository.insert(users);
  }

  async save(user: UserEntity) {
    return this.userEntityRepository.save(user);
  }

  removeAllAccountWithoutUserId(email: string, userId: number) {
    return this.userEntityRepository.delete({
      email,
      id: Not(userId),
    });
  }

  hideField(user: UserEntity) {
    user.password = undefined;
    user.verifyToken = undefined;
    user.forgotPasswordToken = undefined;
  }

  async resetPassword(
    dto: ResetPasswordRequest,
    user: UserEntity,
  ): Promise<ResetPasswordResponse> {
    if (!user.isResetPassword) {
      throw new ForbiddenException();
    }
    user.isResetPassword = null;
    user.password = await bcrypt.hash(dto.password, 12);
    await this.userEntityRepository.save(user);
    return { status: true };
  }

  async changePassword(
    dto: ChangePasswordRequest,
    user: UserEntity,
  ): Promise<ChangePasswordResponse> {
    const isPasswordMatches = await bcrypt.compare(
      dto.oldPassword,
      user.password,
    );
    if (!isPasswordMatches) {
      throw new ForbiddenException(MSG_PASSWORD_OLD_ILEGAL);
    }

    user.password = await bcrypt.hash(dto.newPassword, 12);
    await this.userEntityRepository.save(user);

    // TODO
    // Send mail

    return {
      status: true,
    };
  }

  minusBalance(balance: number, userId: number, manager?: EntityManager) {
    return (manager || this.userEntityRepository)
      .createQueryBuilder()
      .update(UserEntity)
      .set({ balance: () => 'balance + :balance' })
      .where('id = :id')
      .setParameter('balance', balance)
      .setParameter('id', userId)
      .execute();
  }
}

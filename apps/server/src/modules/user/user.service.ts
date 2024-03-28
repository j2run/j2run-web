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
import {
  EntityManager,
  FindOptionsSelect,
  FindOptionsSelectByString,
  Not,
  Repository,
} from 'typeorm';
import { UserEntity } from 'src/schema/user.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(UserEntity)
    private readonly userEntityRepository: Repository<UserEntity>,
  ) {}

  findById(
    id: number,
    select?:
      | FindOptionsSelect<UserEntity>
      | FindOptionsSelectByString<UserEntity>,
  ) {
    return this.userEntityRepository.findOne({
      where: {
        id,
      },
      select,
    });
  }

  findByEmailWithPassword(email: string) {
    return this.userEntityRepository
      .createQueryBuilder()
      .where({ email })
      .addSelect('UserEntity.password')
      .getOne();
  }

  findByEmail(
    email: string,
    select?:
      | FindOptionsSelect<UserEntity>
      | FindOptionsSelectByString<UserEntity>,
  ) {
    return this.userEntityRepository.findOne({
      where: {
        email,
      },
      select: select,
    });
  }

  findByEmailVerified(
    email: string,
    select?:
      | FindOptionsSelect<UserEntity>
      | FindOptionsSelectByString<UserEntity>,
  ) {
    return this.userEntityRepository.findOne({
      where: {
        email,
        isVerified: true,
      },
      select,
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
    const password = await bcrypt.hash(dto.password, 12);
    await this.userEntityRepository
      .createQueryBuilder()
      .update(UserEntity)
      .set({
        password: () => ':password',
        isResetPassword: false,
      })
      .where('id = :id')
      .setParameter('id', user.id)
      .setParameter('password', password)
      .execute();
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

    const password = await bcrypt.hash(dto.newPassword, 12);
    await this.userEntityRepository
      .createQueryBuilder()
      .update(UserEntity)
      .set({
        password: () => ':password',
      })
      .where('id = :id')
      .setParameter('id', user.id)
      .setParameter('password', password)
      .execute();

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

  changeAccountToVerify(userId: number, manager?: EntityManager) {
    return (manager || this.userEntityRepository)
      .createQueryBuilder()
      .update(UserEntity)
      .set({
        verifyToken: () => 'NULL',
        isVerified: true,
      })
      .where('id = :id')
      .setParameter('id', userId)
      .execute();
  }

  changeAccountToResetPassword(userId: number, manager?: EntityManager) {
    return (manager || this.userEntityRepository)
      .createQueryBuilder()
      .update(UserEntity)
      .set({
        forgotPasswordToken: () => 'NULL',
        isResetPassword: true,
      })
      .where('id = :id')
      .setParameter('id', userId)
      .execute();
  }

  updateForgotPasswordToken(
    token: string,
    userId: number,
    manager?: EntityManager,
  ) {
    return (manager || this.userEntityRepository)
      .createQueryBuilder()
      .update(UserEntity)
      .set({
        forgotPasswordToken: () => ':forgotPasswordToken',
      })
      .where('id = :id')
      .setParameter('id', userId)
      .setParameter('forgotPasswordToken', token)
      .execute();
  }
}

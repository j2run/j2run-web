import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User, UserDocument } from 'src/schema/user.schema';

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

  insert(user: UserDocument) {
    return this.userModel.create(user);
  }
}

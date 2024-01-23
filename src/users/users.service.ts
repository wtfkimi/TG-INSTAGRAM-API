import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Users } from './users.model';

@Injectable()
export class UsersService {
  constructor(@InjectModel('User') private readonly userModel: Model<Users>) {}

  async insertUser(username: string, channel: string) {
    const newUser = new this.userModel({
      username,
      channel,
    });
    await newUser.save();
  }

  async getAllUsers(): Promise<Users[]> {
    const users = await this.userModel.find().exec();
    return users.map((user) => ({
      username: user.username,
      channel: user.channel,
    }));
  }

  async getUserByUsername(username: string): Promise<Users> {
    const user = await this.userModel.findOne({ username: username }).exec();
    return user;
  }

  async deleteUserByUsername(username: string): Promise<string> {
    const user = await this.userModel.findOne({ username: username }).exec();
    await this.userModel.deleteOne({ username: username }).exec();
    return user.username;
  }
}

import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Admins } from './admins.model';

@Injectable()
export class AdminsService {
  constructor(
    @InjectModel('Admin') private readonly adminModel: Model<Admins>,
  ) {}

  async insertAdmin(username: string, userId: string) {
    const admins = await this.getAllAdmins();
    const isAlreadyAdded = admins.find(
      (admin) => admin.username === username || admin.userId === userId,
    );
    if (isAlreadyAdded !== undefined) {
      return 'already added';
    }
    const newAdmin = new this.adminModel({
      username,
      userId,
    });
    await newAdmin.save();
  }

  async isAdmin(username: string): Promise<boolean> {
    const admin = await this.adminModel.findOne({ username: username }).exec();
    return admin !== null;
  }

  async getAllAdmins(): Promise<Admins[]> {
    const admins = await this.adminModel.find().exec();
    if (admins !== null) {
      return admins.map((admin) => ({
        username: admin.username,
        userId: admin.userId,
      }));
    }
    return null;
  }

  async deleteAdminByUsername(username: string) {
    const admin = await this.adminModel.findOne({ username: username }).exec();
    if (admin === null) {
      return null;
    }
    await this.adminModel.deleteOne({ username: username }).exec();
    return admin.username;
  }
}

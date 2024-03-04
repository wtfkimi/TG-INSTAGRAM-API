import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Customers, Status } from './customers.model';


@Injectable()
export class CustomersService {

  constructor(
    @InjectModel('Customer') private readonly customerModel: Model<Customers>,
  ) {}

  async insertCustomer(customer: Customers) {
    const newCustomer = new this.customerModel({
      username: customer.username,
      userId: customer.userId,
      status: customer.status,
    });
    await newCustomer.save();
  }

  async getCustomerByUserId(userId: string): Promise<Customers> {
    const customer = await this.customerModel.find({ userId }).exec();
    if (customer.length > 0) {
      return customer[0];
    }
    return null;
  }

  async getCustomerStatusByUserId(userId: string): Promise<string> {
    const customer = await this.customerModel.find({ userId }).exec();
    if (customer.length > 0) {
      return customer[0].status
    }
    return null;
  }

  async updateCustomerStatus(userId: string, status: Status) {
    const customer = await this.customerModel.find({ userId }).exec();
    if (customer !== null) {
      customer[0].status = status;
      await customer[0].save();
      return customer
    }
    return null;
  }

  async register(username: string, userId: string) {
    const isCustomerExist = await this.getCustomerByUserId(userId);
    if (isCustomerExist) {
      return false;
    }
    const isStatusQueue = await this.getCustomerStatusByUserId(userId);
    if (isStatusQueue === 'QUEUE') {
      return false;
    }
    await this.insertCustomer({ username: username, userId, status: 'WORKED' });
    return true;
  }

  async changeStatusWorked(userId: string) {
    const user = await this.updateCustomerStatus(userId, 'WORKED');
    if (user !== null) {
      return true
    }
  }

  async deleteUserById(userId: string) {
    const customer = await this.customerModel.find({ userId }).exec();
    if (customer !== null) {
      await this.customerModel.deleteOne({ userId });
      return customer
    }
    return null;
  }
}
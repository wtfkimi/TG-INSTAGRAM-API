import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Accounts, AccountStatus } from './accounts.model';

@Injectable()
export class AccountsService {
  constructor(
    @InjectModel('Account') private readonly accountModel: Model<Accounts>,
  ) {}

  async insertAccount(account: Accounts) {
    const newAccount = new this.accountModel({
      username: account.username,
      password: account.password,
      proxy: account.proxy,
      status: 'working',
    });
    await newAccount.save();
  }

  async deleteAccountsByUsernames(username: string[]): Promise<string[]> {
    const accounts = await this.accountModel
      .find({ username: { $in: username } })
      .exec();
    await this.accountModel.deleteMany({ username: { $in: username } }).exec();
    return accounts.map((account) => account.username);
  }

  async deleteAccountByUsername(username: string): Promise<string> {
    const account = await this.accountModel.find({ username }).exec();
    if (account !== null) {
      await this.accountModel.deleteOne({ username }).exec();
      return;
    }
    return null;
  }

  async getAllAccounts(): Promise<Accounts[]> {
    const accounts = await this.accountModel.find().exec();
    if (accounts !== null) {
      return accounts.map((account) => ({
        username: account.username,
        password: account.password,
        proxy: account.proxy,
        status: account.status,
      }));
    }
    return null;
  }

  async insertAccountBulk(accounts: Accounts[]) {
    await this.accountModel.insertMany(accounts);
  }

  async updateAccountStatus(username: string, status: AccountStatus) {
    const account = await this.accountModel.find({ username }).exec();
    if (account !== null) {
      account[0].status = status;
      await account[0].save();
    }
  }

  async getAllWorkingAccounts(): Promise<Accounts[]> {
    const accounts = await this.accountModel.find({ status: 'working' }).exec();
    if (accounts !== null) {
      return accounts.map((account) => ({
        username: account.username,
        password: account.password,
        proxy: account.proxy,
        status: account.status,
      }));
    }
    return null;
  }
}

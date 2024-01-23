import * as mongoose from 'mongoose';


export type AccountStatus = 'working' | 'failed';
export const AccountsSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  proxy: { type: String, required: true, unique: true },
  status: { type: String, required: true, enum: ['working', 'failed'] },
});


export interface Accounts {
  username: string;
  password: string;
  proxy: string;
  status: AccountStatus;
}
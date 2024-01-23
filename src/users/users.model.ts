import * as mongoose from 'mongoose';

export const UsersSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  channel: { type: String, required: true, unique: true },
});

export interface Users {
  username: string;
  channel: string;
}

import * as mongoose from 'mongoose';

export const AdminsSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  userId: { type: String, required: true, unique: true },
});

export interface Admins {
  username: string;
  userId: string;
}

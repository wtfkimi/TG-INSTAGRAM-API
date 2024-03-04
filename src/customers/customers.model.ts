import * as mongoose from 'mongoose';


export type Status = 'QUEUE' | 'WORKED' | 'FAILED';
export const CustomersSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  userId: { type: String, required: true, unique: true },
  status: { type: String, required: true, enum: ['QUEUE', 'WORKED', 'FAILED'] }
});

export interface Customers {
  username: string;
  userId: string;
  status: Status
}

import {
  Schema, Document, model, Model,
} from 'mongoose';
import { SHA256 } from 'crypto-js';

export interface IUser extends Document {
  firstname: string;
  lastname: string;
  email: string;
  conversationsSeen: {[convId: string]: Date};
  status: IUserStatus;
  socket?: string;
  verifyPassword: (password: string) => boolean;
  setPassword: (password: string) => void;
  getSafeUser: () => ISafeUser;
}

type IUserStatus = 'online' | 'offline';

type ISafeUser = Pick<IUser, 'firstname' | 'lastname' | 'email' | '_id' | 'conversationsSeen' | 'status'>

const userSchema = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  socket: { type: String },
  status: { type: String, required: true, default: 'offline' },
  password: { type: String, required: true },
  conversationsSeen: {},
});

userSchema.methods.setPassword = function (password: string) {
  this.password = SHA256(password).toString();
};

userSchema.methods.getSafeUser = function () {
  const {
    _id, firstname, lastname, email, status, conversationsSeen,
  } = this;
  return {
    _id, firstname, lastname, email, status, conversationsSeen,
  };
};

userSchema.methods.verifyPassword = function (password: string) {
  return this.password === SHA256(password).toString();
};

export const User = model<IUser, Model<IUser>>('User', userSchema);

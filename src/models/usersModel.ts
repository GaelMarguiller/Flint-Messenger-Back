import {
  Schema, Document, model, Model,
} from 'mongoose';
import { SHA256 } from 'crypto-js';

export interface IUser extends Document {
  firstname: string;
  lastname: string;
  email: string;
  status: () => string;
  verifyPassword: (password: string) => boolean;
  setPassword: (password: string) => void;
  getSafeUser: () => ISafeUser;
}

type ISafeUser = Pick<IUser, 'firstname' | 'lastname' | 'email' |'_id'>

const userSchema = new Schema({
  firstname: { type: String, required: true },
  lastname: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: { type: String, required: true },
});

userSchema.methods.setPassword = function (password: string) {
  this.password = SHA256(password).toString();
};

userSchema.methods.getSafeUser = function () {
  const {
    _id, firstname, lastname, email,
  } = this;
  return {
    _id, firstname, lastname, email,
  };
};

userSchema.methods.verifyPassword = function (password: string) {
  return this.password === SHA256(password).toString();
};

export const User = model<IUser, Model<IUser>>('User', userSchema);

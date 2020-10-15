import { IUser, User } from '../models/usersModel';
import DatabaseError from './errors/databaseError';

export function getUser(
  id: string,
  callback: (user: IUser | null) => void,
): void {
  User.findById(id, (err, res) => {
    if (err) {
      throw new DatabaseError(err);
    }
    callback(res);
  });
}

export function getListUsers(callback: (users: IUser[]) => void) {
  User.find({}, (err, users) => {
    if (err) {
      throw new DatabaseError(err);
    }
    callback(users);
  });
}

export function createUser(
  firstname: string,
  lastname: string,
  email: string,
  password: string,
) : IUser {
  const user = new User({ firstname, lastname, email });
  user.setPassword(password);
  user.save();
  return user;
}

export function updateUser(
  id: string,
  callback: (user: IUser | null) => void,
  firstname?: string,
  lastname?: string,
  email?: string,
): void {
  const filterObj: any = (obj: any, ...allowedFields: any) => {
    const newObj: any = {};
    Object.keys(obj).forEach((el) => {
      if (
        allowedFields.includes(el)
        && (typeof obj[el] === 'boolean' || obj[el])
      ) {
        newObj[el] = obj[el];
      }
    });
    return newObj;
  };

  const filteredBody = filterObj(
    { firstname, lastname, email },
    'firstname',
    'lastname',
    'email',
  );

  User.findByIdAndUpdate(id, filteredBody, (err, res) => {
    if (err) {
      throw new DatabaseError(err);
    }
    callback(res);
  });
}

export function deleteUser(
  id: string,
  callback: (user: IUser | null) => void,
): void {
  User.findByIdAndDelete(id, (err, res) => {
    if (err) {
      throw new DatabaseError(err);
    }
    callback(res);
  });
}

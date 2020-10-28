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

export function getListUsers(): Promise<IUser[]> {
  return User.find({}, '_id firstname lastname').then((res) => res);
}

export function createUser(
  firstname: string,
  lastname: string,
  email: string,
  password: string,
): IUser {
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

export function updateConversationSeen(user: IUser, conversationId: string): Promise<IUser> {
  // eslint-disable-next-line no-param-reassign
  user.conversationsSeen = {
    ...user.conversationsSeen,
    [conversationId]: new Date(),
  };
  return user.save();
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

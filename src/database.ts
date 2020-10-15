import mongoose from 'mongoose';
import { IConfig } from './config';

export default async function connect(config: IConfig): Promise<void> {
  const {
    mongoHost, mongoUser, mongoPass, mongoDatabase, mongoDebug,
  } = config;
  const mongoIdentity = `${mongoUser}:${mongoPass}`;
  const mongoServer = `${mongoHost}`;
  const mongoUri = `mongodb+srv://${mongoIdentity}@${mongoServer}/${mongoDatabase}`;
  console.log(`Trying to connect to DB : ${mongoUri}`);
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
  mongoose.set('debug', mongoDebug);
}

import mongoose from 'mongoose';
import { IConfig } from './config';

export default async function connect(config: IConfig): Promise<void> {
  const {
    MONGO_HOST, MONGO_USER, MONGO_PASS, MONGO_DATABASE, MONGO_DEBUG,
  } = process.env.NODE_ENV === 'production' ? process.env : config;
  const mongoIdentity = `${MONGO_USER}:${MONGO_PASS}`;
  const mongoServer = `${MONGO_HOST}`;
  const mongoUri = `mongodb+srv://${mongoIdentity}@${mongoServer}/${MONGO_DATABASE}`;
  // eslint-disable-next-line no-console
  console.log(`Trying to connect to DB : ${mongoUri}`);
  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  });
  mongoose.set('debug', MONGO_DEBUG);
}

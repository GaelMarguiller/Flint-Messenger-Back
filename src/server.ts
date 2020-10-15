import express, { Request, Response, ErrorRequestHandler } from 'express';
import * as mongoose from 'mongoose';
import connectMongo from 'connect-mongo';
import morgan from 'morgan';
import helmet from 'helmet';
import session from 'express-session';

import { configuration, IConfig } from './config';
import connect from './database';
import generalRoute from './routes/router';
import {
  authenticationInitialize,
  authenticationSession,
} from './controllers/authenticationController';

const MongoStore = connectMongo(session);

export default function createExpressApp(config: IConfig): express.Express {
  const { expressDebug, sessionCookieName, sessionSecret } = config;

  const app = express();

  app.use(morgan('combined'));
  app.use(helmet());
  app.use(express.json());
  app.use(session({
    name: sessionCookieName,
    secret: sessionSecret,
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
    }), // Recup connexion from mongoose
    saveUninitialized: false,
  }));
  app.use(authenticationInitialize());
  app.use(authenticationSession());
  app.use(((err, _req, res, _next) => {
    // eslint-disable-next-line no-console
    console.error(err.stack);
    res.status?.(500).send(!expressDebug ? 'Oups' : err);
  }) as ErrorRequestHandler);

  app.get('/', (req: Request, res: Response) => {
    res.send('This is the boilerplate for Flint Messenger app');
  });
  app.use('/api', generalRoute);

  return app;
}

const config = configuration();
const { PORT } = config;
const app = createExpressApp(config);
// eslint-disable-next-line no-console
connect(config).then(() => app.listen(PORT, () => console.log(`Flint messenger listening at ${PORT}`)));

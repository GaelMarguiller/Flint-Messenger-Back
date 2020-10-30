import express, { Request, Response, ErrorRequestHandler } from 'express';
import mongoose from 'mongoose';
import connectMongo from 'connect-mongo';
import morgan from 'morgan';
import helmet from 'helmet';
import session from 'express-session';
import cors from 'cors';

import { configurationDev, IConfig } from './config';
import { initializeSocket } from './socket';
import connect from './database';
import generalRoute from './routes/router';
import {
  authenticationInitialize,
  authenticationSession,
} from './controllers/authenticationController';

const MongoStore = connectMongo(session);
const sessionStore = new MongoStore({ mongooseConnection: mongoose.connection });

export default function createExpressApp(): express.Express {
  const app = express();

  app.use(morgan('combined'));
  app.use(helmet());
  app.use(cors({
    origin: true,
    credentials: true,
  }));
  app.use(express.json());
  const sessionConfig = {
    name: process.env.SESSION_COOKIE_NAME,
    secret: process.env.SESSION_SECRET,
    store: sessionStore, // Recup connexion from mongoose
    saveUninitialized: false,
    resave: false,
    cookie: {},
  };

  if (process.env.NODE_ENV === 'production') {
    app.set('trust proxy', 1);
    sessionConfig.cookie = {
      secure: true,
      sameSite: 'none',
    };
  }
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  app.use(session(sessionConfig));
  app.use(authenticationInitialize());
  app.use(authenticationSession());
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use(((err, _req, res, _next) => {
    // eslint-disable-next-line no-console
    console.error(err.stack);
    res.status?.(500).send(!process.env.EXPRESS_DEBUG ? 'Oups' : err);
  }) as ErrorRequestHandler);

  app.get('/', (req: Request, res: Response) => {
    res.send('This is the boilerplate for Flint Messenger app');
  });
  app.use('/api', generalRoute);

  return app;
}

const config = configurationDev();
// const { PORT } = config;
const app = createExpressApp();
// eslint-disable-next-line no-console
connect(config).then(
  () => {
    const server = app.listen(process.env.PORT, () => console.log(`Flint messenger listening at ${process.env.PORT}`));

    initializeSocket(config, server, sessionStore);
  },
);

import express, { Request, Response, ErrorRequestHandler } from 'express';
import mongoose from 'mongoose';
import connectMongo from 'connect-mongo';
import morgan from 'morgan';
import helmet from 'helmet';
import session from 'express-session';
import cors from 'cors';

import { configuration, IConfig } from './config';
import { initializeSocket } from './socket';
import connect from './database';
import generalRoute from './routes/router';
import {
  authenticationInitialize,
  authenticationSession,
} from './controllers/authenticationController';

const MongoStore = connectMongo(session);
const sessionStore = new MongoStore({ mongooseConnection: mongoose.connection });

export default function createExpressApp(config: IConfig): express.Express {
  const { EXPRESS_DEBUG, SESSION_COOKIE_NAME, SESSION_SECRET } = config;
  const app = express();

  app.use(morgan('combined'));
  app.use(helmet());
  app.use(cors({
    origin: true,
    credentials: true,
  }));
  app.use(express.json());
  const sessionConfig = {
    name: SESSION_COOKIE_NAME,
    secret: SESSION_SECRET,
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
  app.use(session(sessionConfig));
  app.use(authenticationInitialize());
  app.use(authenticationSession());
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  app.use(((err, _req, res, _next) => {
    // eslint-disable-next-line no-console
    console.error(err.stack);
    res.status?.(500).send(!EXPRESS_DEBUG ? 'Oups' : err);
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
connect(config).then(
  () => {
    const server = app.listen(PORT, () => console.log(`Flint messenger listening at ${PORT}`));

    initializeSocket(config, server, sessionStore);
  },
);

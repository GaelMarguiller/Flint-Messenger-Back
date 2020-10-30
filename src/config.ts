import dotenv, { config } from 'dotenv';

config();

export interface IConfig {
  PORT: number;
  SESSION_COOKIE_NAME: string;
  SESSION_SECRET: string;
  MONGO_HOST: string;
  MONGO_USER: string;
  MONGO_PASS: string;
  MONGO_DATABASE: string;
  EXPRESS_DEBUG: boolean;
  MONGO_DEBUG: boolean;
}

export function configuration(): IConfig {
  const result: any = dotenv.config();
  Object.keys(result).forEach((key) => {
    if (key in process.env) result[key] = process.env[key];
  });
  return result.parsed;
}

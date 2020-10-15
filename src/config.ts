import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { resolve } from 'path';

config();
const defaultConfig = JSON.parse(
  readFileSync(resolve(__dirname, '../config.json')).toString(),
);

export interface IConfig {
  PORT: number;
  sessionCookieName: string;
  sessionSecret: string;
  mongoHost: string;
  mongoUser: string;
  mongoPass: string;
  mongoDatabase: string;
  expressDebug: boolean;
  mongoDebug: boolean;
}

export function configuration(): IConfig {
  const result: any = { ...defaultConfig };
  Object.keys(result).forEach((key) => {
    if (key in process.env) result[key] = process.env[key];
  });
  return result;
}

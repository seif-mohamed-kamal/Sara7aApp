import { resolve } from 'node:path'
import { config } from 'dotenv'

export const NODE_ENV = process.env.NODE_ENV

const envPath = {
    development: `.env.development`,
    production: `.env.production`,
}
console.log({ en: envPath[NODE_ENV] });


config({ path: resolve(`./config/${envPath[NODE_ENV]}`) })


export const port = process.env.PORT ?? 7000

export const DB_URI = process.env.DB_URI ?? '127.0.0.1'

export const ENCRYPT_KEY = process.env.ENCRYPT_KEY;
export const JWT_SECRET = process.env.JWT_SECRET;
export const JWT_SECRET_refresh = process.env.JWT_SECRET_refresh;
export const JWT_SECRET_ADMIN = process.env.JWT_SECRET_ADMIN;
export const JWT_SECRET_ADMIN_refresh = process.env.JWT_SECRET_ADMIN_refresh;

export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN;
export const APP_GMAIL = process.env.APP_GMAIL;
export const APP_PASSWORD = process.env.APP_PASSWORD;


export const SALT_ROUND = parseInt(process.env.SALT_ROUND ?? '10')
console.log({SALT_ROUND});

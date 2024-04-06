import { Pool } from 'pg';
import { DATABASE } from "../../tokens.json";

export const pool = new Pool({
    user: DATABASE.USER_NAME,
    host: DATABASE.HOST,
    password: DATABASE.USER_PASSWORD,
    database: DATABASE.BASE_NAME,
    port: DATABASE.PORT
});
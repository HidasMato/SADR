import { Pool } from 'pg';
import { name, pass, bd, host, port } from "../../tokens.json";

export const pool = new Pool({
    user: name,
    host: host,
    password: pass,
    database: bd,
    port: port
});
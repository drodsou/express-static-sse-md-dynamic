import Database from 'better-sqlite3';
import fs from 'fs';
import {__dirname} from '#root/server/lib/dirutil.js';
let db


export function dbConnect ({resetDb=false}={}) {
  db = new Database(process.cwd() + '/test.sqlite3', {});

  if (resetDb) {
    let migrateSql = fs.readFileSync(__dirname(import.meta.url) + '/migrate.sql','utf8');
    db.exec(migrateSql);
  }

  process.on('exit', () => db.close());
  process.on('SIGHUP', () => process.exit(128 + 1));
  process.on('SIGINT', () => process.exit(128 + 2));
  process.on('SIGTERM', () => process.exit(128 + 15));

  return db;

}

export function dbGet() {
  if (!db) { throw new Error('sqlite3 db not connected') }
  return db;
}
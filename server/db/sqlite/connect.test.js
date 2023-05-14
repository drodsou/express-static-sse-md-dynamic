import { dbConnect, dbGet } from './connect.js';

let db = dbConnect({resetDb:true});

let db2 = dbGet()

let q1 = db2.prepare('select * from users where id > :id')
let res = q1.({id:3})
console.log(res)

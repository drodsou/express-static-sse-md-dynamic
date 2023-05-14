import {dbGet} from '#root/server/db/sqlite/connect.js';

let db = dbGet()
let q1 = db.prepare('select * from users where id > :id')

export default async function ({req, props}) {
  // -- fake db call
  // let data = await new Promise (r=>setTimeout(()=>r({uno:1, dos:2}),300))
  
  let rows = q1.all({id: parseInt(props.id || 3)})
  return {error:'', rows };

}
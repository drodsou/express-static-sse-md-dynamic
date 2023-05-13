export default async function page ({req, props}) {

  // -- fake db call
  let data = await new Promise (r=>setTimeout(()=>r({uno:1, dos:2}),1000))

  return JSON.stringify(data, null, 2);


}
export default function page ({req, props}) {

  const someVar = "someVar"

  return /*html*/`
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=<device-width>, initial-scale=1.0">
    <title>Document</title>
  </head>
  <body>
    <h1>gron/chis 1</h1>

    Var: ${someVar}
    Props: ${props}
    
  </body>
  </html>
  
  `;
}
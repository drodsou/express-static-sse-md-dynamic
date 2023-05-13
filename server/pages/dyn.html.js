import layout from '#root/server/comp/layout.js';
export default async function page ({req, props}) {

  const someVar = "someVar"

  return layout({title:'Dyn', body:`
  <h1>Dynamic 5</h1>

  Var: ${someVar}
  Props: ${props}

  <button onclick="this.innerText = parseInt(this.innerText)+1">1</button>

  <img src="/img/img1.jpg">
  `});

}
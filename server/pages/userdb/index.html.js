import layout from '#root/server/comp/layout.js';
export default async function page ({req, props}) {

  const someVar = "someVar"

  return layout({title:'User', body: /*html*/`
    <h1>User</h1>
    <button>1</button>
    <div class="result">...</div>
    
  `});

}
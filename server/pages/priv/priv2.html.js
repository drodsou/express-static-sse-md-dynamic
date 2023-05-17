import layout from '#root/server/comp/layout.js';
export default async function page ({req, props}) {
  return layout({title:'Priv2', body:`
  <h1>Priv2 : dynamic.</h1>
  User via SSR: ${req.session.user}

  `});

}
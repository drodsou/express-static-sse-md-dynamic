/*
SSR auth boilerplate, protecting priv/ routes
TODO: 
  - login check password against some db
  - register page and post
  - user profile edit

*/
import session from 'express-session';

export default function auth (srv) {
  srv.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true  // not accesible by js
      //secure: true, // https only
      // maxAge : 
    }
  }))

  srv.use((req,res,next)=>{
    console.log('srv.use', req.session.user, req.path)
    if (!req.session.user && req.path.startsWith('/priv')) {
      req.session.urlAfterLogin = req.path
      return res.redirect(302, '/auth/login') // 302 de facto standard for redirecting to login, but not official
    }
    next()
  })

  // -- for csr pages that need this info as api
  srv.get('/auth/info',(req,res)=>{
    res.writeHeader(200, {"Content-Type": "application/json"});  
    res.write(`{"user":"${req.session.user}", "group":"${req.session.group}"}`);  
    res.end();
  })

  srv.get('/auth/login',(req,res)=>{
    return sendLoginForm(res);
  })

  srv.post('/auth/login',(req,res)=>{
    console.log('login post received', req.body)
    // -- validation
    let errors = {}
    if (!errors.user && !req.body.user) errors.user = 'User cannot be empty';
    if (!errors.password && req.body.password !== 'hola') errors.password = 'Wrong password';
    if (Object.keys(errors).length) return sendLoginForm(res, {values:req.body, errors});

    // -- ok
    req.session.user = req.body.user;
    console.log('user logged', session.user)
    res.redirect(302, req.session.urlAfterLogin || '/')
  })

  srv.get('/auth/logout',(req,res)=>{
    delete req.session.user
    delete req.session.urlAfterLogin
    res.redirect(302, '/auth/login')
  })

  // srv.get('/auth/register',(req,res)=>{

  // })
  // srv.post('/auth/register',(req,res)=>{
    
  // })

}



function sendLoginForm(res, lfArgs) {
  res.writeHeader(200, {"Content-Type": "text/html"});  
  res.write(LoginForm(lfArgs));  
  res.end();
}

function LoginForm({register=false, values={}, errors={}} = {}) {
  
  return `
  <style>
    label {
      display:block;
      margin-bottom: 20px;
    }
    label span {
      display:block;
      color: red;
    }
  </style>

  <h1>${register ? 'Register' : 'Login'}</h1>
    <form action="/auth/${register ? 'register' : 'login'}" method="POST">

      <label>User (email) <span>${errors.user || ''}</span>
        <input type="email" name="user" value="${values.user||''}">
      </label>

      <label>Password (hola) <span>${errors.password || ''}</span>
        <input type="password" name="password" value="${values.password||''}">
      </label>

      <button>submit</button>
    </form>
  `

}
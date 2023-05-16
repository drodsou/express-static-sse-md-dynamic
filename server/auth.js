export default function auth (srv) {
  srv.use((req,res,next)=>{

  })
  srv.get('/login',(req,res)=>{

  })
  srv.post('/login',(req,res)=>{
    
  })
  srv.get('/register',(req,res)=>{

  })
  srv.post('/register',(req,res)=>{
    
  })
  srv.get('/logout',(req,res)=>{
    
  })
}




function LoginForm(register=false) {
  return `
    <form action='/login' method='POST'>
      <label>User <input type="email" name="user"></label>
      <label>Password <input type="password" name="password"></label>
    </form>
  `


}
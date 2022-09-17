import { Router, Request, Response, NextFunction } from "express";

interface RequestWithBody extends Request {
  body: {[key: string]: string | undefined};
}

function requireAuth(req:Request, res: Response, next: NextFunction): void{
      if(req.session && req.session.loggedIn){
          next();
          return;
      }else{
        res.send("Not Permitted");
      }
}


const router = Router();

router.get('/login', (req: Request, res: Response) => {
    res.send(
        `
        <form method="POST">
           <div> 
             <label> Email </label>
             <input name="email" /> 
           </div> 

           <div> 
              <label> Password </label>
              <input name="password" type="password"/>
           </div>
           <button> Submit </button>
        </form>
        `
    )
});

router.post('/login', (req: Request, res: Response) => {
    const { email, password } = req.body;
    
    if (email && password && email ==='hi@hi.com' && password ==='password'){
         req.session = {loggedIn: true};
         res.redirect('/');
    }else{
        res.send('invalid email or password')
    }
});

router.get('/', (req: Request, res: Response) => {

    if (req.session && req.session.loggedIn) {
       res.send( `
          <div> You are logged in  </div>
          <a href="/logout"> Logout </a>
       `)
    } else {
      res.send(
        `
        <div> You are not logged in </div>
        <a href="/login"> Login </a>
       `
      );
    }   
});

router.get('/logout', (req: Request, res: Response) => {
    req.session = undefined;

    res.redirect('/');
});

router.get('/protected', requireAuth, (req: Request, res: Response) => {
   res.send ("Welcome  to the protected route, you are logged in");
})

export { router };
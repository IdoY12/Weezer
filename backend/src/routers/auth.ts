import { Router } from "express";
import { login, signup } from "../controllers/auth/controller";
import validation from "../middlewares/validation";
import { loginValidator, signupValidator } from "../controllers/auth/validator";
import passport from "../Oauth/google";
import { sign } from "jsonwebtoken";
import config from "config";

const router = Router()

router.post('/signup', validation(signupValidator), signup)
router.post('/login', validation(loginValidator), login)

router.get('/google', passport.authenticate('google', { 
    scope: ['profile', 'email'], 
    session: false
}));
// Only after the user approves Google login,
// Google redirects back here and this middleware is executed - and here we get the auth code
router.get('/google/callback', 
   // Passport exchanges the auth code for tokens
  // and fetches the user's profile (email, id, etc.)
  passport.authenticate('google', { 
    failureRedirect: '/login', 
    session: false
  }),
  function(req, res) {
    const jwtSecret = config.get<string>('app.jwtSecret')
    
    const {password, email, googleId, ...user} = req.user as any
    const jwt = sign(user, jwtSecret)
    res.redirect(`http://localhost:5173?jwt=${jwt}`)
});

export default router
const express = require('express');
const router = express.Router();

const { check, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const auth = require('../middleware/auth');
const jwtSecret = "secret";

// Get the loged in user
// Private route
// auth middleware
router.get('/', auth,(req, res)=>{
    User.findById(req.user.id)
        .then(user => res.json(user))
        .catch(err => console.log(err.message))
})

//login the user and get token
router.post('/', [
    check('email', 'Please include a valid email!').isEmail(),
    check('password', 'Password is required!').not().isEmpty()
],(req,res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.json({errors: errors.array()})
    }

    const { email, password } = req.body

    //check if user exist
    User.findOne({email})
        .then(user => {
            if(!user){
                return res.json({msg: "Please register first!"})
            }else{
                //Compare password
                bcrypt.compare(password, user.password, (err, isMatch)=>{
                    if(err){
                        console.log(err.message);
                    }else if(isMatch){
                        const payload = {
                            user: {
                                id: user.id
                            }
                        }

                        jwt.sign(payload, jwtSecret, {expiresIn: 3600000}, (err, token)=>{
                            if(err) throw err
                            res.json({token})
                        })
                    } else{
                        return res.json({msg: "Wrong Password!"})
                    }
                })
            }
        })
        .catch(err => console.log(err.message))
})

module.exports = router;
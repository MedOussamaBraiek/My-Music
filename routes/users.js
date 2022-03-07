const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator')
const bcrypt = require('bcryptjs');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

const jwtSecret = "secret";

//Register User
router.post('/', [
    check('firstName','Please enter your first name').not().isEmpty(),
    check('lastName','Please enter your last name').not().isEmpty(),
    check('email','Please enter a valid Email').isEmail(),
    check('password','Passwrod must be 6 or more characters').not().isEmpty().isLength({min:6})
] ,(req, res)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.json({errors: errors.array()})
    }
    const { firstName, lastName, email, password } = req.body
    //User.findOne({email: req.body.email})
    User.findOne({email})
        .then(user => {
            if(user){
                return res.json({msg: 'User already exists!!'})
            }else {
                user = new User({
                    //firstName: req.body.firstName
                    firstName,
                    lastName,
                    email,
                    password
                })

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(user.password, salt, (err, hashedPassword)=>{
                        user.password = hashedPassword;

                        //save to db
                        user.save()

                        const payload = {
                            user: {
                                id: user.id
                            }
                        }

                        jwt.sign(payload, jwtSecret, {expiresIn: 3600000}, (err, token)=>{
                            if(err) throw err
                            res.json({token})
                        })
                            
                    })
                })                
            }
        }).catch(err => console.log(err.message))
})

module.exports = router;
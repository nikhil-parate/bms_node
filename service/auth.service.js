const mongo = require('../mongo');
const bcrypt = require('bcrypt');
const joi = require('joi');
const jwt = require('jsonwebtoken');
const regschema = joi.object ({
    name: joi.string().required(),
    email: joi.string().required().email(),
    phone: joi.number().integer().min(10).required(),
    password: joi.string().alphanum().min(6).required()
});
const logschema = joi.object({
    email: joi.string().required(),
    password: joi.string().alphanum().min(6).required()
});

const service = {
    async register(data,res) {
        //console.log("register",data);
        const {error} = regschema.validate(data);
        if(error) {
            return res.send({error: error.details[0].message});
        }
       const user = await this.findUserEmail(data.email);
       if(user) {return res.status(400).send({error:"user already exist"})}
      
       const salt = await bcrypt.genSalt(10);
       data.password = await bcrypt.hash(data.password, salt);
       console.log(mongo.db.collection('user').find())
       await mongo.db.collection('user').insertOne(data);
       res.send({message:"successfully registered"})
    },
    async userLogin(data,res) {
       const {error} = logschema.validate(data);
       if(error) {
           return res.send({error: error.details[0].message});
       }
       const user = await this.findUserEmail(data.email);
       if(!user) {return res.status(400).send({error:"username or password is incorrect, email"})}
       const valid = await bcrypt.compare(data.password, user.password);
       if(!valid) {
           return res.status(400).send({error:"username or password is incorrect.pass"});
       }
       const token = jwt.sign({ userId: user._id}, process.env.TOKEN_PASS, {expiresIn: '8h'});
       //console.log(token);
        res.send({ token });
    }, 
    async adminLogin(data,res) {
        const {error} = logschema.validate(data);
        if(error) {
            return res.send({error: error.details[0].message});
        }
        const user = await this.findAdminEmail(data.email);
        if(!user) {return res.status(400).send({error:"username or password is incorrect, email"})}
        //const valid = await bcrypt.compare(data.password, user.password);
        //if(!valid) {
          //  return res.status(400).send({error:"username or password is incorrect.pass"});
        //}
        const token = jwt.sign({ userId: user._id}, process.env.TOKEN_PASS, {expiresIn: '8h'});
        console.log(token);
         res.send({ token });
     }, 
    findUserEmail(email) {
     return mongo.db.collection("user").findOne({email});
    },
    findAdminEmail(email) {
        return mongo.db.collection("admin").findOne({email});
       },
   }
   
   module.exports = service;
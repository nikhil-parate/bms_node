const express = require('express');
const router = express.Router();
const authservice = require("../service/auth.service"); 

router.post('/register',async (req,res)=>{
    await authservice.register(req.body, res);
    console.log(req.body);
})

router.post('/user-login',async (req,res)=>{
    await authservice.userLogin(req.body, res);
})

router.post('/admin-login',async (req,res)=>{
    await authservice.adminLogin(req.body, res);
})
module.exports = router;
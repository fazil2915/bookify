const express=require('express');
var router = express.Router();


router.get('/',(req,res) => {
 res.render('layout')
})
 
router.post('/signup',(req,res)=>{
    res.redirect('')
});
router.get('/home',(req,res)=>{
    
  res.send('hey')
})
module.exports=router;
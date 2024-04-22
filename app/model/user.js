const mongoose = require('mongoose');

const Scema=mongoose.Schema
    
const userSchema=new Scema({
        email:{type:String, required: true,},
        password:{type:String, required: true}


    })

    
module.exports =mongoose.model('User',userSchema);
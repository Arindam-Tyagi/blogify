const { createHmac,randomBytes } = require('crypto');
const { Schema,model} = require('mongoose');
const {createTokenForUser , validateToken } = require("../services/authentication") 

const userSchema= new Schema({
    fullname:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    salt:{
        type:String,
    },
    password:{        
        type:String,
        required:true,
    },
    profileImage:{
        type:String,
        default:'../default-avatar-profile-icon-of-social-media-user-vector.jpg'
    },
    role:{
        type:String,
        enum :["USER","ADMIN"],
        default: "USER"
    }
},
    {timestamps:true}
);

userSchema.pre('save', function(next){
    const user=this;
    if(!user.isModified("password")){
        return next();
    }
    const salt = randomBytes(16).toString();
    const hashedPassword = createHmac('sha256', salt )
                        .update(user.password)
                        .digest('hex');
    this.salt=salt;
    this.password=hashedPassword;
    next();
});

userSchema.static("matchedPasswordAndGenerateToken",async function(email,password){
    const user = await this.findOne({email})
    if(!user) throw new Error("no user found")
    
     const hashedPassword =user.password;
     const salt = user.salt;
     const userprovidedHash = createHmac('sha256', salt )
                                .update(password)
                                .digest('hex'); 

     if(userprovidedHash!==hashedPassword) throw new Error("invalid passsword");
     
     const token = createTokenForUser(user);
     return token;
})

const User=model('User',userSchema);

module.exports=User;
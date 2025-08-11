require("dotenv").config();
//making changes

const express = require('express');
const mongoose  = require('mongoose');
const path = require('path');
const cookieParser = require('cookie-parser')

const Blog = require('./models/blog')

const userRoutes=require('./routes/user');
const blogRoutes=require('./routes/blog');

const { checkAuthenticationCookies } = require('./middlewares/authentication');
const PORT=process.env.PORT;

mongoose.connect(process.env.Mongo_URL)
        .then(()=>{
            console.log("connected to mongoDB")
        })
const app=express();

app.set('view engine','ejs');
app.set('views',path.resolve('./views'))

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());
app.use(checkAuthenticationCookies("token"))
app.use(express.static(path.resolve("./public")))

app.use('/user',userRoutes);
app.use('/blog',blogRoutes);


app.get('/',async (req,res)=>{
    const blogs = await Blog.find({});
    res.render('homepage',{
        user: req.user,
        blogs :blogs
    })
})

app.listen(PORT,()=>{
    console.log(`Listening on ${PORT}`)
})
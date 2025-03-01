const { Router} =require("express")
const router= Router();
const multer = require("multer");
const path = require('path');

const Blog = require('../models/blog');
const Comment = require('../models/comment');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, path.resolve('./public/uploads'))
    }, 
    filename: function (req, file, cb) {
      const fileName = `${Date.now()}-${file.originalname}`;
      cb(null, fileName);
    }
  });
  
  const upload = multer({ storage: storage })
router.get('/add-new',(req,res)=>{
    res.render('addblog',{
        user : req.user
    })
});

router.get('/:id', async (req,res)=>{
  const blog = await Blog.findById(req.params.id).populate("createdby")
  const comment = await Comment.find({blogId: req.params.id}).populate("createdBy")
  if(!blog) return res.status(404).send("Blog not found");
  res.render('blog',{
    user :req.user,
    blog: blog,
    comments:comment
  })
})

router.post('/comment/:blogid',async (req,res)=>{
  console.log(req.body.content,req.user._id,req.params.blogid)
  await Comment.create({
    content: req.body.content,
    createdBy: req.user._id,
    blogId: req.params.blogid
  })
  return res.redirect(`/blog/${req.params.blogid}`)
})

router.post('/',upload.single('cover-image'), async (req,res) =>{
  console.log("Uploaded file:", req.file); 
  console.log("Request body:", req.body);
  const {title , body } = req.body;
  const blog = await Blog.create({
    title,
    body,
    createdby: req.user._id,
    coverImageUrl: `/uploads/${req.file.filename}`
  })
  return res.redirect(`/`)
})

router


module.exports = router;
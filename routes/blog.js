const { Router } = require("express");
const path = require('path');
const multer = require("multer");
const Blog = require("../models/blog"); 

const router = Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve(`./public/uploads`));
  },
  filename: function (req, file, cb) {
    const fileName = `${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  }
});

const upload = multer({ storage: storage });

// 1. GET: Render the Add Blog form
router.get('/add-new', (req, res) => {
    return res.render('addBlog', {
        user: req.user,
    });
});

// 2. POST: Handle blog creation
router.post('/add-new', upload.single("coverImage"), async (req, res) => {
    try {
        const { title, body } = req.body;

        let coverImgUrl = "";
        if (req.file) {
            coverImgUrl = `/uploads/${req.file.filename}`;
        }

        const newBlog = await Blog.create({
            title,
            body,
            createdBy: req.user._id,
            coverImgUrl: coverImgUrl 
        });

        // Redirect to home (or to the specific blog page if you prefer)
        return res.redirect("/");

    } catch (error) {
        console.error("Error creating blog:", error);
        // FIXED: Redirect back to the form if something goes wrong
        return res.redirect("/blog/add-new"); 
    }
});

// 3. GET: View a specific blog post
// FIXED: Added 'async' and the arrow '=>'
router.get('/:id', async (req, res) => {
    try {
        const blogId = req.params.id;
        const blogPost = await Blog.findById(blogId).populate('createdBy');
        
        // Safety check if the blog doesn't exist
        if (!blogPost) {
            return res.status(404).send("Blog not found!");
        }

        return res.render('blog', {
            user: req.user,
            blog: blogPost 
        });
    } catch (error) {
        // FIXED: Added try/catch so bad IDs don't crash the server
        console.error("Error fetching blog:", error);
        return res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
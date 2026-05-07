const express = require('express');
const path = require('path');
const app = express();
const userRouter = require("./routes/user");
const BlogRouter = require("./routes/blog");
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { checkForAuthCookie } = require('./middleware/authentication');
const Blog = require("./models/blog"); 

const PORT = 8000;

mongoose.connect("mongodb://127.0.0.1:27017/blogFyy")
    .then((e) => console.log("MongoDb Connected"))
    .catch((e) => console.log(e));

app.set('view engine', 'ejs');
app.set("views", path.resolve("./views"));
app.use(express.static(path.resolve('./public')));//for upload img
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(checkForAuthCookie('token'));

app.get("/", async (req, res) => {
    try {
        const allBlogs = await Blog.find({}).sort({ createdAt: -1 });

        return res.render('home', {
            user: req.user,
            blogs: allBlogs 
        });

    } catch (error) {
        console.error("Error loading home page:", error);
        return res.status(500).send("Internal Server Error");
    }
});

app.use("/user", userRouter);
app.use("/blog", BlogRouter);

app.listen(PORT, () => console.log(`Server is Creted ${PORT}`));
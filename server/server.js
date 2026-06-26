const express = require('express');
const path = require('path');
const bcrypt = require('bcrypt');

require('dotenv').config();
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;
const User = require("./models/User");
const Post = require("./models/Post")

const jwt = require('jsonwebtoken');
const authMiddleware = require("./middleware/authMiddleware");

const userRoutes = require("./routes/userRoutes");
const locationRoutes = require("./routes/locationRoutes");  
const newsRoutes = require("./routes/newsRoutes")
const randomFactsRoutes = require("./routes/randomFactsRoutes");
const placeRoutes = require("./routes/placeRoutes")
const countryRoutes = require("./routes/countryRoutes") 

app.use(express.json());
app.use("/api/location", locationRoutes);

app.use("/api/users", userRoutes);

app.use("/api/news", newsRoutes);

app.use("/api/random-fact", randomFactsRoutes);

app.use("/api/places", placeRoutes);

app.use("/api/country", countryRoutes);

app.use(express.static(path.join(__dirname, "../public")));


mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("Connected to MongoDB");
})
.catch((err) => {
    console.error("Error connecting to MongoDB: ", err);
});

app.post("/register", async (req, res) => {

    try {

        console.log("Register endpoint hit with data: ", req.body);
        const {name, username, password} = req.body;

        const existingUser = await User.findOne({username});

        if(existingUser){
            return res.status(400).json({
                message: "User already exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            username,
            password: hashedPassword,
        })

        await user.save();

        res.status(201).json({
            message: "User registered successfully"
        })
    }catch(error){
        console.error("Error registering user: ", error);
        res.status(500).json({
            message: "Internal server error"
        })
    }

});

app.post("/login", async (req, res) => {

    try {
        const {username, password} = req.body;

        const user = await User.findOne({username});

        if(!user){
            return res.status(400).json({
                message: "Invalid username"
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if(!isMatch){
            return res.status(400).json({
                message: "Invalid password"
            })
        }

        const token = jwt.sign({userId: user._id}, process.env.JWT_SECRET, {expiresIn: "20h"});

        res.json({
            token
        });
    }catch(error){
        console.error("Error logging in: ", error);
        res.status(500).json({
            message: "Internal server error"
        })
    }
});

// create post
app.post("/createpost", authMiddleware, async (req, res) => {

    try {

        console.log("Here is createpost data : ", req.body);

        const {image, title, location, description} = req.body;

        if (!title || !description) {
            return res.status(400).json({
                message: "Title and description are required."
            });
        }

        const post = new Post({
            userId: req.userId,
            image,
            title,
            location,
            description
        })

        await post.save();

        res.status(201).json({
            success: true,
            message: "Post created successfully"
        });

    }catch(error){

        console.error("Create Post Error:", error);

        res.status(500).json({
            success: false,
            message: "Internal server error"
        });

    }

});

// get posts
app.get("/posts", authMiddleware, async (req, res) => {

    try {

        const posts = await Post.find({
            userId: req.userId
        }).sort({ createdAt: -1 });

        res.json(posts);

    } catch (error) {

        console.error(error);
        
        res.status(500).json({
            message: "Internal Server Error"
        });

    }

});

app.get("/verify-token", authMiddleware, (req, res) => {
    res.json({
        valid: true,
        userId: req.userId,
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})


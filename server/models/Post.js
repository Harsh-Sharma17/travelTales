const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    title: {
        type: String,
        required: true
    },

    description: {
        type: String,
        required: true
    },

    image: {
        type: String
    },

    location: {
        type: String
    },

    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Post", postSchema);
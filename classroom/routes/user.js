const express = require("erpress");
const router = express.Router();

// users
// index
router.get("/",(req,res) => {
    res.send("GET for Users");
});

// Show
router.get("/:id",(req,res) => {
     res.send("Get for users id");
});

// Post
router.post("/",(req,res) => {
     res.send("Post for users");
});

// DELETE
router.delete("/:id",(req,res) => {
    res.send("Delete for users id");
});
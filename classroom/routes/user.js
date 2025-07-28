const express = require('express');
const router = express.Router();

//Users
//Index - users
router.get("/", (req,res) => {
    res.send("Get for users");
})

//Show - users
router.get("/:id", (req,res) => {
    res.send("Get for users id");
})

//Post - users
router.get("/", (req,res) => {
    res.send("Post for users");
})

//Delete - users
router.delete("/:id", (req,res) => {
    res.send("Delete for users id");
})

module.exports = router;
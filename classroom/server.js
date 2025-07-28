const express = require ('express');
const app = express();
const port = 3000;
const users = require("./routes/user.js");
const posts = require("./routes/post.js");
const cookieParser = require("cookie-parser");

app.use(cookieParser("secretcode"));

app.get("/getsignedcookie", (req,res) => {
    res.cookie("made-in", "India",{signed: true});
    res.send("Signed cookies sent");
})

app.get("/verify", (req,res) => {
    console.log(req.signedCookies);
    res.send("verified");
})

app.get("/getcookies", (req,res) => {
    res.cookie("greet", "hello");
    res.send("sent you some cookies!")
})

app.get("/", (req,res) => {
    console.dir(req.cookies);
    res.send("hi, i am root");
});

app.get("/greet", (req,res) => {
    let{name = "anonymous"} =req.cookies;
    res.send(`hello ${name}`);
})

app.get("/", (req,res) => {
    res.send("Hello World!");
})

app.use("/users", users); 
app.use("/posts", posts)


app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})
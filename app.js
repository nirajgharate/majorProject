const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const path = require("path");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");


const listings = require("./routes/listing.js");
const reviews = require("./routes/review.js");
 
const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

main().then(() => {
    console.log("Database is working well!");
}).catch((err) => {
    console.log(err);
});
async function main(){
    await mongoose.connect(MONGO_URL)
}

app.set("view engine" , "ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));
app.engine("ejs",engine);
app.use(express.static(path.join(__dirname,"/public")));

app.get("/", (req,res) => {
    res.send("Server is working well");
});


app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);


// app.all("*", (req, res, next) => {
//     next(new ExpressError(404,"Page Not Found!"));
// }); 



app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong" } = err;
    console.log("Rendering error page with message:", message);
    res.status(statusCode).render("error.ejs", {message});
});

// app.use((err,req,res,next) => {
//     // res.send("Something went wrong");
//     let{statusCode = 500, message = "Something went wrong"} = err;
//     res.render("error.ejs",{message});
//     // res.status(statusCode).send(message);
// });

app.listen(port,() => {
    console.log(`Server is running on port ${port}`);
}); 

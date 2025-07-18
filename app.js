const express = require("express");
const app = express();
const mongoose = require("mongoose");
const port = 8080;
const Listing = require('./models/listing.js');
const path = require("path");
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const wrapAsync = require("./utils/wrapAsync.js");
const ExpressError = require("./utils/ExpressError.js");

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
})

app.get(
    "/listings",
    wrapAsync(async (req,res) => {
    const allListings = await Listing.find({});
        res.render("listings/index.ejs", {allListings});
    })
);

    // app.get("/listings/",async (req,res) => {
    // const allListings = await Listing.findMyId({});
    //     res.render("listings/index.ejs", {allListings});
    // });

    //new route
    app.get("/listings/new", (req,res) => {
        res.render("listings/new.ejs");
    });

    //show route
    app.get(
        "/listings/:id",
        wrapAsync(async (req,res) => {
        let {id} = req.params;
        const listing = await Listing.findById(id);
        res.render("listings/show.ejs", {listing});
    })
);

    //Create Route
    app.post(
        "/listings",
        wrapAsync(async(req,res,next) =>{
        if(!req.body.listing){
            throw new ExpressError(400, "Send valid data for listing");
        }
        const newListing = new Listing(req.body.listing);
        await newListing.save();
        res.redirect("/listings");
        
    })
);

    //edit route
    app.get(
        "/listings/:id/edit",
        wrapAsync(async(req,res) => {
        let {id} = req.params;
        const listing = await Listing.findById(id);
        res.render("listings/edit.ejs", { listing });
    })
);

    //update routes
    app.put(
        "/listings/:id",
        wrapAsync(async(req,res) => {
        let {id} = req.params;
        await Listing.findByIdAndUpdate(id,{...req.body.listing});
        res.redirect(`/listings/${id}`);
    })
);

    //Delete Route
    app.delete(
        "/listings/:id", 
        wrapAsync(async(req,res) => {
        let {id} = req.params;
        let deleteListing = await Listing.findByIdAndDelete(id);
        console.log(deleteListing);
        res.redirect("/listings");
    })
);

// app.get("/testListing",async(req,res) => {
//     let sampleListing = new Listing({
//         "title": "Sample Listing",
//         "description": "This is a sample listing",
//         "price": 1000.00,
//         "location": "New York",
//         country: "India",
//     });
//     await sampleListing.save();
//     console.log("Sample was saves");
//     res.send("successful testing");
// });

// app.all("*",(req,res,next) => {
//     next(new ExpressError(404,"Page Not Found"));
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
const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = 'mongodb://127.0.0.1:27017/wanderlust';

main()
.then(() => {
    console.log("Database is working well!");
})
.catch((err) => {
    console.log(err);
});

async function main(){
    await mongoose.connect(MONGO_URL)
}

const initDB = async() =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) =>({
        ...obj,
         owner: "688c7d2ca8a8d93dc72c5b80",
        }));
        console.log(initData);
    await Listing.insertMany(initData.data);
    console.log("Data was initiallize");
};

initDB();

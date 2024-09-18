const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listings.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderLust";

main()
.then(()=>{
    console.log("DB is connected");
})
.catch((err)=>{
    console.log(err);
})

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj)=> ({...obj, owner: "66e0bb38b568170b44630fb9"}))
    await Listing.insertMany(initData.data);
    console.log("Data is initilized");
}

initDB();
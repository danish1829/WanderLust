if (process.env.NODE_ENV != "production") {
    require("dotenv").config();
}
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverRide = require("method-override");
const ejsMate = require("ejs-mate");
const ExpresError = require("./utils/Error.js");
const { error } = require("console");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const port = 8080;
//const MONGO_URL = "mongodb://127.0.0.1:27017/wanderLust";
const dburl = process.env.ATLASBD_URL;

main()
.then(()=>{
    console.log("DB is connected");
})
.catch((err)=>{
    console.log(err);
})

async function main() {
    await mongoose.connect(dburl);
}

app.set("view engine","ejs");
app.set("views", path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(methodOverRide("_method"));
app.engine('ejs', ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const store = MongoStore.create({
    mongoUrl: dburl, 
    crypto: {
        secret: process.env.SECRET,
    },
    touchAfter: 24 * 3600, 
});


store.on("error", (err) => {
    console.log("Error in Mongo session store", err);
});


const sessionOptions = {
    store,
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
    }
};

// app.get("/",(req, res)=> {
//     req.send("Hii, I m root");
// })

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next)=> {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});

// app.get("/demouser", async (req, res) => {
//     let fakeUser = new User({
//         email: "aman@gmail.com",
//         username: "aman"
//     });
//     let registedUser = await User.register(fakeUser,"hello");
//     res.send(registedUser);
// })

app.use("/listings", listingRouter);
app.use("/listings/:id/reviews", reviewRouter);
app.use("/", userRouter);



// app.get("/testlisting", async (req,res)=>{
//     let newListing = new Listing({
//         title:"Home",
//         description:"nice place",
//         price:1200,
//         location:"goa",
//         country:"india"
//     })
//     await newListing.save();
//     console.log("sample is saved");
//     res.send("succesfull testing");
// })

 app.all("*",(req, res, next) => {
     next(new ExpresError(404, "Page not found!"));
 });

app.use((err, req, res, next)=>{
    let {statusCode = 500 , message = "Something went wrong!!"} = err;
    res.status(statusCode).render("errors.ejs",{message});
});

app.listen(port,()=>{
    console.log(`app is listening ${port}`);    
})

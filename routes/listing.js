const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpresError = require("../utils/Error.js");
const { listingSchema } = require("../schema.js");
const Listing = require("../models/listings");
const {isLoggedIn , isOwner} = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const multer  = require('multer')
const {storage} = require("../cloudConfig.js");
const upload = multer({ storage });

const validateListing = (req, res, next) => {
    let {error} = listingSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpresError(400, errMsg);
    }else{
        next();
    }
};

//index route----
router.get("/" , wrapAsync(listingController.index));

//new route-----
router.get("/new",isLoggedIn ,listingController.renderNewForm);

//show route-----
router.get("/:id",wrapAsync ( listingController.showListing));

//create route----
router.post("/" ,
    isLoggedIn,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.createListing));

//Edit route-----
router.get("/:id/edit",
    isLoggedIn,
    isOwner,
    wrapAsync(listingController.editListing));

//Update route----
router.put("/:id/",
    isLoggedIn,
    isOwner,
    upload.single('listing[image]'),
    validateListing,
    wrapAsync (listingController.updateListing));

//Delete route-----
router.delete("/:id",isLoggedIn,isOwner,wrapAsync ( listingController.deleteListing));

module.exports = router;
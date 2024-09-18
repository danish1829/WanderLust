const express = require("express");
const router = express.Router({mergeParams: true});
const wrapAsync = require("../utils/wrapAsync.js");
const ExpresError = require("../utils/Error.js");
const Review = require("../models/review.js");
const { reviewSchema } = require("../schema.js");
const Listing = require("../models/listings");
const { isLoggedIn, isReviewOwner } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

const validateReview = (req, res, next) => {
    let {error} = reviewSchema.validate(req.body);
    if(error) {
        let errMsg = error.details.map((el)=> el.message).join(",");
        throw new ExpresError(400, errMsg);
    }else{
        next();
    }
};

// ------REVIEW ---- POST REQUEST------
router.post("/",isLoggedIn,validateReview, wrapAsync(reviewController.createReview));

// ---- DELETE REVIEW ----- POST METHOD -----
router.delete("/:reviewId",isLoggedIn, isReviewOwner,wrapAsync(reviewController.deleteReview));

module.exports = router;
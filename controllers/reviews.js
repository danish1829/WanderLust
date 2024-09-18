const Listing = require("../models/listings.js");
const Review = require("../models/review.js");

module.exports.createReview = async (req, res) => {
    let listing = await Listing.findById(req.params.id);
    let newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    listing.reviews.push(newReview);

    await newReview.save();
    await listing.save();
    req.flash("success", "New review created");
    res.redirect(`/listings/${listing._id}`);
}

module.exports.deleteReview = async (req, res) => {
    const { id, reviewId } = req.params; // Removed () after req.params

    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } }); // Fixed the usage of Listing.findByIdAndUpdate
    await Review.findByIdAndDelete(reviewId); // Fixed the usage of Review.findByIdAndDelete
    req.flash("success", "Review deleted");
    res.redirect(`/listings/${id}`); // Corrected to use id
}
const express = require('express');
const router = express.Router({mergeParams:true});
const wrapAsync = require('../utils/wrapAsync');
const Review = require('../controllers/review');
const {validateReview,isLoggedIn,isReviewAuthor} = require('../middleware');

router.post('/',isLoggedIn,validateReview,wrapAsync(Review.createReview));

router.delete('/:reviewId',isLoggedIn,isReviewAuthor,wrapAsync(Review.deleteReview));

module.exports = router;

const express = require('express');
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const campground = require('../controllers/campground'); 
const {isLoggedIn,isAuthor,validateCampground} = require('../middleware');
const multer  = require('multer');
const {storage} = require('../cloudinaryConfig');
const upload = multer({storage});

router.route('/')
.get(wrapAsync(campground.index))
.post(isLoggedIn,upload.array('image'),validateCampground,wrapAsync(campground.createCampground));

router.get('/new',isLoggedIn,campground.renderNewForm);

router.route('/:id')
.get(wrapAsync(campground.showCampgrounds))
.put(isLoggedIn,isAuthor,upload.array('image'),validateCampground,wrapAsync(campground.updateCampground))
.delete(isLoggedIn,isAuthor,wrapAsync(campground.deleteCampground));


router.get('/:id/edit',isLoggedIn,isAuthor,wrapAsync(campground.renderEditForm));

module.exports = router;
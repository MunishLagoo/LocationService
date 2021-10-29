const mongoose = require('mongoose');
const Loc = mongoose.model('Location');


const reviewsReadOne = (req,res) => {
    Loc
      .findById(req.params.locationid)
      .select('name reviews')
      .exec((err,location) => {
        if (!location) {
            return res
                     .status(404)
                     .json({"message":"location not found..."});
        } else if (err) {
                return res
                         .status(400)
                         .json(err)
        }

        if (location.reviews && location.reviews.length > 0) {
            const review = location.reviews.id(req.params.reviewid);
            if (!review) {
                return res
                        .status(400)
                        .json({"message":"review not found ..."});
            } else {
               response = {
                   location : {
                       name: location.name,
                       id: req.params.locationid
                   },
                   review
               };
                return  res
                   .status(200)
                   .json(response);
            }
        } else {
            return res
                     .status(404)
                     .json ({"message":"No reviews found..."});
        }
        
      });

  
};

const reviewsUpdateOne = (req,res) => {
   res
     .status(200)
     .json({"status": "success"});
};

const reviewsDeleteOne = (req,res) => {
    res
      .status(200)
      .json({"status":"success"});
};

const reviewsCreate = (req,res) => {
    const locationId = req.params.locationid;
    if(!locationId) {
        Loc
          .findById(locationId)
          .select(review)
          .exec((err, location) => {
            if (err) {
           return  res
                  .status(404)
                  .json(err);
            } else {
                doAddReview(req,res,location);
            }
          });
    } else {
 return  res
         .status(404)
         .json({"message":"Location not found...."});
    }
};

const doAddReview = (req,res,location) => {
  if (!location) {
    return  res
        .status(404)
        .json({"message": "Location not found..."});
  } else {
      const {author, rating, reviewText} = req.body;
      location.review.push({
          author,
          rating,
          reviewText
      });
      location.save((err, location) => {
          if(err) {
           return  res
                .status(400)
                .json(err);
          } else {
            updateAverageRating(location._id);
            const thisReview = location.reviews.slice(-1).pop();
            res
              .status(201)
              .json(thisReview);
          }
      });
  }
};

const updateAverageRating = (locationId) => {
    Loc.findById(locationId)
       .select('rating reviews')
       .exec((err,location) => {
        if (!err) {
            doSetAverageRating(location);
        }
       });
};

const doSetAverageRating = (location) => {
    if (location.reviews && location.reviews.length > 0) {
        const count = location.reviews.length;
        const total = location.reviews.reduce((acc, {rating}) => {
            return acc + rating; }, 0);
    
    location.rating = parseInt(total/count,10);
    location.save(err => {
        if(err) {
            console.log(err);
        } else {
            console.log(`Average rating updated to $(location.rating}`);
        }
      });
    }
};

module.exports = {
    reviewsReadOne,
    reviewsUpdateOne,
    reviewsDeleteOne,
    reviewsCreate
}
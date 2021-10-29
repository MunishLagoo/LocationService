const mongoose = require('mongoose');
const Loc = mongoose.model('Location');

const locationsReadOne = (req,res) => {
    Loc
      .findById(req.params.locationId)
      .exec((err,location)=> {
          if(!location) {
              return res
                    .status(404)
                    .json({"message": "location not found"});
          } else if (err) {
              return res
                     .status(404)
                     .json(err);
          }
        res
        .status(200)
        .json(location);
      });
 };


const locationsCreate = (req,res) => {
    Loc.create({
        name: req.body.name,
        address: req.body.address,
        facilities:
          req.body.facilities.split(","),
        coords: {
            type: "Point",
            coordinates: [
                parseFloat(req.body.lng),
                parseFloat(req.body.lat)
            ]}, 
        OpeningTime: [{
            days: req.body.days2,
            opening: req.body.opening2,
            closing: req.body.closing2,
            closed: req.body.closed2,
        }]
    }, (err, location) => {
            if (err) {
           return  res.status(404)
                .json(err);
            }
            else { 
                res
            .status(201)
            .json(location);
        } 
    });
    
 };


const locationsListByDistance = async (req,res) => { 
    const lng = parseFloat(req.query.lng);
    const lat = parseFloat(req.query.lat);
    const near = {type: "Point",coordinates: [lng, lat]};
    const geoOptions= {distanceField: "distance.calculated",
        key: 'coords',
        spherical: true,
        maxDistance: 20000,
        num: 10 };
    if (!lng || !lat) {
        return res
                .status(404)
                .json({"message": "lng and lat query parameters are required"});
    }
    try {
        const results = await Loc.aggregate([{$geoNear: {near,...geoOptions}}]);     
        const locations = results.map(result=> {
               return  {
                    id: result.id,
                    name: result.name,
                    address: result.address,
                    rating: result.rating,
                    facilities: result.facilities,
                    distance: `${result.distance.calculated.toFixed()}m`
                    }
        });
        res
         .status(200)
         .json(locations);
    } catch(err) {
        res
         .status(404)
         .json(err);
    }   
};

const locationsUpdateOne = (req,res) => {
    res
      .status(200)
      .json({"status": "success"});
 };

const locationsDeleteOne = (req,res) => {
    res
      .status(200)
      .json({"ststus":"success"});
 };

module.exports = {
    locationsCreate,
    locationsListbyDistance,
    locationsReadOne,
    locationsUpdateOne,
    locationsDeleteOne
};
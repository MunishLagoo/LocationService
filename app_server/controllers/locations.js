
/* Get 'home' page */
const homelist = (req, res) => {
    res.render('locations-list', { title: 'Home'});
};

/* Get 'Location info' page */
const locationInfo = (req, res) => {
    res.render('location-info', { title: 'Loation info'});
};

/* Get 'Add review page' page */
const addReview = (req, res) => {
    res.render('index', { title: 'Add review'});
};

module.exports = {
    homelist,
    locationInfo,
    addReview
};
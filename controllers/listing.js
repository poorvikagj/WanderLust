const Listing = require("../models/listing");
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });


module.exports.index = async (req, res) => {
    const allListings = await Listing.find({});
    res.render("listings/index", { allListings });
}

module.exports.renderNewForm = (req, res) => {
    res.render("listings/new");
}

module.exports.show = async (req, res) => {
    let { id } = req.params;
    //populate nesting
    const listing = await Listing.findById(id).populate({ path: "reviews", populate: { path: "author" } }).populate("owner");
    if (!listing) {
        req.flash("error", "Listing you requested doesn't exist!!!");
        return res.redirect("/listings");
    }
    // console.log(listing);

    res.render("listings/show", { listing });
}

module.exports.createListing = async (req, res, next) => {
    let response = await geocodingClient
        .forwardGeocode({
            query: req.body.listing.location,
            limit: 1,
        })
        .send();
    console.log(response.body.features[0].geometry.coordinates);

    let newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id;
    newListing.geometry = response.body.features[0].geometry;
    let image = req.file;
    if (image) {
        newListing.image.filename = image.filename;
        newListing.image.url = image.path;
    }
    let savedListing = await newListing.save();
    console.log(savedListing);
    req.flash("success", "New Listing added!!!");
    console.log("New listing added");
    res.redirect("/listings");
}

module.exports.editForm = async (req, res) => {
    let { id } = req.params;
    let listing = await Listing.findById(id);
    let OriginalImageUrl = listing.image.url;
    OriginalImageUrl.replace("/upload", "/upload/w_250");
    if (!listing) {
        req.flash("error", "Listing you requested doesn't exist!!!");
        return res.redirect("/listings");
    }
    res.render("listings/edit", { listing, OriginalImageUrl });
}

module.exports.editListing = async (req, res) => {
    let { id } = req.params;
    let editListing = await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    if (typeof req.file !== "undefined") {
        editListing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
        editListing.save();
    }
    req.flash("success", "Listing Updated!!!");
    res.redirect("/listings");
}

module.exports.destroyListing = async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("del", "Listing removed!!!");
    res.redirect("/listings");
}


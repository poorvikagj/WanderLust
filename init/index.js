const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const geocodingClient = mbxGeocoding({ accessToken: "<MAP_TOKEN>" });

const MONGO_LOCAL = "mongodb://127.0.0.1:27017/wanderlust"

// const MONGO_URL = process.env.ATLASDB_URL;
main()
    .then(() => {
        console.log("Connected to DB");
    })
    .catch((err) => console.log(err));

async function main() {
    await mongoose.connect(MONGO_URL);
}



const initDB = async () => {
    await Listing.deleteMany({});

    const updatedData = await Promise.all(
        initData.data.map(async (obj) => {
            let response = await geocodingClient
                .forwardGeocode({
                    query: obj.location,
                    limit: 1,
                })
                .send();

            let geometry = response.body.features[0].geometry;

            return {
                ...obj,
                owner: "698606b0373946e4cbe9ee00",
                geometry: geometry
            };
        })
    );

    await Listing.insertMany(updatedData);
    console.log("data was initialised");
};


initDB();


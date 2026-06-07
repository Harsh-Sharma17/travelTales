const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const routes = express.Router();

routes.post("/current", authMiddleware, async(req, res) => {

    try {
            
        const {latitude, longitude} = req.body;

        const axios = require("axios");

        const result = await axios.get(
            `https://nominatim.openstreetmap.org/reverse`,
            {
                params: {
                    lat: latitude,
                    lon: longitude,
                    format: "json"
                },
                headers: {
                    "User-Agent": "TravelTales/1.0 (harsh29012006@gmail.com)"
                }
            }
        );

        const city = 
            result.data.address.city ||
            result.data.address.town ||
            result.data.address.village ||
            result.data.address.county ||
            "Unknown City";

        const district = result.data.address.suburb ||
            result.data.address.neighbourhood ||
            result.data.address.city_district ||
            result.data.address.state_district ||
            result.data.address.county ||
            "";

        const state = result.data.address.state || "Unknown State";

        const country = result.data.address.country || "Unknown Country";

        res.json({
            city,
            district,
            state,
            country
        });
    } catch(error){
        console.error(
            error.response?.status,
            error.response?.data,
        );

        res.status(500).json({
            message: error.message
        });
    }

});

module.exports = routes;
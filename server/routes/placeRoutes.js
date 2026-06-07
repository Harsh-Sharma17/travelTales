const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const { latitude, longitude } = req.query;

        const response = await fetch(
            `https://api.geoapify.com/v2/places?categories=tourism.sights&filter=circle:${longitude},${latitude},20000&limit=4&apiKey=${process.env.GEO_API_KEY}`
        );

        const data = await response.json();

        res.json(data);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            message: "Failed to fetch places"
        });
    }
});

module.exports = router;
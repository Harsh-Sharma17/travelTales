const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const axios = require("axios"); 

const router = express.Router();

router.get("/", async (req, res) => {

    try {

        const countryName = req.query.country || "india";
        
        const response = await axios.get(
            "https://gnews.io/api/v4/search",
            {
                params: {
                    q: countryName,
                    lang: "en",
                    max: 10,
                    apikey: process.env.GNEWS_API_KEY
                }
            }
        );

        res.json(response.data);
    }
    catch(err){
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;

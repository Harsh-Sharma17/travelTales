const express = require("express");
const axios = require("axios"); 

const router = express.Router();

router.get("/", async (req, res) => {

    try {

        const countryName = req.query.country;

        if(!countryName){
            return res.status(400).json({
                error: "Country name is required"
            });
        }
        
        console.log("API KEY:", process.env.REST_COUNTRIES);
        
        const response = await axios.get(
            "https://api.restcountries.com/countries/v5?",
            {
                params: {
                    q: countryName
                },
                headers: {
                    Authorization: `Bearer ${process.env.REST_COUNTRIES}`
                }
            }
        );

        console.log(responseData);
        
        if (response.ok) {
            countryInfo.innerHTML =
                "<pre>" + JSON.stringify(responseData, null, 2) + "</pre>";
        }

        console.log(JSON.stringify(response.data, null, 2));

        res.json(response.data);
    }
    catch(err){
        console.error(
            err.response?.data || err.message
        );

        res.status(500).json({
            error: err.response?.data || err.message
        });
    }
});

module.exports = router;

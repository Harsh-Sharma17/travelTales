const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const response = await fetch(
            "https://api.api-ninjas.com/v1/facts",
            {
                headers: {
                    "X-Api-Key": process.env.NINJA_API_KEY
                }
            }
        );

        const data = await response.json();
        res.json(data);

    } catch (error) {
        res.status(500).json({
            error: error.message
        });
    }
});

module.exports = router;
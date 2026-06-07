document.addEventListener("DOMContentLoaded", async () => {

    const token = localStorage.getItem("token");

    if(!token){
        alert("You must be logged in to view this page.");
        window.location.href = "/login.html";
        return;
    }

    try{
        const response = await fetch("api/users/dashboard",{
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const user = await response.json();

        document.getElementById("user-name").textContent = ` ${user.name} 👋`;

    }catch (error){
        console.error("Error fetching user profile: ", error);
        alert("Error fetching user profile.");
    }

    // Random fact
    async function loadRandomFact(){

        const randomFactsResponse = await fetch(
        "https://api.api-ninjas.com/v1/facts",
            {
                headers: {
                    "X-Api-Key": process.env.NINJA_API_KEY
                }
            }
        );

        const randomFactsData = await randomFactsResponse.json();

        document.getElementById("random-facts-content").textContent = randomFactsData[0].fact || "No random facts available.";
    } 

    loadRandomFact();

    document.getElementById("random-fact-refresh").addEventListener("click", () => {
        loadRandomFact();
    });

    document.getElementById("location-tracker").addEventListener("click", async () => {

        navigator.geolocation.getCurrentPosition( async(position) =>{
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

            try {

                const response = await fetch("/api/location/current", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        latitude,
                        longitude
                    })
                });

                const data = await response.json();
                
                document.getElementById("current-location").textContent =
                    `Current Location: ${data.city}, ${data.district}, ${data.state}, ${data.country}`;

                // Fact section update

                const place = data.city || data.district || data.state || data.country;

                console.log("Fetching facts for:", place);

                try {

                    // Search Wikipedia
                    const searchResponse = await fetch(
                       `https://en.wikipedia.org/api/rest_v1/page/summary/${data.city}?redirect=true`
                    );

                    const searchData = await searchResponse.json();

                    console.log("Wikipedia search data:", searchData);

                    document.getElementById("facts-content").textContent = searchData.extract || "No facts available for this location.";
                    document.getElementById("wiki-link").href = 
                        searchData.content_urls?.desktop?.page || "#";

                        if (searchResponse.ok) {

                            const imageElement = document.getElementById("fact-image");

                            if(searchData.originalimage){
                                imagesource = searchData.originalimage.source;
                                imageElement.src = imagesource;
                                imageElement.style.display = "block";
                            }else if(searchData.thumbnail){
                                imagesource = searchData.thumbnail.source;
                                imageElement.src = imagesource;
                                imageElement.style.display = "block";
                            }else{
                                imageElement.style.display = "none";
                            }

                            document.getElementById("facts-content").textContent =
                                searchData.extract ||
                                "No facts available for this location.";

                            // Update Wikipedia link
                            document.getElementById("wiki-link").href = searchData.content_urls?.desktop?.page || "#";

                        } else {

                            document.getElementById("facts-content").textContent =
                                "No facts available for this location.";

                            // If there is no data available, remove the link
                            document.getElementById("wiki-link").removeAttribute("href");
                        }
                    
                } catch (error) {

                    console.error("Wikipedia Error:", error);

                    document.getElementById("facts-content").textContent =
                        "Unable to fetch facts right now.";
                }  
                
                // Weather section update
                const weatherResponse = await fetch(
                    `https://wttr.in/${data.city}?format=j1`
                );

                const weatherData = await weatherResponse.json();

                console.log("Weather data:", weatherData);

                if (
                    weatherResponse.ok &&
                    weatherData.current_condition &&
                    weatherData.current_condition.length > 0
                ) {

                    const current = weatherData.current_condition[0];

                    const humidity = current.humidity;
                    const tempC = current.temp_C;
                    const windSpeed = current.windspeedKmph;
                    const weatherDesc = current.weatherDesc[0].value;

                    document.getElementById("weather-info").textContent =
                        `🌡 Temperature: ${tempC}°C | ☁ Weather: ${weatherDesc} | 💧 Humidity: ${humidity}% | 💨 Wind Speed: ${windSpeed} km/h`;

                } else {

                    document.getElementById("weather-info").textContent =
                        "Weather data unavailable";

                }
                
                // Places to visit section update
                const placesResponse = await fetch(
                    `https://api.geoapify.com/v2/places?categories=tourism.sights&filter=circle:${longitude},${latitude},20000&limit=4&apiKey=${process.env.GEO_API_KEY}`
                );

                const placesData = await placesResponse.json();

                const placesContainer =
                    document.getElementById("places-content");

                placesContainer.innerHTML = "";

                if (placesData.features.length === 0) {

                    placesContainer.textContent =
                        "No tourist attractions found nearby.";

                } else {

                    placesData.features.forEach(place => {

                        const div = document.createElement("div");

                        div.innerHTML = `
                            <h4>${place.properties.name || "Unnamed Place"}</h4>
                            <p>${place.properties.formatted || ""}</p>
                            <hr>
                        `;

                        placesContainer.appendChild(div);
                    });
                }

                document.getElementById("discover-button").
                addEventListener("click", () => {

                    // Save location for Discover page
                    localStorage.setItem("latitude", latitude);
                    localStorage.setItem("longitude", longitude);

                    localStorage.setItem("city", data.city);
                    localStorage.setItem("district", data.district);
                    localStorage.setItem("state", data.state);
                    localStorage.setItem("country", data.country);

                    window.location.href = "/discover.html";
                });

                console.log("Location data sent to server: ", data);
            } catch(error) {
                console.error("Error getting location: ", error);
            }
        }),
        (error) => {
            console.error(error);
        }
    })

});
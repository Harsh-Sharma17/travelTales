document.addEventListener("DOMContentLoaded", async () => {

    const token = localStorage.getItem("token");

    if (!token) {
        alert("You must be logged in to view this page.");
        window.location.href = "/login.html";
        return;
    }

    const latitude = localStorage.getItem("latitude");
    const longitude = localStorage.getItem("longitude");

    console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);

    const city = localStorage.getItem("city");
    const district = localStorage.getItem("district");
    const state = localStorage.getItem("state");
    const country = localStorage.getItem("country");

    document.getElementById("current-location").textContent = `📍 Current Location: ${city || "Unknown"}, ${state || "Unknown"}, ${country || "Unknown"}`;

    document.getElementById("dashboard-btn").addEventListener("click", () => {
        window.location.href = "/dashboard.html";
    });

    try {

        // Places to visit section update
        const placesResponse = await fetch(
            `https://api.geoapify.com/v2/places?categories=tourism.sights&filter=circle:${longitude},${latitude},20000&limit=25&apiKey=${process.env.GEO_API_KEY}`
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
    } catch (error) {
        console.error("Error fetching places: ", error);
        document.getElementById("places-content").textContent = "Error loading places.";
    }

});
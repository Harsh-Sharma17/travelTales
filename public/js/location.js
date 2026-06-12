document.addEventListener("DOMContentLoaded", async () => {

    const token = localStorage.getItem("token");

    if (!token) {
        alert("You must be logged in to view this page.");
        window.location.href = "/login.html";
        return;
    }

    const countryInfo = document.getElementById("country-info");
    const newsContainer = document.getElementById("news-container");
    const getInfoBtn = document.getElementById("get-info-btn");

    // Load News Function
    async function loadNews(countryName) {

        try {

            newsContainer.innerHTML = `
                <div class="news-loading">
                    <span class="loader"></span>
                    <span>Loading news...</span>
                </div>
            `;

            const newsResponse = await fetch(
                `/api/news?country=${encodeURIComponent(countryName)}`
            );

            const newsData = await newsResponse.json();

            console.log("News Data:", newsData);

            if (newsData.articles && newsData.articles.length > 0) {

                newsContainer.innerHTML = "";

                newsData.articles.slice(0, 10).forEach(article => {

                    const imageUrl =
                        article.image ||
                        "/images/no-image.jpg";

                    const imageHtml = article.image
                        ? `<img src="${article.image}" alt="News Image"
                            onerror="this.remove()">`
                        : "";

                    newsContainer.innerHTML += `
                        <div class="news-card">

                            <img
                                src="${imageUrl}"
                                alt="News Image"
                                loading="lazy"
                                onerror="this.src='/images/no-image.jpg'; this.onerror=null;"
                            >

                            <h2>${article.title || "No Title"}</h2>

                            <p>
                                <strong>Description:</strong>
                                ${article.description || "N/A"}
                            </p>

                            <p>
                                <strong>Published:</strong>
                                ${article.publishedAt || article.published_at || "N/A"}
                            </p>

                            <a href="${article.url}" target="_blank">
                                Read Full Article
                            </a>

                        </div>
                    `;

                    document.querySelectorAll(".news-image").forEach(img => {
                        img.addEventListener("error", () => {
                            img.style.display = "none";
                        });
                    });
                });

            } else {
                newsContainer.innerHTML = "<p>No news available.</p>";
            }

        } catch (error) {

            console.error("News Error:", error);

            newsContainer.innerHTML = `
                <p>Failed to load news. Please try again later.</p>
            `;
        }
    }

    // Default News on Page Load
    await loadNews("india");

    // Country Search
    getInfoBtn.addEventListener("click", async () => {

        const countryName =
            document.getElementById("country-input").value.trim();

        if (!countryName) {
            alert("Please enter a country name.");
            return;
        }

        try {

            countryInfo.classList.remove("hidden");

            countryInfo.innerHTML = `
                <div class="news-loading">
                    <span class="loader"></span>
                    <span>Loading country information...</span>
                </div>
            `;

            const response = await fetch(
                `/api/country?country=${encodeURIComponent(countryName)}`
            );

            const responseData = await response.json();

            console.log("Country API Response:", responseData);

            if (
                response.ok &&
                responseData.data &&
                responseData.data.objects &&
                responseData.data.objects.length > 0
            ) {

                const countries = responseData.data.objects;

                const countryData =
                    countries.find(
                        c =>
                            c.names?.common?.toLowerCase() ===
                            countryName.toLowerCase()
                    ) || countries[0];

                console.log("Selected Country:", countryData);

                const countryNameDisplay =
                    countryData.names?.common || "N/A";

                const capital =
                    countryData.capitals?.[0]?.name || "N/A";

                const population =
                    countryData.population
                        ? countryData.population.toLocaleString()
                        : "N/A";

                const region =
                    countryData.region || "N/A";

                const subregion =
                    countryData.subregion || "N/A";

                const countryCode =
                    countryData.codes?.alpha2 || "N/A";

                const timezone =
                    countryData.timezones?.join(", ") || "N/A";

                const areaKm =
                    countryData.area?.kilometers?.toLocaleString() || "N/A";

                const areaMiles =
                    countryData.area?.miles?.toLocaleString() || "N/A";

                const borders =
                    countryData.borders?.join(", ") || "None";

                const callingCodes =
                    countryData.calling_codes?.join(", ") || "N/A";

                const drivingSide =
                    countryData.cars?.driving_side || "N/A";

                const currencies =
                    countryData.currencies?.length
                        ? countryData.currencies
                            .map(c => c.name)
                            .join(", ")
                        : "N/A";

                const languages =
                    countryData.languages?.length
                        ? countryData.languages
                            .map(l => l.iso639_1 || l.bcp47)
                            .join(", ")
                        : "N/A";

                const googleMaps =
                    countryData.links?.google_maps || "#";

                const wikipedia =
                    countryData.links?.wikipedia || "#";

                const memberships = [];

                if (countryData.memberships) {

                    for (const [key, value] of Object.entries(countryData.memberships)) {

                        if (value === true) {
                            memberships.push(
                                key.replaceAll("_", " ")
                            );
                        }
                    }
                }

                const membershipText =
                    memberships.length > 0
                        ? memberships.join(", ")
                        : "N/A";

                countryInfo.innerHTML = `
                    <h2>${countryNameDisplay}</h2>

                    <p><strong>Capital:</strong> ${capital}</p>

                    <p><strong>Population:</strong> ${population}</p>

                    <p><strong>Region:</strong> ${region}</p>

                    <p><strong>Subregion:</strong> ${subregion}</p>

                    <p><strong>Country Code:</strong> ${countryCode}</p>

                    <p><strong>Calling Codes:</strong> ${callingCodes}</p>

                    <p><strong>Timezones:</strong> ${timezone}</p>

                    <p><strong>Area:</strong> ${areaKm} km² (${areaMiles} mi²)</p>

                    <p><strong>Borders:</strong> ${borders}</p>

                    <p><strong>Driving Side:</strong> ${drivingSide}</p>

                    <p><strong>Currencies:</strong> ${currencies}</p>

                    <p><strong>Languages:</strong> ${languages}</p>

                    <p><strong>Memberships:</strong> ${membershipText}</p>

                    <br>

                    <a href="${googleMaps}" target="_blank">
                        📍 View on Google Maps
                    </a>

                    <br><br>

                    <a href="${wikipedia}" target="_blank">
                        📖 Read on Wikipedia
                    </a>
                `;

            } else {

                countryInfo.innerHTML =
                    "Country not found. Please check the spelling and try again.";
            }

            await loadNews(countryName);

        } catch (error) {

            console.error("Country Error:", error);

            countryInfo.innerHTML =
                "Something went wrong while fetching country information.";
        }
    });
});
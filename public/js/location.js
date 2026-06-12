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

            if (response.ok && responseData.length > 0) {

                const countryData = responseData[0];

                const capital =
                    countryData.capital?.[0] || "N/A";

                const population =
                    countryData.population
                        ? countryData.population.toLocaleString()
                        : "N/A";

                const region =
                    countryData.region || "N/A";

                const subregion =
                    countryData.subregion || "N/A";

                const flag =
                    countryData.flags?.png || "";

                const mapLink =
                    countryData.maps?.googleMaps || "#";

                const carSide =
                    countryData.car?.side || "N/A";

                const countryCode =
                    countryData.cca2 || "N/A";

                const unMember =
                    countryData.unMember ? "Yes" : "No";

                const timezones =
                    countryData.timezones?.join(", ") || "N/A";

                const currencies =
                    countryData.currencies
                        ? Object.values(countryData.currencies)
                            .map(currency => currency.name)
                            .join(", ")
                        : "N/A";

                const languages =
                    countryData.languages
                        ? Object.values(countryData.languages).join(", ")
                        : "N/A";

                countryInfo.innerHTML = `
                    <h2>${countryData.name.common}</h2>

                    <p><strong>Capital:</strong> ${capital}</p>

                    <p><strong>Population:</strong> ${population}</p>

                    <p><strong>Region:</strong> ${region}</p>

                    <p><strong>Subregion:</strong> ${subregion}</p>

                    <p><strong>UN Member:</strong> ${unMember}</p>

                    <p><strong>Car Side:</strong> ${carSide}</p>

                    <p><strong>Country Code:</strong> ${countryCode}</p>

                    <p><strong>Timezones:</strong> ${timezones}</p>

                    <p><strong>Currencies:</strong> ${currencies}</p>

                    <p><strong>Languages:</strong> ${languages}</p>

                    ${flag
                        ? `<img src="${flag}" alt="Flag of ${countryName}" width="150">`
                        : ""
                    }

                    <br><br>

                    <a href="${mapLink}" target="_blank">
                        View on Google Maps
                    </a>
                `;

            } else {

                countryInfo.innerHTML =
                    "Country not found. Please check the spelling and try again.";
            }

            // Load news for searched country
            await loadNews(countryName);

        } catch (error) {

            console.error("Country Error:", error);

            countryInfo.innerHTML =
                "Something went wrong while fetching country information.";
        }
    });
});
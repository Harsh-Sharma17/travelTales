document.addEventListener("DOMContentLoaded", () => {

    const toggle = document.getElementById("toggle");
    const html = document.documentElement;

    if (!toggle) return;

    // Load saved theme
    const savedTheme = localStorage.getItem("theme") || "dark";

    html.setAttribute("data-theme", savedTheme);

    // Sync toggle position
    toggle.checked = savedTheme === "light";

    // Save theme when changed
    toggle.addEventListener("change", () => {

        const theme = toggle.checked ? "light" : "dark";

        html.setAttribute("data-theme", theme);

        localStorage.setItem("theme", theme);
    });
});
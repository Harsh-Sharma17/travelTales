document.addEventListener("DOMContentLoaded", async () => {

    const token = localStorage.getItem("token");

    if(!token){
        alert("You must be logged in to view this page.");
        window.location.href = "/login.html";
        return;
    }

    try{

        const response = await fetch("/api/users/profile", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const user = await response.json();

        document.getElementById("name").textContent = `Name : ${user.name}`;
        document.getElementById("email").textContent = `Username : ${user.username}`;
    } catch (error) {
        console.error("Error fetching profile:", error);
    }
});
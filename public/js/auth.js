console.log("Auth script loaded");
const loginForm = document.getElementById("loginForm");

if(loginForm){
    loginForm.addEventListener("submit", async(e) => {

        e.preventDefault();

        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        const response = await fetch("/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, password })
        });

        const data = await response.json();

        if(data.token){
            saveToken(data.token);
            window.location.href = "/dashboard.html";
        } else {
            alert("Login failed: " + data.message);
        }
    });
}

const registerForm = document.getElementById("registerForm");   

if(registerForm){
    console.log("Register form found, adding event listener");
    registerForm.addEventListener("submit", async(e) => {

        e.preventDefault();

        const name = document.getElementById("name").value;
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        try {
            const response = await fetch("/register", {
                method : "POST",
                headers : {
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({name, username, password})
            });

            const data = await response.json();

            if(response.ok){
                alert("Registration successful! Please login.");
                window.location.href = "/login.html";
            } else {
                alert("Registration failed: " + data.message);
            }
        }
        catch (error) {
            console.error("Error during registration: ", error);    
            alert("Something went wrong during registration.");
        }
    });
}

function saveToken(token){
    localStorage.setItem("token", token);
}
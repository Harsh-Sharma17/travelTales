document.addEventListener("DOMContentLoaded", async (e) => {

    e.preventDefault();

    const token = localStorage.getItem("token");

    if(!token){
        alert("Please login first.");
        window.location.href = "/login.html";
        return;
    }

    const postContainer = document.getElementById("post-data");

    try {

        const response = await fetch("/posts", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        const data = await response.json();

        if (!response.ok) {
            postContainer.innerHTML = `<li>${data.message}</li>`;
            return;
        }

        postContainer.innerHTML = "";

        if (data.length === 0) {
            postContainer.innerHTML = "<li>No posts available.</li>";
            return;
        }

        data.forEach(post => {

            const date = new Date(post.createdAt).toLocaleDateString();

            postContainer.innerHTML += `
                <li>

                    <h3>${post.title}</h3>

                    <img src="${post.image}" alt="Post Image" width="250">

                    <p>${post.description}</p>

                    <p><strong>Location:</strong> ${post.location}</p>

                    <p><strong>Published:</strong> ${date}</p>

                    <button class="edit-btn" data-id="${post._id}">
                        Edit
                    </button>

                    <button class="delete-btn" data-id="${post._id}">
                        Delete
                    </button>

                    <hr>

                </li>
            `;
        });

    } catch (error) {

        console.error(error);

        postContainer.innerHTML =
            "<li>Failed to load posts.</li>";
    }

});
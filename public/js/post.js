document.addEventListener("DOMContentLoaded", async (e) => {

    e.preventDefault();

    const token = localStorage.getItem("token");

    if(!token){
        alert("Please login first.");
        window.location.href = "/login.html";
        return; 
    }

    const postContainer = document.getElementById("post-data");

    try{

        const response = await fetch("/api/users/profile", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const user = await response.json();

        document.getElementById("user-name").textContent = `Hey, ${user.name}!`;
    } catch (error) {
        console.error("Error fetching Data", error);
    }

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
                <li class="post-item">

                    <div class="post-image-wrap">
                        <img src="${post.image}" alt="Post Image" class="post-image">
                    </div>

                    <div class="post-body">
                        <h3 class="post-title">${post.title}</h3>
                        <p class="post-description">${post.description}</p>
                        <div class="post-meta">
                            <span class="meta-tag">
                                <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                                <p><strong>Location:</strong> ${post.location}</p>
                            </span>
                            <span class="meta-tag">
                                <svg width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                                <p><strong>Published:</strong> ${date}</p>
                            </span>
                        </div>
                        <div class="post-actions">
                            <button class="btn btn--delete delete-btn" data-id="${post._id}">
                                <svg width="13" height="13" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/></svg>
                                Delete
                            </button>
                        </div>
                    </div>

                    <hr>

                </li>
            `;
        });

            // Handle delete button click
        postContainer.addEventListener("click", async (e) => {

            if (!e.target.classList.contains("delete-btn")) return;

            const postId = e.target.dataset.id;

            const confirmDelete = confirm("Are you sure you want to delete this post?");

            if (!confirmDelete) return;

            try {

                const response = await fetch(`/posts/${postId}`, {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                const data = await response.json();

                if (!response.ok) {
                    alert(data.message);
                    return;
                }

                alert("Post deleted successfully!");

                // Remove the deleted post from the page
                e.target.closest("li").remove();

            } catch (error) {

                console.error("Delete Error:", error);
                alert("Failed to delete post.");

            }

        });
    } catch (error) {

        console.error(error);

        postContainer.innerHTML =
            "<li>Failed to load posts.</li>";
    }

});
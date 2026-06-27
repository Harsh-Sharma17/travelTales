const form = document.getElementById("postForm");

// Character Counter
const textarea = document.getElementById("description");
const charCount = document.getElementById("char-count");

textarea.addEventListener("input", () => {
    charCount.textContent = textarea.value.length;
});

const imageInput = document.getElementById("image");
const previewImage = document.getElementById("previewImage");
const uploadContent = document.getElementById("uploadContent");

imageInput.addEventListener("change", () => {

    const file = imageInput.files[0];

    if (!file) return;

    // Check file type
    const allowedTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/webp"
    ];

    if (!allowedTypes.includes(file.type)) {
        alert("Please select a JPG, PNG or WEBP image.");
        imageInput.value = "";
        return;
    }

    // Max file size = 5MB
    if (file.size > 5 * 1024 * 1024) {
        alert("Image must be smaller than 5 MB.");
        imageInput.value = "";
        return;
    }

    const reader = new FileReader();

    reader.onload = function (e) {

        previewImage.src = e.target.result;
        previewImage.style.display = "block";
        uploadContent.style.display = "none";

    };

    reader.readAsDataURL(file);

});

form.addEventListener("submit", async (e) => {

    e.preventDefault();

    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please login first.");
        window.location.href = "/login.html";
        return;
    }

    const imageFile = imageInput.files[0];
    const title = document.getElementById("title").value.trim();
    const location = document.getElementById("location").value.trim();
    const description = textarea.value.trim();

    if (!title || !description) {
        alert("Title and Description are required.");
        return;
    }

    let image = "";

    if (imageFile) {

        image = await new Promise((resolve, reject) => {

            const reader = new FileReader();

            reader.onload = () => resolve(reader.result);

            reader.onerror = () => reject("Image upload failed.");

            reader.readAsDataURL(imageFile);

        });

    }

    try {

        const response = await fetch("/createpost", {

            method: "POST",

            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },

            body: JSON.stringify({
                image,
                title,
                location,
                description
            })

        });

        let data;

        try {

            data = await response.json();

        } catch {

            const text = await response.text();
            console.log(text);

            throw new Error("Server returned non-JSON response.");

        }

        if (response.ok) {

            alert("Post uploaded successfully!");

            form.reset();

            charCount.textContent = "0";

            previewImage.src = "";
            previewImage.style.display = "none";

            uploadContent.style.display = "flex";

            window.location.href = "/post.html";

        } else {

            alert(data.message || "Failed to upload post.");

        }

    } catch (error) {

        console.error("Upload Error:", error);

        alert("Something went wrong while uploading.");

    }

});

function clearForm() {

    form.reset();

    charCount.textContent = "0";

    previewImage.src = "";
    previewImage.style.display = "none";

    uploadContent.style.display = "flex";

}


const form = document.getElementById("postForm");

form.addEventListener("submit", async(e)=>{

    e.preventDefault();

    if (!form) {
        console.error("Form not found!");
        return;
    }

    const token = localStorage.getItem("token");

    if (!token) {
        alert("Please login first");
        window.location.href = "/login.html";
        return;
    }

    const imageFile = document.getElementById("image").files[0];
    const title = document.getElementById("title").value.trim();
    const location = document.getElementById("location").value.trim();
    const description = document.getElementById("description").value.trim();

    if (!title || !description) {
        alert("Title and description are required.");
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
            method : "POST",
            headers : {
                "Content-Type": "application/json",
                "Authorization":`Bearer ${token}`
            },
            body: JSON.stringify({
                image,
                title,
                location,
                description
            })
        });

        const data = await response.json();

        if(response.ok){
            
            alert("Post successfully uploaded");

            window.location.href = "/post.html";

        } else {
            alert("Error occur : " + data.message);
        }
    }
    catch (error) {
        console.error("Error during post upload: ", error);    
        alert("Something went wrong during uploading.");
    }

});
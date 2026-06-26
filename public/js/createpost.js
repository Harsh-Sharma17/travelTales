const form = document.querySelector("form");

form.addEventListener("submit",async(e)=>{

    e.preventDefault();

    const image = document.getElementById("image").files[0];
    const title = document.getElementById("title").value;
    const location = document.getElementById("location").value;
    const description = document.getElementById("description").value;

    try{

        const formData = new FormData();

        formData.append("image", imageFile);
        formData.append("title", title);
        formData.append("location", location);
        formData.append("description", description);

        const response = await fetch("/createpost", {
            method : "POST",
            headers : {
                // "Content-type" : "application/json",
                "Authorization":`Bearer ${token}`
            },
            body: formData
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
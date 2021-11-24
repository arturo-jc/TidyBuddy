const entries = document.querySelectorAll(".entry")

function toggleComments(element) {

}

for (let entry of entries) {
    const commentButton = entry.querySelector(".item-description button");
    const commentArea = entry.querySelector(".comment-area");
    commentButton.addEventListener("click", () => {
        commentArea.classList.toggle("hidden")
    })
}
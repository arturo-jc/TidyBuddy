// TOGGLE COMMENTS

const entries = document.querySelectorAll(".entry")

for (let entry of entries) {
    const commentButton = entry.querySelector(".item-description button");
    const commentArea = entry.querySelector(".comment-area");
    commentButton.addEventListener("click", () => {
        commentArea.classList.toggle("hidden")
    })
}

// TOGGLE HOUSEHOLD FORMS

const existingButton = document.querySelector("#existing")
const newButton = document.querySelector("#new")
const existingForm = document.querySelector("#search-household-form")
const newForm = document.querySelector("#new-household-form")

if (existingButton) {
    existingButton.addEventListener("click", () => {
        existingForm.classList.remove("hidden");
        existingForm.querySelector("input").focus();
        newForm.classList.add("hidden");
    })
}

if (newButton) {
    newButton.addEventListener("click", () => {
        existingForm.classList.add("hidden");
        newForm.classList.remove("hidden");
        newForm.querySelector("input").focus();
    })
}

// DISMISS ALERTS

const alerts = document.querySelectorAll(".alert")

for (let alert of alerts) {
    const closeButton = alert.querySelector("button")
    closeButton.addEventListener("click", () => {
        alert.style.display = "none";
    })
}
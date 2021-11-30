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

// SIDEBAR BEHAVIOR

const hamburgerMenu = document.querySelector(".ham-menu")
const sidebar = document.querySelector(".sidebar")
const navLinks = document.querySelector(".nav-links")
const main = document.querySelector("main")

if (sidebar) {
    hamburgerMenu.addEventListener("click", () => {
        sidebar.classList.toggle("active")
    })
    main.addEventListener("click", () => {
        sidebar.classList.remove("active")
    })
} else {
    hamburgerMenu.addEventListener("click", () => {
        console.log("clicked")
        navLinks.classList.toggle("active")
    })
    main.addEventListener("click", () => {
        navLinks.classList.remove("active")
    })
}



// INVITE BUTTON BEHAVIOR

const inviteButton = document.querySelector(".invite");
const inviteInstructions = document.querySelector(".invite-instructions")

if (inviteButton) {
    inviteButton.addEventListener("click", () => {
        inviteInstructions.classList.toggle("hidden")
    })
}
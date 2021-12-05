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
const dashboardMain = document.querySelector(".dashboard-main")

if (sidebar) {
    hamburgerMenu.addEventListener("click", () => {
        sidebar.classList.toggle("active")
    })
    dashboardMain.addEventListener("click", () => {
        sidebar.classList.remove("active")
    })
} else if (main) {
    hamburgerMenu.addEventListener("click", () => {
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

// CHOOSE FILE BUTTON FUNCTIONALITY

const setProfileButton = document.querySelector(".set-profile")
const chooseFileInput = document.querySelector(".set-profile-area input")
const filename = document.querySelector(".filename")
const uploadButton = document.querySelector(".upload")

if (setProfileButton) {
    setProfileButton.addEventListener("click", () =>{
        chooseFileInput.click()
    })
    chooseFileInput.addEventListener("change", ()=>{
        filename.textContent = chooseFileInput.files[0].name
        uploadButton.classList.remove("hidden")
    })
}

// DECLINED REQUESTS BEHAVIOR

const declinedRequestsBtn = document.querySelector(".declined-requests-button")
const declinedRequests = document.querySelector(".declined-requests")

if (declinedRequestsBtn){
    declinedRequestsBtn.addEventListener("click", ()=>{
        declinedRequests.classList.toggle("hidden")
    })
}

// SHOW ALL ACTIVITY TYPES BEHAVIOR

const showAllButton = document.querySelector(".show-all")
const unpinnedItems = document.querySelector(".unpinned-items-hide-show-area")

if (showAllButton){
    showAllButton.addEventListener("click", ()=>{
        unpinnedItems.classList.toggle("hidden");
        if (showAllButton.textContent === "Show all"){
            showAllButton.textContent = "Show fewer"
        } else{
            showAllButton.textContent = "Show all"
        }
    })
}
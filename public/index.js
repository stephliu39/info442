"use strict";

(function(){
  window.addEventListener("load", init);

  /**
   * This function runs when the window loads, we can use this to add
   * even listeners and create new functions under this function
   */
  function init() {
    console.log("hiiii");
    let loginPage = document.querySelector("#login");
    let signUpPage = document.querySelector("#sign-up");

    // When the user clicks to sign up, 
    document.getElementById("click-to-sign-up").addEventListener("click", () => {
      loginPage.classList.add("hidden");
      signUpPage.classList.remove("hidden");
    });

    // When the user clicks the back button, the login page shows again
    let backBtn = document.getElementById("back-btn");
    backBtn.addEventListener("click", () => {
      loginPage.classList.remove("hidden");
      signUpPage.classList.add("hidden");
    });
    document.getElementById('nav-profile').addEventListener('click', function() {
      showSection('profile-page');
    });
  document.getElementById('logout-button').addEventListener('click', function() {
    showSection('login');
    });
    document.getElementById('create-btn').addEventListener('click', function() {
      showSection('create-event');
    });

  }
  function showSection(sectionId) {
    document.querySelectorAll('main > section').forEach(section => {
      section.classList.add('hidden');
    });
    document.getElementById(sectionId).classList.remove('hidden');
  }
})();
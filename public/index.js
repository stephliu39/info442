"use strict";

(function(){

  window.addEventListener("load", init);

  // https://medium.com/@aishakhan0925/firebase-authentication-with-html-css-javascript-step-by-step-guide-edaa5b0bf04f
  const firebaseConfig = {
    apiKey: "AIzaSyDtAnRrqgpvEq3xRO2mhFu95XXZh3kLuLA",
    authDomain: "campus-db.firebaseapp.com",
    projectId: "campus-db",
    storageBucket: "campus-db.appspot.com",
    messagingSenderId: "169573562349",
    appId: "1:169573562349:web:9ea07e8e6604046a55d9e4"
  };
  
  firebase.initializeApp(firebaseConfig);

  let currentUser;

  /**
   * This function runs when the window loads, we can use this to add
   * even listeners and create new functions under this function
   */
  function init() {
    document.getElementById("login-button").addEventListener("click", loginUser);

    console.log("hiiii");
    let loginPage = document.querySelector("#login");
    let signUpPage = document.querySelector("#sign-up");
    document.querySelector(".error-msg").textContent = "";

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
    
    document.getElementById('submit').addEventListener('click', function() {
      showSection('profile-page');
    });
    
    document.getElementById('nav-notifications').addEventListener('click', function() {
      showSection('notifications');
    });
    
    document.getElementById('nav-home').addEventListener('click', function() {
      showSection('home');
    });
  }
  
  function showSection(sectionId) {
    document.querySelectorAll('main > section').forEach(section => {
      section.classList.add('hidden');
    });
    document.getElementById(sectionId).classList.remove('hidden');
  }

  function loginUser() {

    // I am not sure yet if this is the correct way to access the login-form
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (email && password) {
      firebase.auth().signInWithEmailAndPassword(email, password)
      .then((user) => {
          currentUser = user.user;
          console.log(currentUser);

          // switch to home page

      })
      .catch((error) => {
          showError(error);
      });
    } else {
      showError("error");
    }
  }

  function showError(error) {
    const errorMsg = document.querySelector(".error-msg");
    let err;
    
    if (error === "error") {
      err = "email and password fields are empty.";
    } else if (error.code === "auth/internal-error") {
      err = "Please double check your credentials and try again";
    } else if (error.code === "auth/too-many-requests") {
      err = "You have made too many attempts";
    } else if (error.code.contains("many failed login attempts")) {
      err = "Account temporarily disabled. Please try again later";
    } else {
      err = "Please try again" + error;
    }

    errorMsg.textContent = err;
    
    // Change the error back to empty after 10 seconds
    setTimeout(() => {
      errorMsg.textContent = "";
    }, 10000);
  }
})();
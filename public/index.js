"use strict";

let currentUser;
const loginPage = document.getElementById("login");
const signUpPage = document.getElementById("signup");
const home = document.getElementById("home");
const createEventPage = document.getElementById("create-event");
const profilePage = document.getElementById("profile-page");
const notifPage = document.getElementById("notifications");
const eventsPage = document.getElementById("events");
const eventRegistration = document.getElementById("eventRegistration");
const orgDetails = document.getElementById("organization-details");

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
  let db = firebase.firestore();

  function init() {

    // Adds event listeners / interactivity for the nav bar
    routeNavBar();

    // Adds functionaltiy to login and sign up pages
    loginListeners();

    document.querySelectorAll('.organization').forEach(org => {
      org.addEventListener('click', function() {
        const orgId = this.dataset.orgId;
        document.getElementById('profile-page').classList.add('hidden');
        document.getElementById('organization-details').classList.remove('hidden');
        loadOrganizationDetails(orgId);
      });
    });
    
    document.querySelectorAll('.organization').forEach(org => {
      org.addEventListener('click', function() {
        const orgId = this.dataset.orgId;
        document.getElementById('profile-page').classList.add('hidden');
        document.getElementById('organization-details').classList.remove('hidden');
        loadOrganizationDetails(orgId);
      });
    });

    document.getElementById('logout-button').addEventListener('click', function() {
      showSection('login');
      currentUser = null;
      document.getElementById("login-form").reset();
      document.getElementById("signup-form").reset();
    });
    
    document.getElementById('create-event-button').addEventListener('click', function() {
      showSection('create-event');
    });

    document.getElementById('add-event-button').addEventListener('click', function() {
      showSection('add-event'); //not have yet
    });
    
    document.getElementById('submit').addEventListener('click', function() {
      showSection('profile-page');
    });

    document.getElementById('save-profile').addEventListener('click', saveProfile);
  }

  function loginListeners() {
    document.querySelector("#login-error-msg").textContent = "";

    document.querySelector(".click-to-login").addEventListener("click", () => {
      showSection('login');
    });

    // When the user clicks to sign up
    document.querySelector("#click-to-signup").addEventListener("click", () => {
      loginPage.classList.add("hidden");
      signUpPage.classList.remove("hidden");
    });

    document.getElementById("login-button").addEventListener("click", loginUser);
    document.querySelector("#register").addEventListener("click", signupUser);
  }

  function routeNavBar() {
    document.getElementById('nav-home').addEventListener('click', function() {
      showSection('home');
    });
    
    document.getElementById('nav-logo').addEventListener('click', function() {
      showSection('home');
    });
    
    document.getElementById('nav-events').addEventListener('click', function() {
      showSection('events');
    });

    document.getElementById('nav-notifications').addEventListener('click', function() {
      showSection('notifications');
    });

    document.getElementById('nav-profile').addEventListener('click', function() {
      showSection('profile-page');
    });
    
    document.getElementById('save-profile').addEventListener('click', saveProfile);
    document.getElementById('create-event-btn').addEventListener('click', function() {
      showSection('profile-page');
    })
  }
  
  function showSection(sectionId) {
    document.querySelectorAll('main > section').forEach(section => {
      section.classList.add('hidden');
    });
    
    document.getElementById(sectionId).classList.remove('hidden');
  }

  function loginUser() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (email && password) {
      firebase.auth().signInWithEmailAndPassword(email, password)
      .then((user) => {
          currentUser = user.user;
          console.log(user.uid);

          document.getElementById("login").classList.add("hidden");
          showSection('home');
          document.querySelector("header").classList.remove("hidden");
      })
      .catch((error) => {
          showError("login-error-msg", error);
      });
    } else {
      showError("login-error-msg", "error");
    }
  }

  function signupUser() {
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    if (email && password) {
      firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((user) => {
          currentUser = user.user;
          console.log(user.uid);

          document.getElementById("signup").classList.add("hidden");
          document.getElementById("login").classList.add("hidden"); // Hide login page
          showSection('home');
          document.querySelector("header").classList.remove("hidden");
      })
      .catch((error) => {
        showError("signup-error-msg", error);
      });
    } else {
      showError("signup-error-msg", "error");
    }
  }

  function showError(errLocation, error) {
    const errorMsg = document.getElementById(errLocation);
    let err;
    
    if (error === "error") {
      err = "email and password fields are empty.";
    } else if (error.code === "auth/internal-error") {
      err = "Please double check your credentials and try again";
    } else if (error.code === "auth/too-many-requests") {
      err = "You have made too many attempts";
    } else {
      err = error + " Please try again.";
    }

    errorMsg.textContent = err;
    
    // Change the error back to empty after 10 seconds
    setTimeout(() => {
      errorMsg.textContent = "";
    }, 10000);
  }

  //profile info edit
  
})();

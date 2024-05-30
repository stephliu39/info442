
"use strict";


let currentUser;
const loginPage = document.getElementById("login");
const signUpPage = document.getElementById("signup");
const homePage = document.getElementById("home");
const createEventPage = document.getElementById("create-event");
const profilePage = document.getElementById("profile-page");
const notifPage = document.getElementById("notifications");
const eventsPage = document.getElementById("events");
const eventRegistrationPage = document.getElementById("eventRegistration");
const orgDetailsPage = document.getElementById("organization-details");

(function(){
  window.addEventListener("load", init);
  window.addEventListener("hashchange", route);

  const firebaseConfig = {
    apiKey: "AIzaSyDtAnRrqgpvEq3xRO2mhFu95XXZh3kLuLA",
    authDomain: "campus-db.firebaseapp.com",
    projectId: "campus-db",
    storageBucket: "campus-db.appspot.com",
    messagingSenderId: "169573562349",
    appId: "1:169573562349:web:9ea07e8e6604046a55d9e4"
  };
  
  firebase.initializeApp(firebaseConfig);

  function init() {
    routeNavBar();
    loginListeners();
    document.getElementById("login-button").addEventListener("click", loginUser);
    document.getElementById("register").addEventListener("click", signupUser);

    document.querySelectorAll('.organization').forEach(org => {
      org.addEventListener('click', function() {
        const orgId = this.dataset.orgId;
        const profilePage = document.getElementById('profile-page');
        const orgDetailsPage = document.getElementById('organization-details');
        if (profilePage && orgDetailsPage) {
          profilePage.classList.add('hidden');
          orgDetailsPage.classList.remove('hidden');
          loadOrganizationDetails(orgId);
        }
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
      showSection('events');
    });
    
    document.getElementById('submit').addEventListener('click', function() {
      showSection('profile-page');
    });

    document.getElementById('save-profile').addEventListener('click', saveProfile);

    document.getElementById('create-event-btn').addEventListener('click', function() {
      showSection('profile-page');
    });

    // Check if the user is already authenticated on page load
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        currentUser = user;
        showSection('home');
        document.querySelector("header").classList.remove("hidden");
      } else {
        showSection('login');
      }
      route(); // Route on initial load based on the current hash
    });
  }

  function routeNavBar() {
    const homeNav = document.getElementById('nav-home');
    const eventsNav = document.getElementById('nav-events');
    const notificationsNav = document.getElementById('nav-notifications');
    const profileNav = document.getElementById('nav-profile');

    if (homeNav) {
      homeNav.addEventListener('click', () => {
        window.location.hash = 'home';
      });
    } else {
      console.error('Navigation element "nav-home" not found');
    }

    if (eventsNav) {
      eventsNav.addEventListener('click', () => {
        window.location.hash = 'events';
      });
    } else {
      console.error('Navigation element "nav-events" not found');
    }

    if (notificationsNav) {
      notificationsNav.addEventListener('click', () => {
        window.location.hash = 'notifications';
      });
    } else {
      console.error('Navigation element "nav-notifications" not found');
    }

    if (profileNav) {
      profileNav.addEventListener('click', () => {
        window.location.hash = 'profile-page';
      });
    } else {
      console.error('Navigation element "nav-profile" not found');
    }
  }

  // Function to initialize the profile form with current values
  function initializeProfileForm() {
    document.getElementById('edit-username').value = document.getElementById('username').innerText;
    document.getElementById('edit-email').value = document.getElementById('email').innerText;
    document.getElementById('edit-location').value = document.getElementById('location').innerText;
    document.getElementById('edit-bio').value = document.getElementById('bio').innerText;
  }

  // Event listener to initialize the form when the modal is shown
  const editProfileModal = document.getElementById('editProfileModal');
  editProfileModal.addEventListener('show.bs.modal', initializeProfileForm);

  
  document.addEventListener('DOMContentLoaded', (event) => {
  // Function to save profile changes
  function saveProfileChanges() {
    const username = document.getElementById('edit-username').value;
    const email = document.getElementById('edit-email').value;
    const location = document.getElementById('edit-location').value;
    const bio = document.getElementById('edit-bio').value;

    // Update the profile display with new values
    document.getElementById('username').innerText = username;
    document.getElementById('email').innerText = email;
    document.getElementById('location').innerText = location;
    document.getElementById('bio').innerText = bio;

    // Hide the modal
    const modal = bootstrap.Modal.getInstance(editProfileModal);
    modal.hide();
  }

  // Event listener for the save changes button
  document.getElementById('saveProfileChanges').addEventListener('click', saveProfileChanges);
});

  function showSection(sectionId) {
    document.querySelectorAll('main > section').forEach(section => {
      section.classList.add('hidden');
    });
    const section = document.getElementById(sectionId);
    if (section) {
      section.classList.remove('hidden');
    } else {
      console.error(`Section with ID '${sectionId}' not found.`);
    }
  }

  function route() {
    const hash = window.location.hash.replace('#', '') || 'login';
    // Only show the section if the user is authenticated or if it's the login/signup page
    if (currentUser || hash === 'login' || hash === 'signup') {
      showSection(hash);
    } else {
      showSection('login');
    }
  }

  function loginListeners() {
    document.querySelector("#login-error-msg").textContent = "";

    document.querySelector(".click-to-login").addEventListener("click", () => {
      showSection('login');
    });

    document.querySelector("#click-to-signup").addEventListener("click", () => {
      showSection('signup');
    });

    document.querySelector(".click-to-login").addEventListener("click", () => {
      showSection('login');
    });
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
    setTimeout(() => {
      errorMsg.textContent = "";
    }, 10000);
  }
})();

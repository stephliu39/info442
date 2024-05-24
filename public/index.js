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
    let signUpPage = document.querySelector("#signup");
    document.querySelector("#login-error-msg").textContent = "";

    // When the user clicks to sign up
    document.querySelector("#click-to-signup").addEventListener("click", () => {
      loginPage.classList.add("hidden");
      signUpPage.classList.remove("hidden");
    });

    document.querySelector("#click-to-login").addEventListener("click", () => {
      loginPage.classList.remove("hidden");
      signUpPage.classList.add("hidden");
    });
    
    document.querySelector("#register").addEventListener("click", signupUser);

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
      showSection('homepage');
    });

    // document.getElementById('nav-logo').addEventListener('click', function() {
    //   showSection('homepage');
    // });

    document.getElementById('nav-events').addEventListener('click', function() {
      showSection('events');
    });
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

          showSection('homepage');
      })
      .catch((error) => {
          showError("login-error-msg", error);
      });
    } else {
      showError("login-error-msg, error");
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

          hide("#login");
          showSection('homepage');
      })
      .catch((error) => {
        showError("signup-error-msg", error);
      });
    } else {
      showError("signup-error-msg, error");
    }
  }

  function hide(elem) {
    document.querySelector(elem).classList.add("hidden");
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
})();
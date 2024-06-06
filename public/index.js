
"use strict";

let currentUser = null;
let allOrgs = [];
let allEvents = [];
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
  function route() {
  const hash = window.location.hash;
  if (hash.startsWith('#eventRegistration')) {
    const eventId = hash.split('/')[1];
    showSection('eventRegistration');
    loadEventDetails(eventId);
  } else if (hash === '#home') {
    showSection('home');
    displayUpcomingEvents();
  }
}

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
    fetchAllOrgs();
    fetchEvents();

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
      document.querySelector('nav').classList.add('hidden');
      document.querySelector('footer').classList.add('hidden');
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
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        currentUser = user;
        fetchUserProfile(user.uid).then(profile => {
          displayUserProfile(profile);
          fetchAllEvents().then(events => {
            renderEventCards(events);
            showSection('home');
            document.querySelector("nav").classList.remove("hidden");
            document.querySelector("footer").classList.remove("hidden");
          });
        }).catch(error => console.error("Error fetching user profile:", error));
      } else {
        currentUser = null;
        showSection('login');
      }
      route();
    });
    

    const registerButton = document.querySelector('.btn-success');
    if (registerButton) {
      registerButton.addEventListener('click', function() {
        registerForEvent(currentEventId);
      });
    }
  }


let currentEventId = null;



function fetchUserProfile(uid) {
  return fetch('/api/users')
    .then(response => response.json())
    .then(data => data.users.find(user => user.uid === uid))
    .catch(error => console.error('Error fetching user profile:', error));
}

function displayUserProfile(profile) {
  if (profile) {
    document.getElementById('profile-name').value = profile.name || '';
    document.getElementById('profile-email').value = profile.email || '';
  }
}


function registerForEvent(eventId) {
  let registeredEvents = JSON.parse(localStorage.getItem('registeredEvents')) || [];
  registeredEvents.push(eventId);
  localStorage.setItem('registeredEvents', JSON.stringify(registeredEvents));

  showConfirmationPopup('You have successfully registered for the event.');

}

function showConfirmationPopup(message) {
  const popup = document.createElement('div');
  popup.classList.add('popup');
  popup.textContent = message;

  document.body.appendChild(popup);

  setTimeout(() => {
    popup.remove();
  }, 3000);
}


document.addEventListener('DOMContentLoaded', function() {
  const registerButton = document.querySelector('.btn-success');
  if (registerButton) {
    registerButton.addEventListener('click', function() {
      registerForEvent(currentEventId);
    });
  }
  const backButton = document.getElementById('back-button');
  if (backButton) {
    backButton.addEventListener('click', function() {
      window.location.hash = 'home';
    });
  }
  const saveForLaterButton = document.getElementById('save-later');
  if (saveForLaterButton) {
    saveForLaterButton.addEventListener('click', function() {
      saveEventForLater(currentEventId);
    });
  }
});

  function routeNavBar() {
    
    const homeNav = document.getElementById('nav-home');
    const notificationsNav = document.getElementById('nav-notifications');
    const profileNav = document.getElementById('nav-profile');

    if (homeNav) {
      homeNav.addEventListener('click', () => {
        window.location.hash = 'home';
      });
    } else {
      console.error('Navigation element "nav-home" not found');
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

  function renderEventCards(events) {
    const container = document.getElementById('eventCardsContainer');
    container.innerHTML = ''; // Clear existing cards
  
    events.forEach(event => {
      const card = document.createElement('div');
      card.classList.add('event-card');
      card.innerHTML = `
        <img src="${event.eventImage}" alt="Event Image" class="img-fluid">
        <button class="bookmark-btn"><i class="bi bi-bookmark"></i></button>
        <div class="event-card-body">
          <span class="badge">New</span>
          <h5 class="event-card-title">${event.title}</h5>
          <div class="event-card-details">
            <p>${event.description}</p>
            <p>${event.date} ${event.startTime}-${event.endTime}<br>${event.venue}</p>
            <p class="followers">${event.followers}</p>
          </div>
        </div>
      `;
      card.addEventListener('click', function() {
        window.location.hash = `eventRegistration/${event.eventID}`;
      });
      container.appendChild(card);
    });
  }
  
  // Create and returns an event card like the one on the homepage
  function createEventCard(event) {
    let div1 = document.createElement('div');
    div1.classList.add('col-md-6', 'col-lg-4', 'mb-4');

    let div2 = document.createElement('div');
    div2.classList.add('event-card', 'h-100', 'position-relative');
    div2.setAttribute('data-event-id', event.eventID);


    let eventImg = document.createElement('img');
    eventImg.src = event.eventImage;
    eventImg.alt = 'an image of an event';
    eventImg.classList.add('img-fluid');
    div2.appendChild(eventImg);

    let bm = document.createElement('button');
    bm.classList.add('bookmark-btn');
    let iElem = document.createElement('i');
    iElem.classList.add('bi', 'bi-bookmark');
    bm.appendChild(iElem);
    div2.appendChild(bm);

    let div3 = document.createElement('div');
    div3.classList.add('event-card-body');

    let div4 = document.createElement('div');
    let badge = document.createElement('span');
    badge.textContent = "New";
    badge.classList.add('badge');
    div4.appendChild(badge);

    let title = document.createElement('h5');
    title.classList.add('event-card-title');
    title.textContent = event.title;
    div4.appendChild(title);

    let div5 = document.createElement('div');
    div5.classList.add('event-card-details');

    let desc = document.createElement('p');
    desc.textContent = event.description;
    div5.appendChild(desc);

    let dateTime = document.createElement('p');
    dateTime.innerHTML = event.date + ' ' + event.startTime + '-' + event.endTime + '<br>' + event.venue;
    div5.appendChild(dateTime);

    let currOrg;
    
    allOrgs.forEach((org) => {
      if (org.orgID === event.orgID) {
        currOrg = org;
      }
    });

    let followers = document.createElement('p');
    followers.classList.add('followers');
    followers.textContent = currOrg.name + ' • ' + currOrg.followers;
    div5.appendChild(followers);

    div4.appendChild(div5);
    div3.appendChild(div4);
    div2.appendChild(div3);
    div1.appendChild(div2);
    
    div2.addEventListener('click', function() {
      //window.location.hash = 'eventRegistration';
      // Load event details on the registration page if needed
      window.location.hash = `eventRegistration/${event.eventID}`;
    });

    return(div1);
  }

  
  function createOrgEventCard(event) {
    let orgEventCards = document.getElementById('orgEventCardsContainer');

    let div1 = document.createElement('div');
    div1.classList.add('col-md-6', 'col-lg-4', 'mb-4');

    let div2 = document.createElement('div');
    div2.classList.add('event-card', 'h-100', 'position-relative');

    let eventImg = document.createElement('img');
    eventImg.src = '../img/sample.jpeg';
    eventImg.alt = 'an image of an event';
    eventImg.classList.add('img-fluid');
    div2.appendChild(eventImg);

    let bm = document.createElement('button');
    bm.classList.add('bookmark-btn');
    let iElem = document.createElement('i');
    iElem.classList.add('bi', 'bi-bookmark');
    bm.appendChild(iElem);
    div2.appendChild(bm);

    let div3 = document.createElement('div');
    div3.classList.add('event-card-body');

    let div4 = document.createElement('div');
    let badge = document.createElement('span');
    badge.textContent = "New";
    badge.classList.add('badge');
    div4.appendChild(badge);

    let title = document.createElement('h5');
    title.classList.add('event-card-title');
    title.textContent = event.name;
    div4.appendChild(title);

    let div5 = document.createElement('div');
    div5.classList.add('event-card-details');

    let desc = document.createElement('p');
    desc.textContent = event.description;
    div5.appendChild(desc);

    let dateTime = document.createElement('p');
    dateTime.innerHTML = event.date + ' ' + event.time + '<br>' + event.location;
    div5.appendChild(dateTime);

    let currOrg;
    
    allOrgs.forEach((org) => {
      if (org.orgID === event.orgID) {
        currOrg = org;
      }
    });

    let followers = document.createElement('p');
    followers.classList.add('followers');
    followers.textContent = currOrg.name + ' • ' + currOrg.followers;
    div5.appendChild(followers);

    div4.appendChild(div5);
    div3.appendChild(div4);
    div2.appendChild(div3);
    div1.appendChild(div2);
    orgEventCards.appendChild(div1);
  }
  
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
    if (currentUser || hash === 'login' || hash === 'signup') {
      if (hash.startsWith('eventRegistration')) {
        const eventId = hash.split('/')[1];
        showSection('eventRegistration');
        loadEventDetails(eventId);
      } else {
        showSection(hash);
      }
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

  // Logs in the user
  function loginUser() {
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    if (email && password) {
      firebase.auth().signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
          const user = userCredential.user;
          currentUser = user;
          // fetches all user data then matches the user from firebase with
          // the one in the users.json and changes the website view based on user
          fetchUserProfile(user.uid).then(profile => {
            displayUserProfile(profile);
          });
          fetchUsers();
          fetchAllEvents();

          document.getElementById("login").classList.add("hidden");
          showSection('home');
          document.querySelector("nav").classList.remove("hidden");
          document.querySelector("footer").classList.remove("hidden");
      })
      .catch((error) => {
          showError("login-error-msg", error);
      });
    } else {
      showError("login-error-msg", "error");
    }
  }

  // Creates an account in firebase and adds the user to the users json file
  function signupUser() {
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    if (email && password) {
      firebase.auth().createUserWithEmailAndPassword(email, password)
      .then((user) => {
          currentUser = user.user;
          handleSignUp();
          fetchAllEvents();
          showSection('home');
          document.querySelector("nav").classList.remove("hidden");
          document.querySelector("footer").classList.remove("hidden");
      })
      .catch((error) => {
        showError("signup-error-msg", error);
      });
    } else {
      showError("signup-error-msg", "error");
    }
  }

  async function handleSignUp() {
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const uid = currentUser.uid;

    const data = {
      name: name,
      email: email,
      uid: uid
    };

    // add the user to the json file here
    try {
      const response = await fetch('/api/addUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if(!response.ok) {
        throw new Error('could not create user');
      }

      const res = await response.text();
      console.log(res);

    } catch (err) {
      console.log(err);
    }
  }


  /**
   * Fetches user data. We can use this data to get data of the currentUser
   */
  async function fetchUsers() {
    try {
      let usersJson = await fetch("api/users");
      statusCheck(usersJson);
      let result = await usersJson.json();

      // changes the website to user view
      checkUser(result.users);
    } catch (err) {
      console.log(err);
    }
  }

  // finds the logged in user in the json
  function checkUser(allUsers) {

    allUsers.forEach((user) => {
      if (user.uid === currentUser.uid) {
        changeView(user);
      }
    });
  }







  // change view based on user
  function changeView(user) {
    let isOrg = user.org;

    if (isOrg) {
      // hide nav bar
      // only show org details
      // allow create event page
    } else {
      document.querySelector('#name-greeting').textContent = "Hello, " + user.name;
      
      fetchUserEvents(user);
      fetchNotification(user);
      fetchUserOrganizations(user); // Fetch and display user organizations
    }
  }

  async function fetchUserEvents(user) {
    let registeredEventIds = user.registered;
    console.log(registeredEventIds);
    let matches = [];

    try {
      let eventsJson = await fetch("api/events");
      statusCheck(eventsJson);
      let result = await eventsJson.json();
      result.events.forEach((event) => {
        registeredEventIds.forEach((id) => {
          if (id === event.eventID) {
            matches.push(event);
          }
        })
      });
      displayRegisteredEvents(matches);  
    } catch (err) {
      console.log(err);
    }
  }

  // getting user's organizations
  async function fetchUserOrganizations(user) {
    let followingOrgIds = user.following;
    console.log(followingOrgIds);
    let matches = [];


    try {
      let orgsJson = await fetch("api/organizations");
      statusCheck(orgsJson);
      let result = await orgsJson.json();
      result.organizations.forEach((org) => {
        if (followingOrgIds.includes(org.orgID)) {
          matches.push(org);
        }
      });
      displayUserOrganizations(matches);
    } catch (err) {
      console.log(err);
    }
  }
  // showing user's organizations
  function displayUserOrganizations(orgs) {
    const container = document.getElementById('organization-cards-container');
    container.innerHTML = '';
  
    orgs.forEach(org => {
      const card = document.createElement('div');
      card.classList.add('organization-card', 'card', 'text-center');
      card.innerHTML = `
        <div class="card-body">
          <p class="card-text">${org.name}</p>
        </div>
      `;
      container.appendChild(card);
    });
  }

  async function fetchNotification(userProfile) {
    let notificationEventIds = userProfile.notif;
    console.log(notificationEventIds);
    let matches = [];
  
    try {
      let eventsJson = await fetch("/api/events"); // Ensure this endpoint returns the correct events data
      statusCheck(eventsJson);
      let result = await eventsJson.json();
      result.events.forEach((event) => {
        if (notificationEventIds.includes(event.eventID)) {
          matches.push(event);
        }
      });
      displayNotificationEvents(matches);  
    } catch (err) {
      console.log(err);
    }
  }

function displayNotificationEvents(events) {
  const notificationItems = document.getElementById('notificationItems');
  notificationItems.innerHTML = ''; // Clear existing notifications

  events.forEach(event => {
    const card = document.createElement('div');
    card.classList.add('card', 'mb-3');

    card.innerHTML = `
      <div class="row no-gutters">
        <div class="col-md-4">
          <img src="${event.eventImage}" class="card-img" alt="Event Image">
        </div>
        <div class="col-md-8">
          <div class="card-body">
            <h5 class="card-title">Thank you for registering for ${event.title}</h5>
            <p class="card-text">${event.description}</p>
            <p class="card-text">
              <small class="text-muted">${event.date} ${event.startTime}-${event.endTime}</small>
            </p>
          </div>
        </div>
      </div>
    `;

    notificationItems.appendChild(card);
  });
}

function displayEventDetails(events) {
  const eventItems = document.getElementById('eventDetails');
  eventItems.innerHTML = '';

  const div = document.createElement('div');
  div.classList.add("container", "my-5");

  events.forEach((event) => {
    div.innerHTML = `
    <button id="back-button" class="btn btn-secondary mb-3">Back</button>
    <h3>${event.title}</h3>
    <hr>
    <div class="row">
      <div class="col-md-8">
        <img src="${event.eventImage}" alt="Event Banner" class="img-fluid mb-4">
      </div>
      <div class="col-md-4">
        <div class="card mb-4">
          <div class="card-body">
            <h5 class="card-title">About this event</h5>
            <p class="card-text">${event.description}</p>
          </div>
        </div>
        <div class="card mb-4">
          <div class="card-body">
            <h5 class="card-title">Event Details</h5>
            <div class="d-flex align-items-center justify-content-between">
              <div>
                <h6 class="mb-0 card-text">Location</h6>
                <span class="badge bg-primary">${event.venue}</span>
                <br>
                <h6 class="mb-0 card-text">Date</h6>
                <span class="badge bg-primary">${event.date}</span>
                <br>
                <h6 class="mb-0 card-text">Time</h6>
                <span class="badge bg-primary">${event.startTime} - ${event.endTime}</span>
              </div>
            </div>
          </div>
        </div>
        <button class="btn btn-success btn-md">Register Now</button>
        <button id="save-later" class="btn btn-primary btn-md">Save for later</button>
      </div>
    </div>
  `;

  eventItems.appendChild(div)
  });

  document.getElementById('back-button').addEventListener('click', function() {
    window.history.back();
  });
}

// Add a hashchange event listener
window.addEventListener('hashchange', function() {
  const hash = window.location.hash;
  if (hash.startsWith('#eventRegistration/')) {
    const eventID = hash.split('/')[1];
    const event = events.find(event => event.eventID == eventID);
    if (event) {
      displayEventDetails(event);
    }
  }
});



function statusCheck(response) {
  if (!response.ok) {
    throw new Error('Network response was not ok ' + response.statusText);
  }
  return response;
}


  function displayRegisteredEvents(events) {
    console.log(events);

    // use create event card and add to this div
    displayEvents("#upcomingEvents", events);
  }

  async function fetchAllEvents() {
    try {
      let eventsJson = await fetch("api/events");
      statusCheck(eventsJson);
      let result = await eventsJson.json();

      // changes the website to user view
      displayEvents("#eventCardsContainer", result.events);
    } catch (err) {
      console.log(err);
    }
  }

  function displayEvents(location, events) {
    let homeCardsContainer = document.querySelector(location);
    homeCardsContainer.innerHTML = "";
    events.forEach((event) => {
      let newCard = createEventCard(event);
      homeCardsContainer.appendChild(newCard);
    });
  }

  async function fetchAllOrgs() {
    try {
      let orgsJson = await fetch("api/organizations");
      statusCheck(orgsJson);
      let result = await orgsJson.json();

      pushOrgs(result.organizations);
    } catch (err) {
      console.log(err);
    }
  }

  async function fetchEvents() {
    try {
      let eventsJson = await fetch("api/events");
      statusCheck(eventsJson);
      let result = await eventsJson.json();

      pushEvents(result.events);
    } catch (err) {
      console.log(err);
    }
  }

  function pushEvents(events) {
    events.forEach((event) => {
      allEvents.push(event);
    })
    console.log(allEvents);
  }

  // pushs all organizations into an array allOrgs
  function pushOrgs(orgs) {
    orgs.forEach((org) => {
      allOrgs.push(org);
    });
  }

  /**
   * Checks if the response is valid
   * @param {response} response - a response from a fetch call
   * @returns {response} another response
   */
  async function statusCheck(response) {
    if (!response.ok) {
      throw new Error(await response.text());
    }



    ////

    "use strict";
    
    let currentUser = null;
    let allOrgs = [];
    let allEvents = [];

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
        fetchAllOrgs();
        fetchEvents();
    
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
          document.querySelector('nav').classList.add('hidden');
          document.querySelector('footer').classList.add('hidden');
        });
        
        document.getElementById('create-event-button').addEventListener('click', function() {
          showSection('create-event');
        });
    
        document.getElementById('add-event-button').addEventListener('click', function() {
          showSection('events');
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
              document.querySelector("nav").classList.remove("hidden");
          } else {
              currentUser = null;
              showSection('login');
          }
          route();
      });
        loadEvents();
        const registerButton = document.querySelector('.btn-success');
        if (registerButton) {
          registerButton.addEventListener('click', function() {
            registerForEvent(currentEventId);
          });
        }
      }
    
    
    let currentEventId = null;
    let events = [];
    
    // Load events from the JSON file
    function loadEvents() {
      fetch('events.json')
        .then(response => response.json())
        .then(data => {
          renderEventCards(data.events);
        })
        .catch(error => console.error('Error loading events:', error));
    }
    
    // Fetch event details by ID from the loaded events
    function getEventDetailsById(eventId) {
      return events.find(event => event.eventID === eventId) || { eventID: eventId, title: 'Winfo HACKTHON' };
    }
    function showNotificationDetails(eventDetails) {
      document.getElementById('notification-title').textContent = eventDetails.title;
      document.getElementById('notification-image').src = eventDetails.eventImage;
      document.getElementById('notification-description').textContent = eventDetails.description;
      document.getElementById('notification-date').textContent = `Date: ${eventDetails.date}`;
      document.getElementById('notification-time').textContent = `Time: ${eventDetails.startTime} - ${eventDetails.endTime}`;
      document.getElementById('notification-location').textContent = `Location: ${eventDetails.venue}`;
  }
    
    function loadEventDetails(eventId) {
      fetch('/api/events')
        .then(response => response.json())
        .then(data => {
          const event = data.events.find(e => e.eventID == eventId);
          if (event) {
            document.getElementById('event-title').textContent = event.title;
            document.getElementById('event-image').src = event.eventImage;
            document.getElementById('event-description').textContent = event.description;
            document.getElementById('event-date').textContent = event.date;
            document.getElementById('event-time').textContent = event.startTime;
            document.getElementById('event-location').textContent = event.venue;
          } else {
            console.error(`Event with ID '${eventId}' not found.`);
          }
        })
        .catch(error => console.error('Error loading event details:', error));
    }
    
    
    
    function registerForEvent(eventId) {
      let registeredEvents = JSON.parse(localStorage.getItem('registeredEvents')) || [];
      if (!registeredEvents.includes(eventId)) {
          registeredEvents.push(eventId);
          localStorage.setItem('registeredEvents', JSON.stringify(registeredEvents));
  
          showConfirmationPopup('You have successfully registered for the event.');
          updateNotifications(eventId);
          saveUserRegistration(currentUser.uid, eventId);
      }
      fetch('/api/registerEvent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ uid: currentUser.uid, eventId: eventId })
      }).then(response => response.text())
        .then(result => {
          console.log(result);
          showConfirmationPopup('You have successfully registered for the event.');
          updateNotifications(eventId);
        })
        .catch(error => {
          console.error('Error:', error);
          showError("registration-error-msg", "Failed to register for the event.");
        });
  }
  
    
    function showConfirmationPopup(message) {
      const popup = document.createElement('div');
      popup.classList.add('popup');
      popup.textContent = message;
    
      document.body.appendChild(popup);
    
      setTimeout(() => {
        popup.remove();
      }, 3000);
    }
    
    function saveUserRegistration(uid, eventId) {
      // Fetch the user data and update the registered events array
      fetch('/api/users')
          .then(response => response.json())
          .then(data => {
              const user = data.users.find(user => user.uid === uid);
              if (user) {
                  user.registered.push(eventId);
                  // Update the user data in the server
                  fetch('/api/addUser', {
                      method: 'POST',
                      headers: {
                          'Content-Type': 'application/json'
                      },
                      body: JSON.stringify(user)
                  }).then(response => {
                      if (response.ok) {
                          console.log('User registration updated');
                      } else {
                          console.error('Failed to update user registration');
                      }
                  });
              }
          });
  }

  function loadUserNotifications() {
    const registeredEvents = JSON.parse(localStorage.getItem('registeredEvents')) || [];
    registeredEvents.forEach(eventId => {
        updateNotifications(eventId);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    loadUserNotifications();
});
//
    function updateNotifications(eventId) {
      const eventDetails = getEventDetailsById(eventId);
      const notificationsList = document.querySelector('.notification-list ul');
      const notificationItem = document.createElement('li');
      notificationItem.classList.add('list-group-item');
      notificationItem.innerHTML = `
      <div data-id="${eventId}" class="notification-item">
      <strong>${eventDetails.name}</strong>
      <p>${eventDetails.description}</p>
    </div>
      `;
    
      notificationsList.appendChild(notificationItem);
      // Add click event to show detailed notification content
      notificationItem.addEventListener('click', function() {
        showNotificationDetails(eventDetails);
      });
    }
    
    document.addEventListener('DOMContentLoaded', function() {
      loadEvents(); // Load events on page load
    
      const registerButton = document.querySelector('.btn-success');
      if (registerButton) {
        registerButton.addEventListener('click', function() {
          registerForEvent(currentEventId);
        });
      }
      const backButton = document.getElementById('back-button');
      if (backButton) {
        backButton.addEventListener('click', function() {
          window.location.hash = 'home';
        });
      }
      const saveForLaterButton = document.getElementById('save-later');
      if (saveForLaterButton) {
        saveForLaterButton.addEventListener('click', function() {
          saveEventForLater(currentEventId);
        });
      }
    });
    
      function routeNavBar() {
        const homeNav = document.getElementById('nav-home');
        const notificationsNav = document.getElementById('nav-notifications');
        const profileNav = document.getElementById('nav-profile');
    
        if (homeNav) {
          homeNav.addEventListener('click', () => {
            window.location.hash = 'home';
          });
        } else {
          console.error('Navigation element "nav-home" not found');
        }
    
        if (notificationsNav) {
          notificationsNav.addEventListener('click', () => {
            window.location.hash = 'notifications';
          });
        }
    
        if (profileNav) {
          profileNav.addEventListener('click', () => {
            window.location.hash = 'profile-page';
          });
        } else {
          console.error('Navigation element "nav-profile" not found');
        }
      }
    
    
      function createOrgEventCard(event) {
        let orgEventCards = document.getElementById('orgEventCardsContainer');
    
        let div1 = document.createElement('div');
        div1.classList.add('col-md-6', 'col-lg-4', 'mb-4');
    
        let div2 = document.createElement('div');
        div2.classList.add('event-card', 'h-100', 'position-relative');
    
        let eventImg = document.createElement('img');
        eventImg.src = '../img/sample.jpeg';
        eventImg.alt = 'an image of an event';
        eventImg.classList.add('img-fluid');
        div2.appendChild(eventImg);
    
        let bm = document.createElement('button');
        bm.classList.add('bookmark-btn');
        let iElem = document.createElement('i');
        iElem.classList.add('bi', 'bi-bookmark');
        bm.appendChild(iElem);
        div2.appendChild(bm);
    
        let div3 = document.createElement('div');
        div3.classList.add('event-card-body');
    
        let div4 = document.createElement('div');
        let badge = document.createElement('span');
        badge.textContent = "New";
        badge.classList.add('badge');
        div4.appendChild(badge);
    
        let title = document.createElement('h5');
        title.classList.add('event-card-title');
        title.textContent = event.name;
        div4.appendChild(title);
    
        let div5 = document.createElement('div');
        div5.classList.add('event-card-details');
    
        let desc = document.createElement('p');
        desc.textContent = event.description;
        div5.appendChild(desc);
    
        let dateTime = document.createElement('p');
        dateTime.innerHTML = event.date + ' ' + event.time + '<br>' + event.location;
        div5.appendChild(dateTime);
    
        let currOrg;
        
        allOrgs.forEach((org) => {
          if (org.orgID === event.orgID) {
            currOrg = org;
          }
        });
    
        let followers = document.createElement('p');
        followers.classList.add('followers');
        followers.textContent = currOrg.name + ' • ' + currOrg.followers;
        div5.appendChild(followers);
    
        div4.appendChild(div5);
        div3.appendChild(div4);
        div2.appendChild(div3);
        div1.appendChild(div2);
        orgEventCards.appendChild(div1);
      }
      
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
    
  
      document.querySelectorAll('.navbar-nav .nav-item').forEach(item => {
        item.addEventListener('click', function () {
          const sectionId = this.querySelector('a').id.replace('nav-', '');
          window.location.hash = sectionId;
        });
      });
    
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
    
      // Logs in the user
      function loginUser() {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
      
        if (email && password) {
          firebase.auth().signInWithEmailAndPassword(email, password)
          .then((userCredential) => {
              const user = userCredential.user;
              currentUser = user;
      
              // Fetch user profile and events after login
              fetchUserProfile(user.uid).then(profile => {
                displayUserProfile(profile);
                fetchAllEvents().then(events => {
                  renderEventCards(events);
                });
      
                showSection('home');
                document.querySelector("nav").classList.remove("hidden");
                document.querySelector("footer").classList.remove("hidden");
              }).catch(error => console.error("Error fetching user profile:", error));
          })
          .catch((error) => {
              showError("login-error-msg", error.message);
          });
        } else {
          showError("login-error-msg", "Please enter both email and password.");
        }
      }
      // Creates an account in firebase and adds the user to the users json file
      function signupUser() {
        const name = document.getElementById('signup-name').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
      
        if (name && email && password) {
          fetch('/api/signupUser', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name, email, password })
          }).then(response => response.text())
            .then(result => {
              console.log(result);
              firebase.auth().signInWithEmailAndPassword(email, password)
                .then((userCredential) => {
                  const user = userCredential.user;
                  currentUser = user;
                  fetchUserProfile(user.uid)
                    .then(userProfile => {
                      currentUserProfile = userProfile;
                      showSection('home');
                      document.querySelector("nav").classList.remove("hidden");
                      fetchNotification(currentUserProfile); // Fetch notifications for the new user
                    })
                    .catch(error => console.error("Error fetching user profile:", error));
                })
                .catch(error => showError("signup-error-msg", error.message));
            })
            .catch(error => {
              console.error('Error:', error);
              showError("signup-error-msg", "Failed to sign up.");
            });
        } else {
          showError("signup-error-msg", "All fields are required.");
        }
      }
      
    
    
      /**
       * Fetches user data. We can use this data to get data of the currentUser
       */
      async function fetchUsers() {
        try {
          let usersJson = await fetch("api/users");
          statusCheck(usersJson);
          let result = await usersJson.json();
    
          // changes the website to user view
          checkUser(result.users);
        } catch (err) {
          console.log(err);
        }
      }
    
      // finds the logged in user in the json
      function checkUser(allUsers) {
    
        allUsers.forEach((user) => {
          if (user.uid === currentUser.uid) {
            changeView(user);
          }
        });
      }
    
      // change view based on user
      function changeView(user) {
    
        let isOrg = user.org;
    
        if (isOrg) {
          // hide nav bar
          // only show org details
          // allow create event page
        } else {
          document.querySelector('#name-greeting').textContent = "Hello, " + user.name;
          
          // should not see the create events
          fetchUserEvents(user);
        }
      }


      //fetch user notifications
      async function fetchUserNotifs(user) {
        let notifications = user.notif;
        console.log(notifications);
        let matches = [];
    
        try {
          let usersJson = await fetch("api/users");
          statusCheck(usersJson);
          let result = await usersJson.json();
          result.events.forEach((user) => {
            notifications.forEach((id) => {
              if (id === user.notif) {
                matches.push(id);
              }
            })
          });
          displayNotifs(matches);  

        } catch (err) {
          console.log(err);
        }
      }

      //display user notifications - notif card needs to be created
      function displayNotifs(notifs) {
        let homeCardsContainer = document.querySelector("#notifications");
        homeCardsContainer.innerHTML = "";
        events.forEach((event) => {
          let newCard = createNotifCard(notifs);
          homeCardsContainer.appendChild(newCard);
        });
      }
    
      async function fetchUserEvents(user) {
        let registeredEventIds = user.registered;
        console.log(registeredEventIds);
        let matches = [];
    
        try {
          let eventsJson = await fetch("api/events");
          statusCheck(eventsJson);
          let result = await eventsJson.json();
          result.events.forEach((event) => {
            registeredEventIds.forEach((id) => {
              if (id === event.eventID) {
                matches.push(event);
              }
            })
          });
          displayRegisteredEvents(matches);  
        } catch (err) {
          console.log(err);
        }
      }
    
      function contains(list, target) {
        for (let i = 0; i < list.size; i++) {
          if (list[i] === target) {
            return true;
          }
        }
        return false;
      }
    
      function displayRegisteredEvents(events) {
        console.log(events);
    
        // use create event card and add to this div
        displayEvents("#upcomingEvents", events);
      }
    
      async function fetchAllEvents() {
  try {
    let response = await fetch("/api/events");
    let data = await response.json();
    return data.events;
  } catch (error) {
    console.error("Error fetching events:", error);
    return [];
  }
}

    
      function displayEvents(location, events) {
        let homeCardsContainer = document.querySelector(location);
        homeCardsContainer.innerHTML = "";
        events.forEach((event) => {
          let newCard = createEventCard(event);
          homeCardsContainer.appendChild(newCard);
        });
      }
    
      async function fetchAllOrgs() {
        try {
          let orgsJson = await fetch("api/organizations");
          statusCheck(orgsJson);
          let result = await orgsJson.json();
    
          pushOrgs(result.organizations);
        } catch (err) {
          console.log(err);
        }
      }
    
      async function fetchEvents() {
        try {
          let eventsJson = await fetch("api/events");
          statusCheck(eventsJson);
          let result = await eventsJson.json();
    
          pushEvents(result.events);
        } catch (err) {
          console.log(err);
        }
      }
    
      function pushEvents(events) {
        events.forEach((event) => {
          allEvents.push(event);
        })
        console.log(allEvents);
      }
    
      // pushs all organizations into an array allOrgs
      function pushOrgs(orgs) {
        orgs.forEach((org) => {
          allOrgs.push(org);
        });
      }
    
      /**
       * Checks if the response is valid
       * @param {response} response - a response from a fetch call
       * @returns {response} another response
       */
      async function statusCheck(response) {
        if (!response.ok) {
          throw new Error(await response.text());
        }
        return response;
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
    return response;
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
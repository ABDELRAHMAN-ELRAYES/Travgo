'strict mode';

//switch between profile options
let navLinks = document.querySelectorAll('.left-nav-link');
let profileSections = document.querySelectorAll('.profile-section');

navLinks.forEach((link) => {
  link.addEventListener('click', (event) => {
    const currentSection =
      event.target.closest('.left-nav-link').dataset.profileSection;
    profileSections.forEach((section) => {
      section.classList.add('hide-profile-section');
    });
    document
      .querySelector(`.${currentSection}`)
      .classList.remove('hide-profile-section');
  });
});

// adding the map to tour profile and then determine the tour stops locations on map
let mapty = document.getElementById('map');
if (mapty) {
  let locations = JSON.parse(mapty.dataset.locations);

  let firstLocation = locations[0].coordinates;
  var map = L.map('map').setView(firstLocation, 3);

  L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map);

  locations.forEach((loc) => {
    L.marker(loc.coordinates)
      .addTo(map)
      .bindPopup(loc.description, {
        autoClose: false,
        closeOnClick: false,
      })
      .openPopup();
  });
}

// get the checkout payment session and then redirect to payment page
//! (not completed yet)
const stripe = Stripe(
  'pk_test_51Q2DG0P0QZUsyR2oTk6mrYqUn8jgaiWVJgmqjV0O6AaH7YcCVbL79bozz192ne0aWvxfpaDHGPjOn2SxvewVlp4J004yvDmifT'
);
let payBtn = document.getElementById('pay-for-tour');
if (payBtn) {
  payBtn.addEventListener('click', async (event) => {
    payBtn.innerHTML = 'Booking...';
    try {
      const tourId = event.target.dataset.tourId;
      const session = await fetch(
        `/bookings/checkoutPaymentSession/${tourId}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        }
      ).then((res) => res.json());
      console.log(session);
      await stripe.redirectToCheckout({
        sessionId: session.session.id,
      });
    } catch (error) {
      alert(error);
    }
  });
}

let createReviewForm = document.querySelector('.create-review-form');
let viewTourReviewBtn = document.getElementById('view-review-form-btn');
let reviewForm = document.getElementById('review-form');
if (viewTourReviewBtn) {
  viewTourReviewBtn.addEventListener('click', (event) => {
    if (!event.target.classList.contains('viewed')) {
      event.target.classList.add('viewed');
      event.target.innerHTML = 'Cancel';
      reviewForm.classList.remove('hide-review-form');
    } else {
      event.target.classList.remove('viewed');
      event.target.innerHTML = 'Review';
      reviewForm.classList.add('hide-review-form');
    }
  });
}


// view the form that the user will modify his review and rating through
let modifyReviewBtns = document.querySelectorAll('.update-review');
if (modifyReviewBtns) {
  modifyReviewBtns.forEach((btn) => {
    btn.addEventListener('click', (event) => {
      const parent = event.target.closest('.review-card');
      const modifyReviewForm = parent.querySelector('.create-review-form');
      if (modifyReviewForm.classList.contains('hide-review-form')) {
        modifyReviewForm.classList.remove('hide-review-form');
        event.target.innerHTML = 'Cancel';
      } else {
        modifyReviewForm.classList.add('hide-review-form');
        event.target.innerHTML = 'Modify';
      }
    });
  });
}

// show alert if the user  add a tour to favourites the second time

let allFavouriteBtns = document.querySelectorAll('.favourite-tour');
if (allFavouriteBtns) {
  allFavouriteBtns.forEach((btn) => {
    btn.addEventListener('click', async (event) => {
      const tour = event.target.closest('.favourite-tour').dataset.tourId;
      try {
        await axios.get(`http://localhost:3000/tours/fav-tour/${tour}`);
        alert(
          'Tour is added to your Favourites,Go Profile favourites section to see all your Favourites...'
        );
      } catch (error) {
        if (error.response) {
          alert(error.response.data.message);
        } else if (error.data) {
          alert(error.data.message);
        } else {
          alert('ERROR OCCURED...!');
        }
      }
    });
  });
}
// show alert if the user try to review a tour for the second time

let reviewBtn = document.querySelector('.create-review-btn');
if (reviewBtn) {
  reviewBtn.addEventListener('click', async (event) => {
    const tour = event.target.dataset.tourId;
    const review = event.target
      .closest('.create-review-form')
      .querySelector('.tour-review-input');
    const rating = event.target
      .closest('.create-review-form')
      .querySelector('.tour-review-rating-input');
    event.target.innerHTML = 'reviewing...';
    try {
      await axios.post(`http://localhost:3000/tours/${tour}/reviews`, {
        review: review.value,
        rating: rating.value,
      });
      alert('You have reviewed Successfully...!');
      window.location.reload();
      review.value = '';
      rating.value = '';
      event.target.innerHTML = 'Review';
    } catch (error) {
      event.target.innerHTML = 'Review';
      if (error.response) {
        alert(error.response.data.message);
      } else if (error.data) {
        alert(error.data.message);
      } else {
        alert('ERROR OCCURED...!');
      }
    }
  });
}
// show alert with error while login

let loginBtn = document.querySelector('.login');
if (loginBtn) {
  loginBtn.addEventListener('click', async (event) => {
    const email = event.target.closest('.submit-form').querySelector('.email');
    const password = event.target
      .closest('.submit-form')
      .querySelector('.pass');

    event.target.innerHTML = 'login...';
    try {
      await axios.post(`http://localhost:3000/users/login`, {
        email: email.value,
        password: password.value,
      });
      window.location.href = '/';
    } catch (error) {
      event.target.innerHTML = 'Login';
      if (error.response) {
        alert(error.response.data.message);
      } else if (error.data) {
        alert(error.data.message);
      } else {
        alert('ERROR OCCURED...!');
      }
    }
  });
}

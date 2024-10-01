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
    payBtn.innerHTML ='Booking...'
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

createReviewForm.addEventListener('submit', (event) => {
  createReviewForm.querySelector('.create-review-btn').innerHTML =
    'reviewing...';
});

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
// make the favourite tour colored

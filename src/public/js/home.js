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
// make the review input empty after submit
let reviewInput = document.querySelector('.tour-review-input');
let reviewRating = document.querySelector('.tour-review-rating-input');
let reviewForm = document.querySelector('.create-review-form');

reviewForm.addEventListener('submit', (event) => {
  reviewInput.value = '';
  reviewRating.value = '';
});

// get the checkout payment session and then redirect to payment page
//! (not completed yet)
const stripe = Stripe(
  'pk_test_51Q2DG0P0QZUsyR2oTk6mrYqUn8jgaiWVJgmqjV0O6AaH7YcCVbL79bozz192ne0aWvxfpaDHGPjOn2SxvewVlp4J004yvDmifT'
);
let payBtn = document.getElementById('pay-for-tour');
  payBtn.addEventListener('click', async (event) => {
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
      await stripe.redirectToCheckout({
        sessionId: session.session.id,
      });
    } catch (error) {
      alert(error);
    }
  });


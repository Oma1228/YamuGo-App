
const form = document.getElementById("bookingForm");
const fareDisplay = document.getElementById("fare");
const message = document.getElementById("message");
const bookingList = document.getElementById("bookingList");

const rates = {
    "Tuk Tuk": 120,
    "Car": 200,
    "Bike": 80,
    "Van": 300
};

const baseFee = 150;

let bookings = JSON.parse(localStorage.getItem("yamuGoBookings")) || [];

function calculateFare(distance, vehicle) {
    return baseFee + distance * rates[vehicle];
}

function displayBookings() {
    bookingList.innerHTML = "";

    bookings.forEach((booking, index) => {
        const row = document.createElement("tr");

        [
            booking.customer,
            booking.pickup,
            booking.destination,
            booking.vehicle,
            "Rs. " + booking.fare.toFixed(2)
        ].forEach(value => {
            const cell = document.createElement("td");
            cell.textContent = value;
            row.appendChild(cell);
        });

        const actionCell = document.createElement("td");
        const cancelButton = document.createElement("button");

        cancelButton.textContent = "Cancel";
        cancelButton.className = "cancel-btn";
        cancelButton.type = "button";

        cancelButton.addEventListener("click", () => {
            bookings.splice(index, 1);
            saveBookings();
        });

        actionCell.appendChild(cancelButton);
        row.appendChild(actionCell);
        bookingList.appendChild(row);
    });
}

function saveBookings() {
    localStorage.setItem("yamuGoBookings", JSON.stringify(bookings));
    displayBookings();
}

form.addEventListener("submit", function(event) {
    event.preventDefault();

    const customer = document.getElementById("customer").value.trim();
    const pickup = document.getElementById("pickup").value.trim();
    const destination = document.getElementById("destination").value.trim();
    const distance = Number(document.getElementById("distance").value);
    const vehicle = document.getElementById("vehicle").value;

    if (!customer || !pickup || !destination || !vehicle ||
        !Number.isFinite(distance) || distance <= 0) {
        message.textContent = "Please enter valid booking details.";
        message.style.color = "red";
        return;
    }

    const fare = calculateFare(distance, vehicle);

    fareDisplay.textContent = "Estimated Fare: Rs. " + fare.toFixed(2);

    const booking = {
        customer,
        pickup,
        destination,
        vehicle,
        fare
    };

    bookings.push(booking);
    saveBookings();

    message.textContent = "Your ride has been booked successfully!";
    message.style.color = "green";

    form.reset();
});

displayBookings();

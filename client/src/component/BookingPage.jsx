// BookingPage.jsx
import React, { useContext } from "react";
import { SkillContext } from "../App"; // Import SkillContext

const BookingPage = () => {
  const { bookings } = useContext(SkillContext);

  return (
    <div>
      <h2>Your Bookings</h2>
      {bookings.length > 0 ? (
        bookings.map((booking) => (
          <div key={booking.id}>
            <img src={booking.photo} alt={booking.name} />
            <h3>{booking.name}</h3>
            <p>Skill: {booking.skill}</p>
            <p>Price: Rs. {booking.price}</p>
          </div>
        ))
      ) : (
        <p>No bookings yet.</p>
      )}
    </div>
  );
};

export default BookingPage;

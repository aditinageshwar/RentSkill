const  { SeekerBooking, ProviderBooking } = require('../models/Booking');

const saveBookingHistory = async (req, res) =>  
{
   const { seekerEmail, providerEmail, Skill, Price, date } = req.body; 
   const seekerBooking = new SeekerBooking ({
    seekerEmail,
    Skill,
    Price,
    date,
   });

   const providerBooking = new ProviderBooking({
    providerEmail,
    Skill,
    Price,
    date,
   });
   await seekerBooking.save();
   await providerBooking.save();
   return res.status(200).json({ message: 'Booking history saved successfully' });
};

module.exports = { saveBookingHistory };

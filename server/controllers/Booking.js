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

const handleBooking = async (req,res) => {
  try
  {
    const { email } = req.query;
    const browseData = await SeekerBooking.find({ seekerEmail: email });
    const postData = await ProviderBooking.find({ providerEmail: email });
    return res.status(200).json({ browseData, postData });
   } 
   catch (error) 
   {
     return res.status(500).json({ message: "Failed to fetch booking history" });
   }
}

module.exports = { saveBookingHistory , handleBooking};

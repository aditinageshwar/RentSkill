const mongoose = require('mongoose');

const seekerBookingSchema = new mongoose.Schema({
    seekerEmail: { type: String, required: true },
    Skill: { type: String, required: true },
    Price: { type: Number, required: true },
    date: { type: String, required: true },
},{timestamps: true });

const providerBookingSchema = new mongoose.Schema({
    providerEmail: { type: String, required: true },
    Skill: { type: String, required: true },
    Price: { type: Number, required: true },
    date: { type: String, required: true },
},{timestamps: true });

const SeekerBooking = mongoose.model('SeekerBookingHistory', seekerBookingSchema);
const ProviderBooking = mongoose.model('ProviderBookingHistory', providerBookingSchema);

module.exports = { SeekerBooking, ProviderBooking };


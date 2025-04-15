const mongoose = require('mongoose');

const portfolioSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  templateId: { type: String, required: true },
  name: { type: String, default: 'My Portfolio' },
  title: String,
  bio: String,
  email: String,
  phone: String,
  location: String,
  skills: [String],
  experience: [{
    company: String,
    position: String,
    duration: String,
    description: String
  }],
  education: [{
    institution: String,
    degree: String,
    year: String
  }],
  projects: [{
    title: String,
    description: String,
    imageUrl: String,
    link: String
  }],
  thumbnail: String
}, { timestamps: true });

module.exports = mongoose.model('Portfolio', portfolioSchema);
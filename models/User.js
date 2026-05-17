const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name:     { type: String, required: true }, // name of the employee
  email:    { type: String, required: true, unique: true, lowercase: true }, // email address
  password: { type: String, required: true }, // password
  role:     { type: String, enum: ['admin', 'staff'], default: 'staff' }, // boolean
  createdAt:{ type: Date, default: Date.now }
});

userSchema.methods.comparePassword = async function (entered) {
  return bcrypt.compare(entered, this.password);
};

module.exports = mongoose.model('User', userSchema);

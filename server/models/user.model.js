import { Schema, model } from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    avatar: {
      public_id: String,
      url: String,
    },
  },
  { timestamps: true }
);

// 🔐 Hash password before saving
userSchema.pre('save', async function () {
  // if password is not modified, skip hashing
  if (!this.isModified('password')) return;

  this.password = await bcrypt.hash(this.password, 10);
});

// 🔐 Compare  password during login
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = model('User', userSchema);

export default User;

import bcrypt from "bcryptjs";

const saltRounds = 10;

function hashPassword(plainPassword) {
  return bcrypt.hash(plainPassword, saltRounds);
}

function comparePassword(plainPassword, hashedPassword) {
  return bcrypt.compare(plainPassword, hashedPassword);
}

export { hashPassword, comparePassword };

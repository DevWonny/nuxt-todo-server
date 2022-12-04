const mongoose = require("mongoose");

// ID, Password, NickName
const UserSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, unique: true },
    hashedPassword: { type: String, required: true },
    nickName: { type: String, required: true },

    // session id => _id 활용
    // _id 는 default로 자동 생성!
    sessions: [{ createAt: { type: Date, required: true } }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("user", UserSchema);

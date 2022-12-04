const { Router } = require("express");
const userRouter = Router();
const User = require("../modules/user");
// password 암호화 작업
const { hash, compare } = require("bcryptjs");

// register
userRouter.post("/register", async (req, res) => {
  try {
    if (req.body.password.length < 6) {
      throw new Error("비밀번호를 6자 이상 입력해주세요!");
    }
    if (req.body.userid.length < 3) {
      throw new Error("아이디를 3자 이상 입력해주세요!");
    }
    // password 암호화
    const hashedPassword = await hash(req.body.password, 10);
    const user = await new User({
      userId: req.body.userId,
      hashedPassword,
      nickName: req.body.nickName,
      sessions: [{ createAt: new Date() }],
    }).save();

    const session = user.sessions[0];

    res.json({
      message: "User Register!",
      sessionId: session._id,
      nickName: user.nickName,
    });
  } catch (err) {
    console.log("registerErr");
    res.status(400).json({ message: err.messge });
  }
});

// login
userRouter.post("/login", async (req, res) => {
  const user = await User.findOne({ userId: req.body.userId });

  try {
    const isPassword = await compare(req.body.password, user.hashedPassword);

    // password Check
    if (!isPassword) {
      throw new Error("비밀번호를 확인해주세요!");
    }

    // session 추가
    user.sessions.push({ createAt: new Date() });
    // 가장 최신 session
    const session = user.sessions[user.sessions.length - 1];

    user.save();
    res.json({
      message: "User Login!",
      sessionId: session._id,
      nickNanme: user.nickName,
    });
  } catch (err) {
    console.log("Login Error");
    if (!user) {
      res
        .status(400)
        .json({ message: "회원정보가 없습니다. 회원가입을 해주세요!" });
    }
    res.status(400).json({ message: err.message });
  }
});

// logout
userRouter.post("/logout", async (req, res) => {
  try {
    if (!req.user) {
      throw new Error("로그인되지 않은 유저입니다.");
    }

    await User.updateOne(
      { _id: req.user.id },
      { $pull: { sessions: { _id: req.headers.sessionid } } }
    );

    res.json({
      message: "User Logout!",
    });
  } catch (err) {
    res.status(400).json({ message: err.messge });
  }
});

// delete
userRouter.post("/delete", async (req, res) => {
  try {
    await User.findOneAndDelete({
      sessions: { $elemMatch: { _id: req.body.sessionid } },
    });

    res.json({ message: "User Delete!" });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = { userRouter };

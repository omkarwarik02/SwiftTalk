require("dotenv").config();
const Message = require("../models/message");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const SECRET = process.env.SECRET_KEY;

module.exports = (io) => {

 function formatUser(user) {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    createdAt: user.createdAt
      ? user.createdAt.toISOString()
      : null, // 🔥 REQUIRED
  };
}



  function formatMessage(msg) {
    return {
      id: msg._id.toString(),
      sender: msg.sender.toString(),
      receiver: msg.receiver.toString(),
      text: msg.text,
      timestamp: msg.createdAt.toISOString(),
    };
  }

  return {

  
    //         QUERIES
  

    Query: {
      me: async (_, __, { req }) => {
        const token = req.cookies?.token;
        if (!token) return null;

        try {
          const decoded = jwt.verify(token, SECRET);
          const user = await User.findById(decoded.userId);
          return user ? formatUser(user) : null;
        } catch {
          return null;
        }
      },

      // ALL USERS FOR CHAT LIST
    users: async () => {
  try {
    const users = await User.find().select("-password");
    return users.map(formatUser);
  } catch (err) {
    console.error("USERS RESOLVER ERROR:", err);
    return [];
  }
    },




      // Chat history between logged user and another user
      messagesWith: async (_, { userId }, { req }) => {
        const token = req.cookies?.token;
        if (!token) throw new Error("Not authenticated");

        const decoded = jwt.verify(token, SECRET);
        const currentUserId = decoded.userId;

        const messages = await Message.find({
          $or: [
            { sender: currentUserId, receiver: userId },
            { sender: userId, receiver: currentUserId },
          ],
        }).sort({ createdAt: 1 });

        return messages.map(formatMessage);
      },
    },

    
    //        MUTATIONS
    

    Mutation: {
      // SEND MESSAGE PRIVATELY
      sendMessage: async (_, { receiver, text }, { req }) => {
        const token = req.cookies?.token;
        if (!token) throw new Error("Not authenticated");

        const decoded = jwt.verify(token, SECRET);
        const sender = decoded.userId;

        const message = await Message.create({
          sender,
          receiver,
          text,
        });

        const formatted = formatMessage(message);

        // Send to receiver
        io.to(receiver).emit("message:new", formatted);
        // Send to sender (for updating own UI)
        io.to(sender).emit("message:new", formatted);

        return formatted;
      },

      registerUser: async (_, { name, email, password }, { res }) => {
        const existing = await User.findOne({ email });
        if (existing) throw new Error("Email already used");

        const hashed = await bcrypt.hash(password, 10);

        const user = await User.create({
          name,
          email,
          password: hashed,
        });

        const token = jwt.sign({ userId: user._id }, SECRET, { expiresIn: "7d" });

        res.cookie("token", token, {
          httpOnly: true,
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return {
          token,
          user: formatUser(user),
          message: "User Registered Successfully",
        };
      },

      login: async (_, { email, password }, { res }) => {
        const user = await User.findOne({ email });
        if (!user) throw new Error("Invalid credentials");

        const match = await bcrypt.compare(password, user.password);
        if (!match) throw new Error("Invalid credentials");

        const token = jwt.sign({ userId: user._id }, SECRET, { expiresIn: "7d" });

        res.cookie("token", token, {
          httpOnly: true,
          sameSite: "lax",
          maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return {
          token,
          user: formatUser(user),
          message: "Login successful",
        };
      },
    },
  };
};

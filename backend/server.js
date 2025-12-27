const cookieParser = require("cookie-parser");
const express = require("express");
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

// Import DB & GraphQL setup
const connectDB = require("./config/DB")
const setupGraphql = require("./graphql/index");

// Create Express app
const app = express();
app.use(cors({
  origin:[
        "http://localhost:4200",
    "https://studio.apollographql.com"
  ],
  credentials:true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Create HTTP server (needed for Socket.IO)
const server = http.createServer(app);

// Socket.IO setup
const io = new Server(server, {
  cors: {
    origin: "http://localhost:4200",
    methods: ["GET", "POST"],
    credentials:true
  },
});

// START APPLICATION (DB+GRAPHQL+ERVER)
async function startServer() {
  try {
    // Connect to MongoDB
    await connectDB();

    // Attach GraphQL to Express
    await setupGraphql(app, io);

    // Setup Socket.IO Events
io.on("connection", (socket) => {
  console.log("🔌 Socket connected");
  console.log("🔑 Socket auth:", socket.handshake.auth);

  const userId = socket.handshake.auth?.userId;

  if (!userId) {
    console.log("❌ No userId received in socket auth");
    return;
  }

  socket.join(userId);
  console.log("✅ User joined socket room:", userId);

  socket.on("disconnect", () => {
    console.log("❌ Socket disconnected:", userId);
  });
});




    // 4️ Start server ONLY AFTER everything is ready
    server.listen(3000, () => {
      console.log(" Server running on http://localhost:3000");
      console.log(" GraphQL running at http://localhost:3000/graphql");
    });

  } catch (error) {
    console.error(" Startup failed:", error.message);
    process.exit(1);
  }
}

// Initialize Server
startServer();

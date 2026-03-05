require("./db");

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const userRoutes = require("./routes/users");
const roomRoutes = require("./routes/rooms");
const bookingRoutes = require("./routes/bookings");
app.use("/users", userRoutes);
app.use("/rooms", roomRoutes);
app.use("/bookings", bookingRoutes);

app.listen(3000, () => {
    console.log("Server running on port 3000");
});
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// MongoDB connect
mongoose.connect("mongodb://127.0.0.1:27017/eventDB")
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => {
  console.error("❌ MongoDB connection error:");
  console.error(err);
});

// Schema
const eventSchema = new mongoose.Schema({
  name: String,
  email: String,
  event: String
});

const Participant = mongoose.model("Participant", eventSchema);

// Add participant
app.post("/register", async (req, res) => {
  try {
    const user = new Participant(req.body);
    await user.save();
    res.send("Registered Successfully");
  } catch (err) {
    res.status(500).send("Error");
  }
});

// Get all participants
app.get("/participants", async (req, res) => {
  const data = await Participant.find();
  res.json(data);
});

app.delete("/delete/:id", async (req, res) => {
  try {
    const id = req.params.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ error: "Invalid ID" });
    }

    await Participant.findByIdAndDelete(id);
    res.json({ message: "Deleted Successfully" });

  } catch (err) {
    console.error("DELETE ERROR:", err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(3000, () => console.log("Server running on 3000"));
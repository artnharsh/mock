const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongo_uri")
.then(() => console.log("mongodb connected"))
.catch(err => console.log(err));

const eventSchema = new mongoose.Schema({
    name: String,
    email: String,
    event: String,
});

const Participant = mongoose.model("Participant", eventSchema);

app.post("/resgister", async (req, res) => {
    try{
        const user = new Participant(req.body);
        await user.save();
        console.log("User registered:", user);
        res.send("Registered Successfully");
    } catch (err) {
        res.status(500).send("Error registering user");
    }
});

app.get("/participants", async(req, res) => {
    try{
        const data = await Participant.find();
        res.json(data);
    } catch (err) {
        res.status(500).send("Error fetching participants");
    }
});

app.listen(3000, () => console.log("Server running on 3000"));
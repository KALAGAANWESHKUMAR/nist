const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const app = express();

// Middleware setup
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// MongoDB connection
mongoose.connect('mongodb://127.0.0.1:27017/eventDB', { useNewUrlParser: true, useUnifiedTopology: true });

// Schemas
const eventSchema = new mongoose.Schema({ name: String, description: String });
const registrationSchema = new mongoose.Schema({
    name: String,
    email: String,
    date: String,
    image: String,
    message: String,
    eventId: mongoose.Schema.Types.ObjectId,
});

const Event = mongoose.model('Event', eventSchema);
const Registration = mongoose.model('Registration', registrationSchema);

// File upload setup
const upload = multer({ dest: 'public/uploads/' });

// Routes
app.get('/login', (req, res) => res.render('login'));

app.get('/home', async (req, res) => {
    const events = await Event.find();
    res.render('home', { events });
});

app.get('/register/:id', (req, res) => res.render('register', { eventId: req.params.id }));

app.post('/submit-registration', upload.single('image'), async (req, res) => {
    const { name, email, date, message, eventId } = req.body;
    const newReg = new Registration({ name, email, date, message, eventId, image: req.file?.path });
    await newReg.save();
    res.redirect('/home');
});

app.get('/view/:id', async (req, res) => {
    const registrations = await Registration.find({ eventId: req.params.id });
    res.render('viewRegistrations', { registrations });
});

// Seed route (for creating some sample events)

app.get('/seed', async (req, res) => {

    await Event.create([
    
    { name: "Sports Day", description: "A day filled with sports and activities.", date: "2024-12-15"},
    
    { name: "Tech Talk", description: "A seminar on the latest technology trends.", date: "2024-12-20" }
    
    ]);
    
    res.send("Events seeded!");
    
    });

// Start server
app.listen(3000, () => console.log('Server started on http://localhost:3000'));

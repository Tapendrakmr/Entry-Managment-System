const path = require("path");
const express = require("express");
const hbs = require("hbs");
require("dotenv").config();
const bodyParser = require("body-parser");

const app = express();

const publicDirectoryPath = path.join(__dirname, "../public");
const viewPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

//Mail
const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

app.use(express.static(publicDirectoryPath));

app.set("view engine", "hbs");
app.set("views", viewPath);
hbs.registerPartials(partialsPath);

app.use(bodyParser.urlencoded({ extended: true }));

// variable store
var hostinfo = {
  name: "host",
  email: "tapendrasingh66@gmail.com",
  phone: "123456789"
};
var guestinfo = {
  name: "guest",
  email: "guest@gmail.com",
  phone: "123456789",
  checkIn: "",
  checOut: ""
};
// HOST
// get host
app.get("/host", (req, res) => {
  res.render("host");
});

// post host
app.post("/host", async (req, res) => {
  hostinfo.name = req.body.username;
  hostinfo.email = req.body.email;
  hostinfo.phone = req.body.phone;

  res.render("home", {
    name: hostinfo.name,
    email: hostinfo.email,
    phone: hostinfo.phone
  });
});

// GUEST
// get guest
app.get("/guest", (req, res) => {
  res.render("guest");
});

// post guest
app.post("/guest", async (req, res) => {
  guestinfo.name = req.body.username;
  guestinfo.email = req.body.email;
  guestinfo.phone = req.body.phone;

  guestinfo.checkIn = new Date();
  const msg = {
    to: hostinfo.email,
    from: "t@gmail.com",
    subject: "Guest Entry details",
    text: "from guest",

    html: `<strong>name:${guestinfo.name}<br>email:${guestinfo.email}<br>phone:${guestinfo.phone}<br>checkIn:${guestinfo.checkIn}<br></strong>`
  };
  sgMail.send(msg);

  res.render("home", {
    name: guestinfo.name,
    email: guestinfo.email,
    phone: guestinfo.phone
  });
});

app.get("/checkout", (req, res) => {
  guestinfo.checOut = new Date();
  const msg = {
    to: guestinfo.email,
    from: "tapendraxtra72@gmail.com",
    subject: "Guest Entry details",
    text: "from guest",

    html: `<strong>name:${guestinfo.name}<br>email:${guestinfo.email}<br>phone:${guestinfo.phone}<br>checkIn:${guestinfo.checkIn}<br><br>checkOut:${guestinfo.checOut}<br></strong>`
  };
  sgMail.send(msg);
  res.render("guest");
});
app.listen(3000, () => {
  console.log("server run");
});

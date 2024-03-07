// import { Mongoose } from "mongoose";
// import express from "express";
// import { json } from "body-parser";
// import session from "express-session";
// import { initialize, session as _session, authenticate } from "./passport.js";
// import { Strategy as GoogleStrategy } from "passport-google-oauth20";
// import { express } from 'express';
// const app = express();

// // Configure middleware
// app.use(json());
// app.use(
//   session({
//     secret: sessionSecret,
//     resave: false,
//     saveUninitialized: false,
//   })
// );
// app.use(initialize());
// app.use(_session());
// // app.use(
// //   cookieSession({
// //     name: "session",
// //     key: ["bookdip"],
// //     maxAge: 24 * 60 * 60 * 100,
// //   })
// // );
// // app.use(passport.initialize());
// // app.use(passport.session());
// // app.use(bodyParser.json());

// // app.use(
// //   cors({
// //     origin: "http://localhost:3000",
// //     methods: "GET,POST,PATCH,PUT,DELETE",
// //     credentials: true,
// //   })
// // );

// const url =
//   "mongodb+srv://21pw07:tDdXhz1fnlhnGT5X@cluster0.vxlgwgq.mongodb.net/bookdip?retryWrites=true&w=majority";
// connect(url)
//   .then(() => {
//     console.log("Mongo DB connected successfully.");
//   })
//   .catch((err) => {
//     console.log("Error in DB connection ", err);
//   });

// var connection = _connection;
// connection.once("open", () => {
//   console.log("Connected...");
// });

// // GET ALL USERS
// app.get("/getUser", async (req, res) => {
//   const userList = await userModel.find();
//   try {
//     res.send(userList);
//   } catch (err) {
//     res.send(err);
//     console.log("Error in fetching users.");
//   }
// });

// //CREATE NEW USER
// app.post("/postUser", async (req, res) => {
//   const userId = req.body.userId;
//   console.log(userId);
//   const name = req.body.name;
//   console.log(name);
//   const gender = req.body.gender;
//   const city = req.body.city;
//   const accNo = req.body.accNo;
//   const newUser = {
//     userId: userId,
//     name: name,
//     gender: gender,
//     city: city,
//     accNo: accNo,
//   };
//   await userModel.create(newUser);
//   console.log(`User ${name} added successfully.`);
//   res.send(`User ${name} added successfully.`);
// });

// //GET ALL BOOKS
// app.get("/getBook", async (req, res) => {
//   const BookList = await bookModel.find();
//   try {
//     res.send(bookList);
//   } catch (err) {
//     res.send(err);
//     console.log("Error in fetching books.");
//   }
// });

// //CREATE NEW BOOK
// app.post("/postBook", async (req, res) => {
//   const bookId = req.body.bookId;
//   const bookName = req.body.bookName;
//   console.log(bookName);
//   const authorName = req.body.authorName;
//   const genre = req.body.genre;
//   const price = req.body.price;
//   const newBook = {
//     bookId: bookId,
//     bookName: bookName,
//     authorName: authorName,
//     genre: genre,
//     price: price,
//   };
//   await bookModel.create(newBook);
//   console.log(`Book ${bookName} added successfully.`);
//   res.send(`Book ${bookName} added successfully.`);
// });

// // Define the route for initiating Google OAuth authentication
// app.get(
//   "/auth/google",
//   authenticate("google", { scope: ["profile", "email"] })
// );

// // Define the route for Google OAuth callback
// app.get(
//   "/auth/google/callback",
//   authenticate("google", { failureRedirect: "/login" }),
//   (req, res) => {
//     // Successful authentication, redirect to home page or dashboard
//     res.redirect("/getUser");
//   }
// );

// app.listen(3000, () => {
//   console.log("App is running successfully on port 3000.");
// });

import { Mongoose } from "mongoose";
import express from "express";
import { json } from "body-parser";
import session from "express-session";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import passport from "passport";
import { randomBytes } from "crypto";
import config from "./config.js";
import { initialize, session as _session, authenticate } from "./passport.js";
const sessionSecret = randomBytes(32).toString("hex");
const app = express();
// Initialize express session middleware
app.use(
  session({
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
  })
);

// Initialize Passport and session
app.use(passport.initialize());
app.use(passport.session());

// Configure Google OAuth 2.0 strategy
passport.use(
  new GoogleStrategy(
    {
      clientID:
        "204364760574-8r9vm9fsgmkgl1fgh8alabf65jvb6h92.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    (accessToken, refreshToken, profile, done) => {
      // This callback function will be called when authentication succeeds
      // You can customize this function to create or update a user in your database
      return done(null, profile);
    }
  )
);

// Serialize user to store in session
passport.serializeUser((user, done) => {
  done(null, user);
});

// Deserialize user from session
passport.deserializeUser((user, done) => {
  done(null, user);
});

// Middleware to check if the user is authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.redirect("/auth/google");
}

// Auth route for Google login
app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback route after successful authentication
app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  (req, res) => {
    // Successful authentication, redirect to the home page or wherever you want
    res.redirect("/");
  }
);

app.get("/", (req, res) => {
  res.send("Home Page");
});

// Logout route
app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});

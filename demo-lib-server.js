const express = require("express");
const session = require("express-session");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const config = require("./config");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize express-session middleware
app.use(
  session({
    secret: config.secretKey, // Use the generated secret key
    resave: false,
    saveUninitialized: false,
    // Set session expiry
    cookie: { maxAge: 3600000 }, // 1 hour in milliseconds
  })
);

// Initialize Passport and restore authentication state, if any, from the session
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "257753605908-lb18rbopncpfnskt25076pvou8k2mqd9.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:3000/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      // This is where you can save user data to your database
      return done(null, profile);
    }
  )
);

// Routes

app.get(
  "/auth/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "consent",
  })
);

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect to profile page
    res.redirect("/");
  }
);

app.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
    }
    console.log("Logging out...");
    res.redirect("/auth/google");
  });
});

app.get("/guest", (req, res) => {
  res.send("You are a guest now. Go login/ register.");
});

app.get("/", (req, res) => {
  if (req.isAuthenticated()) {
    res.send("Welcome to your profile page, " + req.user.displayName);
    console.log("Welcome to profile page...");
    // res.sendFile(path.join(__dirname, "profile.html"));
  } else {
    res.redirect("/auth/google");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});

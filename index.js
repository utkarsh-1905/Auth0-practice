if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const app = express();
const cors = require("cors");
const { auth, requiresAuth } = require("express-openid-connect");
const morgan = require("morgan");

app.use(express.json());
app.use(cors());

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.SECRET,
  baseURL: "http://localhost:3000",
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: "https://dev-jswnm7jb.us.auth0.com",
  routes: {
    login: "/login",
    postLogoutRedirect: "/loggedOut",
  },
};

app.use(auth(config));
app.use(morgan("dev"));

app.get("/", (req, res) => {
  res.send(req.oidc.isAuthenticated() ? "Logged in" : "Logged out");
  //   console.log(requiresAuth());
});

app.get("/profile", requiresAuth(), (req, res) => {
  res.send(res.oidc.user);
});

app.listen(process.env.PORT || 3000, () =>
  console.log(`Listening on port ${process.env.PORT || 3000}`)
);

app.get("/loggedOut", async (req, res) => {
  res
    .json({
      loggedOut: true,
    })
    .end();
});

// "/login" is automatically added for logging in.
// "/logout" is automatically added for logging out.

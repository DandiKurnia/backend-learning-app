const express = require("express");

const { register, login, refresh, logout } = require("./controller");
const router = express.Router();
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const {
  registerUserSchema,
  loginUserSchema,
} = require("../../validations/user");

router.post("/auth/register", validate(registerUserSchema), register);
router.post("/auth/login", validate(loginUserSchema), login);
router.put("/auth/refresh", auth, refresh);
router.delete("/auth/logout", auth, logout);

module.exports = router;

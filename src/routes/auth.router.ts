import { Router } from "express";
import Joi from "joi";
import { User } from "../models/user.model";
import passwordHash from "password-hash";
import JWT from "jsonwebtoken";
import config from "../config";

type Auth = {
  email: string;
  password: string;
};

export function authRouter() {
  const router = Router();

  router.post("/login", async (req, res, next) => {
    const schema = Joi.object({
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });

    const valid = schema.validate(req.body);
    if (valid.error) return res.status(400).json({ error: valid.error });

    const auth: Auth = req.body;
    auth.password = passwordHash.generate(auth.password);

    const user = await User.findOne({
      where: { email: auth.email, password: auth.password },
    });

    if (!user)
      return res
        .status(400)
        .json({ error: new Error("Incorrect email or password") });

    const jwt = JWT.sign({ userId: user.id }, config.JWT_KEY, {
      expiresIn: "2d",
    });

    return res.json({ jwt });
  });

  router.post("/register", async (req, res, next) => {
    const schema = Joi.object({
      username: Joi.string().required(),
      email: Joi.string().email().required(),
      password: Joi.string().required(),
    });

    const valid = schema.validate(req.body);
    if (valid.error) return res.status(400).json({ error: valid.error });

    const user: User = req.body;
    const newUser = await user.save();

    const jwt = JWT.sign({ userId: newUser.id }, config.JWT_KEY, {
      expiresIn: "2d",
    });

    return res.json({ jwt });
  });

  return router;
}

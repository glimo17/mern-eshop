import express from "express";
import bcrypt from "bcryptjs";
import expressAsyncHandler from "express-async-handler";
import Customer from "../models/customerModel.js";
import { generateToken, isAuth, isAdmin } from "../utils.js";

const customerRouter = express.Router();

customerRouter.get(
  "/",
  expressAsyncHandler(async (req, res) => {
    const users = await Customer.find({});
    res.send(users);
  })
);

customerRouter.get(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const user = await Customer.findById(req.params.id);
    if (user) {
      res.send(user);
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
  })
);

customerRouter.delete(
  "/:id",

  expressAsyncHandler(async (req, res) => {
    const user = await Customer.findById(req.params.id);
    if (user) {
      await user.remove();
      res.send({ message: "Cliente Deleted" });
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
  })
);
customerRouter.post(
  "/",
  isAuth,
  isAdmin,
  expressAsyncHandler(async (req, res) => {
    const newCustomer = new Customer({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone
    });
    const customer = await newCustomer.save();
    res.send({ message: "Cliente Creado", customer });
  })
);
customerRouter.put(
  "/:id",
  expressAsyncHandler(async (req, res) => {
    const customer = await Customer.findById(req.params.id);
    if (customer) {
      customer.name = req.body.name || customer.name;
      customer.email = req.body.email || customer.email;
      customer.phone = req.body.phone || customer.phone;
      const updatedUser = await customer.save();
      res.send({ message: "User Updated", user: updatedUser });
    } else {
      res.status(404).send({ message: "User Not Found" });
    }
  })
);

export default customerRouter;

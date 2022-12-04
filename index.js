require("dotenv").config();
const express = require("express");
// mongoose
const mongoose = require("mongoose");

const { PORT, MONGO_URI } = process.env;

const app = express();

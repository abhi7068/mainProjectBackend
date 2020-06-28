var express = require("express");
var categories = express();

var categoryGetRouter = require("./getRouter");
var categoryPostRouter = require("./postRouter");
var categoryPutRouter = require("./putRouter");
var categoryDeleteRouter = require("./deleteRouter");

categories.use("/find", categoryGetRouter);
categories.use("/gifts", categoryPostRouter);
categories.use("/change", categoryPutRouter);
categories.use("/delete", categoryDeleteRouter);

module.exports = categories;

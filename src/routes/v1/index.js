const express = require("express");
const userRoute = require("./user.route");

const router = express.Router();

// TODO: CRIO_TASK_MODULE_UNDERSTANDING_BASICS - Reroute all API requests beginning with the `/v1/users` route to Express router in user.route.js

router.use('/users', userRoute);

// router.use("*", (req, res) => {
//     console.log("hey there");
//     console.log(req.url, req.body, req.query);
// }); 

module.exports = router;

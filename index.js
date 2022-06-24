const express = require('express');
const cors = require("cors");
const app = express();
const db = require("./src/models/sequelize.index")
const Role = db.role;
const cookieParser = require("cookie-parser");
require("dotenv").config();

db.sequelize.sync();

var corsOptions = {
  origin: "http://localhost:8081"
};
app.use(cors(corsOptions));

// parse requests of content-type - application/json
app.use(express.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser());

// simple route
app.get('/', (req, res) => {
  res.json({message:'User service running!'});
})

// set port, listen for requests
const PORT = process.env.NODE_DOCKER_PORT || 8081;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});

require('./src/routes/auth.routes')(app);
require('./src/routes/user.routes')(app);
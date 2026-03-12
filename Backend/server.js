require("dotenv").config();
const app = require("./src/app");
const dbConnection = require("./src/config/database");

const PORT = process.env.PORT || 4000;

dbConnection()
    .then(() => {
        console.log("Database connected successfully");
        app.listen(PORT, () => {
            console.log('Server is running on port 3000');
        })
    }).catch((err) => {
        console.log("Database connection failed", err);
    });

const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
})
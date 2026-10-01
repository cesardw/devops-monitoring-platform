const express = require("express");

const app = express();

const PORT = process.env.PORT || 3000;
const VERSION = process.env.APP_VERSION || "1.0.0";
const ENVIRONMENT = process.env.NODE_ENV || "development";

app.get("/", (req, res) => {
    res.json({
        application: "PRUEBA DE APLICACION, DEVOPS EN PROCESO",
        version: VERSION,
        environment: ENVIRONMENT,
        status: "online"
    });
});

app.get("/health", (req, res) => {
    res.status(200).json({
        status: "healthy"
    });
});

app.listen(PORT, () => {
    console.log(`Application running on port ${PORT}`);
});
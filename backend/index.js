const express = require("express");
const cors = require("cors");
require("dotenv").config();
const swaggerUi = require("swagger-ui-express");
const YAML = require("yamljs"); 

const apiRoutes = require("./routes/api"); 

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000", // Frontend's URL
  })
);
app.use(express.json());


const swaggerDocument = YAML.load("./swagger.yaml");

// Swagger setup
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Mount the API routes 
app.use("/api", apiRoutes);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
  console.log(`Swagger documentation available at http://localhost:${PORT}/api-docs`);
});

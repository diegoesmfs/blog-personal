const { connection } = require("./database/connection");
const express = require("express");
const cors = require("cors");
const port = 3900;

console.log("servidor en linea");

connection();

const app = express();
app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({extended:true}));

app.get("/", (req, res) =>{

    return res.status(200).send(
        "<h1>Api Connection Granted</h1>"
    );

});

const articlesRoutes = require("./routes/articles");

app.use("/api", articlesRoutes);

app.listen(port, () => {

    console.log("Servidor escuchando el puerto " + port);

});
const { default: mongoose } = require("mongoose");

const connection = async() => {

    try {
        
       await mongoose.connect("mongodb://127.0.0.1:27017/mi_blog");

       console.log("Conexion exitosa a la base de datos");

    } catch (error) {
        
        console.log(error);
        throw new Error("Error al conectar a la base de datos");

    }

};

module.exports = {

    connection

};
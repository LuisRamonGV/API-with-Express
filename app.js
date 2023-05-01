// Imports.
const express = require("express");
const morgan = require("morgan");

// My imports.
const students = require("./routes/students");
const events = require("./routes/events");

const app = express();

//                    ╔================╗                    //
// ===================╣   MIDDLEWARES  ╠=================== //
//                    ╚================╝                    //
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));

// Middleware routes
app.use("/api/students/", students);
app.use("/api/events/", events);

//                    ╔================╗                    //
// ===================╣      ROOT      ╠=================== //
//                    ╚================╝                    //
app.get("/", (req, res) => {
  res.send("Desarrollado por Luis Ramon Garcia Vazquez.");
});

//                    ╔================╗                    //
// ===================╣ API connection ╠=================== //
//                    ╚================╝                    //
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Escuchando en el puerto ${port}`));

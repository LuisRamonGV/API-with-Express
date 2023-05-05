// Imports.
const express = require("express");
const morgan = require("morgan");

// My imports.
const {routeStudents} = require("./routes/students");
const {routeEvents} = require("./routes/events");
const registration = require("./routes/registration")

const app = express();

//                    ╔================╗                    //
// ===================╣   MIDDLEWARES  ╠=================== //
//                    ╚================╝                    //
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));

// Middleware routes
app.use("/api/students/", routeStudents);
app.use("/api/events/", routeEvents);
app.use("/api/registration/", registration)

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
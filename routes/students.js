// Global Imports
const express = require("express");
const Joi = require("joi");

const route = express.Router();

// My imports
const schoolMgmt = require("./registration");

//                    ╔================╗                    //
// ===================╣      GET       ╠=================== //
//                    ╚================╝                    //

route.get("/", (req, res) => {
  res.status(200).send(schoolMgmt.students);
});

route.get("/:id", (req, res) => {
  const student = schoolMgmt.findStudentById(req.params.id).data;
  if (student !== undefined) res.status(200).send(student);
  else res.status(400).send({ error: "Non existing student", data: undefined });
});

//                    ╔================╗                    //
// ===================╣      POST      ╠=================== //
//                    ╚================╝                    //

route.post("/", (req, res) => {
  const SIZE = schoolMgmt.students.length;
  const { value, error } = studentValidation(req.body);

  if (!error) {
    let student = { id: schoolMgmt.students[SIZE - 1].id + 1 };
    Object.assign(student, value);
    schoolMgmt.newStudentObject(student);
    res.send(student);
  } else {
    const errMsg = error.details[0].message;
    res.status(400).send(errMsg);
  }
});

//                    ╔================╗                    //
// ===================╣      PUT       ╠=================== //
//                    ╚================╝                    //

route.put("/:id", (req, res) => {
  const studentRes = schoolMgmt.findStudentById(req.params.id);

  if (studentRes.data !== undefined) {
    const { value, error } = studentValidation(req.body);
    if (error) {
      const errMsg = error.details[0].message;
      res.status(400).send(errMsg);
      return;
    }

    schoolMgmt.students[studentRes.pos].fullName = req.body.fullName;
    schoolMgmt.students[studentRes.pos].semester = req.body.semester;
    schoolMgmt.students[studentRes.pos].email = req.body.email;
    schoolMgmt.students[studentRes.pos].career = req.body.career;

    res.status(200).send(value);
  } else {
    res.status(404).send("Error. This student does not exist.");
  }
});

//                    ╔================╗                    //
// ===================╣     DELETE     ╠=================== //
//                    ╚================╝                    //

route.delete("/:id", (req, res) => {
  const studentRes = schoolMgmt.findStudentById(req.params.id);

  if (studentRes.data !== undefined) {
    schoolMgmt.students.splice(studentRes.pos, 1);
    res.status(200).send(studentRes.data);
  } else res.status(404).send("Error. This student does not exist.");
});

//                    ╔===================╗                    //
// ===================╣ Utility functions ╠=================== //
//                    ╚===================╝                    //
function studentValidation(body) {
  const schema = Joi.object({
    fullName: Joi.string().min(2).required(),
    semester: Joi.number().integer().min(1).max(18).required(),
    email: Joi.string().email().required(),
    career: Joi.string().min(2).max(4).uppercase().required(),
  });

  return schema.validate(body);
}

module.exports = route;

// Global Imports
const express = require("express");
const Joi = require("joi");

const route = express.Router();

// Student class: Declares the prototype for the Student objects.
class Student {
  constructor(id, Name, semester, email, career) {
    this.id = id;
    this.Name = Name;
    this.semester = semester;
    this.email = email;
    this.career = career;
  }
}

// Students array for testing.
let students = [
  new Student(1, "Ramon Garcia", 8, "ramon@ugto.mx", "LISC"),
  new Student(2, "Chikistrikis", 6, "chikis@ugto.mx", "LISC"),
  new Student(3, "Choche", 12, "Choche@ugto.mx", "LIM"),
];

//                    ╔================╗                    //
// ===================╣      GET       ╠=================== //
//                    ╚================╝                    //

route.get("/", (req, res) => {
  res.status(200).send(students);
});

route.get("/:id", (req, res) => {
  const student = findStudentById(req.params.id).data;
  if (student !== undefined) res.status(200).send(student);
  else res.status(400).send({ error: "Non existing student", data: undefined });
});

//                    ╔================╗                    //
// ===================╣      POST      ╠=================== //
//                    ╚================╝                    //

route.post("/", (req, res) => {
  const SIZE = students.length;
  const { value, error } = studentValidation(req.body);

  if (!error) {
    let student = { id: students[SIZE - 1].id + 1 };
    Object.assign(student, value);
    newStudentObject(student);
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
  const studentRes = findStudentById(req.params.id);

  if (studentRes.data !== undefined) {
    const { value, error } = studentValidation(req.body);
    if (error) {
      const errMsg = error.details[0].message;
      res.status(400).send(errMsg);
      return;
    }

    students[studentRes.pos].Name = req.body.Name;
    students[studentRes.pos].semester = req.body.semester;
    students[studentRes.pos].email = req.body.email;
    students[studentRes.pos].career = req.body.career;

    res.status(200).send(value);
  } else {
    res.status(404).send("Error. This student does not exist.");
  }
});

//                    ╔================╗                    //
// ===================╣     DELETE     ╠=================== //
//                    ╚================╝                    //

route.delete("/:id", (req, res) => {
  const studentRes = findStudentById(req.params.id);

  if (studentRes.data !== undefined) {
    students.splice(studentRes.pos, 1);
    res.status(200).send(studentRes.data);
  } else res.status(404).send("Error. This student does not exist.");
});


//                    ╔===================╗                    //
// ===================╣ Utility functions ╠=================== //
//                    ╚===================╝                    //

// Verifies if a specific id for a student is available.
function studentIdAvailable(id) {
  const SIZE = students.length;
  for (let i = 0; i < SIZE; i++)
    if (students[i].id === parseInt(id)) return false;
  return true;
}

 // Enrolls a students list in a new event.
 function enrollStudents(students) {
  const EVENT_STUDENTS_SIZE = students.length;
  const STUDENTS_SIZE = students.length;

  let enrolled = [];

  for (let i = 0; i < EVENT_STUDENTS_SIZE; i++)
    for (let j = 0; j < STUDENTS_SIZE; j++)
      if (students[i] === students[j].id) {
        enrolled.push(students[i]);
        break;
      }

  return enrolled;
}

 // Adds a student by copying from an object.
 function newStudentObject(student) {
  if (studentIdAvailable(student.id)) students.push(student);
  else return undefined;
}

  // Looks for a student in the database. Returns the index in the array and the respective student. If it doesn't exists, returns -1 and object undefined.
function findStudentById(id) {
    const SIZE = students.length;
    if (SIZE > 0) {
      if (!studentIdAvailable(id)) {
        for (let i = 0; i < SIZE; i++)
          if (students[i].id === parseInt(id, 10))
            return { pos: i, data: students[i] };
      }
    }

    return { pos: -1, data: undefined };
  }

 // Deletes a student from the database. It also deletes it from each event it is in.
 function deleteStudent(id) {
  const res = findStudentById(id);
  if (res.data !== undefined) {
    students.splice(res.pos, 1);
    const EVENT_STUDENTS_SIZE = events.length;

    // Looks for the student registers in events.
    for (let i = 0; i < EVENT_STUDENTS_SIZE; i++) {
      const STUDENTS_IN_EVENT = events[i].students.length;
      for (let j = 0; j < STUDENTS_IN_EVENT; j++) {
        if (events[i].students[j] === id) {
          events[i].students.splice(j, 1);
          break;
        }
      }
    }
    return res.data;
  }
  return undefined;
}

function studentValidation(body) {
  const schema = Joi.object({
    Name: Joi.string().min(2).required(),
    semester: Joi.number().integer().min(1).max(18).required(),
    email: Joi.string().email().required(),
    career: Joi.string().min(2).max(4).uppercase().required(),
  });

  return schema.validate(body);
}

module.exports = {
  routeStudents: route,
  Students: students
};
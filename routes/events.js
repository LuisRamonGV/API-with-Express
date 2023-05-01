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
  res.status(200).send(schoolMgmt.events);
});

route.get("/:id", (req, res) => {
  const event = schoolMgmt.findEventById(req.params.id).data;
  if (event !== undefined) res.status(200).send(event);
  else res.status(400).send({ error: "Non existing event", data: undefined });
});

//                    ╔================╗                    //
// ===================╣      POST      ╠=================== //
//                    ╚================╝                    //

route.post("/", (req, res) => {
  const SIZE = schoolMgmt.events.length;
  const { value, error } = eventValidation(req.body);

  if (!error) {
    let event = { id: schoolMgmt.events[SIZE - 1].id + 1 };
    Object.assign(event, value);
    schoolMgmt.newEventObject(event);

    // // Maybe make that set thing.
    event.students = schoolMgmt.enrollStudents(event.students);
    schoolMgmt.newEventObject(event);

    res.send(event);
  } else {
    const errMsg = error.details[0].message;
    res.status(400).send(errMsg);
  }
});

//                    ╔================╗                    //
// ===================╣      PUT       ╠=================== //
//                    ╚================╝                    //

route.put("/:id", (req, res) => {
  const eventRes = schoolMgmt.findEventById(req.params.id);

  if (eventRes.data !== undefined) {
    const { value, error } = eventValidation(req.body);
    if (error) {
      const errMsg = error.details[0].message;
      res.status(400).send(errMsg);
      return;
    }

    const enrolled = schoolMgmt.enrollStudents(value.students),
      students = schoolMgmt.events[eventRes.pos].students,
      dsSet = new Set(req.body.delete);

    schoolMgmt.events[eventRes.pos].title = value.title;
    schoolMgmt.events[eventRes.pos].hour = value.hour;
    schoolMgmt.events[eventRes.pos].place = value.place;
    schoolMgmt.events[eventRes.pos].speaker_name = value.speaker_name;
    schoolMgmt.events[eventRes.pos].students = value.students;

    for (let dStudent of dsSet) {
      id = schoolMgmt.events[eventRes.pos].students.indexOf(dStudent);
      console.log(dStudent, id);
      if (id !== -1) schoolMgmt.events[eventRes.pos].students.splice(id, 1);
    }

    res.status(200).send(value);
  } else {
    res.status(404).send("Error. This event does not exist.");
  }
});

//                    ╔================╗                    //
// ===================╣     DELETE     ╠=================== //
//                    ╚================╝                    //

route.delete("/:id", (req, res) => {
  const eventRes = schoolMgmt.findEventById(req.params.id);

  if (eventRes.data !== undefined) {
    schoolMgmt.events.splice(eventRes.pos, 1);
    res.status(200).send(eventRes.data);
  } else res.status(404).send("Error. This event does not exist.");
});

//                    ╔===================╗                    //
// ===================╣ Utility functions ╠=================== //
//                    ╚===================╝                    //

function eventValidation(body) {
  const hourRegex = /^([01][0-9]|2[0-3]):[0-5][0-9]$/;
  const schema = Joi.object({
    title: Joi.string().required(),
    hour: Joi.string().regex(hourRegex).required(),
    place: Joi.string().required(),
    speaker_name: Joi.string().required(),
    students: Joi.array().items(Joi.number().integer()).required(),
  });

  return schema.validate(body);
}

// function noDuplicates(arr1, arr2) {
//   arr1.forEach((item1) => arr2.push(item1));

//   return [...new Set(arr2)].sort();
// }

module.exports = route;

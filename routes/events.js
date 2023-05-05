// Global Imports
const express = require("express");
const Joi = require("joi");

const route = express.Router();

// event class: Declares the prototype for the event objects.
class Event {
  constructor(id, title, hour, place, speaker_name,  date, students) {
    this.id = id;
    this.title = title;
    this.hour = hour;
    this.place = place;
    this.speaker_name = speaker_name;
    this.date = date;
    this. students = students;
  }
}

// Courses array for testing. Note that it contains non-existing arrays. It does not add them.
let events = [
  new Event(1, "Ponencia C", "11:00", "Auditorio 101", "Pinales", "14/09/2023", [1, 2]),
  new Event(2, "Ponencia C++", "16:00", "Auditorio 10", "Raul Sanchez", "15/09/2023", []),
  new Event(3, "Ponencia Python", "08:00", "Auditorio 101", "Juan Pablo", "16/09/2023", []),
  new Event(4, "Ponencia JavaScript", "14:00", "Auditorio 101", "Juan Carlos", "17/09/2023", []),
  ]

//                    ╔================╗                    //
// ===================╣      GET       ╠=================== //
//                    ╚================╝                    //

route.get("/", (req, res) => {
  res.status(200).send(events);
});

route.get("/:id", (req, res) => {
  const event = findEventById(req.params.id).data;
  if (event !== undefined) res.status(200).send(event);
  else res.status(400).send({ error: "Non existing event", data: undefined });
});

//                    ╔================╗                    //
// ===================╣      POST      ╠=================== //
//                    ╚================╝                    //

route.post("/", (req, res) => {
  const SIZE = events.length;
  const { value, error } = eventValidation(req.body);

  if (!error) {
    let event = { id: events[SIZE - 1].id + 1 };
    Object.assign(event, value);
    newEventObject(event);

    // // Maybe make that set thing.
    event.students = enrollStudents(event.students);
    newEventObject(event);

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
  const eventRes = findEventById(req.params.id);

  if (eventRes.data !== undefined) {
    const { value, error } = eventValidation(req.body);
    if (error) {
      const errMsg = error.details[0].message;
      res.status(400).send(errMsg);
      return;
    }

    const enrolled = enrollStudents(value.students),
      students = events[eventRes.pos].students,
      dsSet = new Set(req.body.delete);

    events[eventRes.pos].title = value.title;
    events[eventRes.pos].hour = value.hour;
    events[eventRes.pos].place = value.place;
    events[eventRes.pos].speaker_name = value.speaker_name;
    events[eventRes.pos].date = value.date;
   events[eventRes.pos].students = value.students;

    for (let dStudent of dsSet) {
      id = events[eventRes.pos].students.indexOf(dStudent);
      console.log(dStudent, id);
      if (id !== -1) events[eventRes.pos].students.splice(id, 1);
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
  const eventRes = findEventById(req.params.id);

  if (eventRes.data !== undefined) {
    events.splice(eventRes.pos, 1);
    res.status(200).send(eventRes.data);
  } else res.status(404).send("Error. This event does not exist.");
});

//                    ╔===================╗                    //
// ===================╣ Utility functions ╠=================== //
//                    ╚===================╝                    //

function eventValidation(body) {
  const hourRegex = /^([01][0-9]|2[0-3]):[0-5][0-9]$/;
  const dateRegex = /^[0-9]{2}\/[0-9]{2}\/[0-9]{4}$/;
  const schema = Joi.object({
    title: Joi.string().required(),
    hour: Joi.string().regex(hourRegex).required(),
    place: Joi.string().required(),
    speaker_name: Joi.string().required(),
    date: Joi.string().pattern(dateRegex).required(),
    students: Joi.array().items(Joi.number().integer()).required(),
  });

  const { value, error } = schema.validate(body);

  if (error) {
    const errMsg = error.details[0].message;
    throw new Error(errMsg);
  }

    // Verify that all student ids exist
  // const nonExistingStudents = value.students.filter((id) => !schoolMgmt.students.includes(id));
  // if (nonExistingStudents.length > 0) {
  //   const errMsg = `The following students dont exist: ${nonExistingStudents.join(", ")}`;
  //   throw new Error(errMsg);
  // }

  noDuplicates(value);

  return { value };
}

// Verifies if a specific id for a event is available.
function eventIdAvailable(id) {
  const SIZE = events.length;
  for (let i = 0; i < SIZE; i++)
    if (events[i].id === parseInt(id)) return false;
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

function newEventObject(event) {
  if (eventIdAvailable(event.id)) events.push(event);
  else return undefined;
}

  // Looks for a student in the database. Returns the index in the array and the respective student. If it doesn't exists, returns -1 and object undefined.
function findEventById(id) {
    const SIZE = events.length;
    if (SIZE > 1) {
      if (!eventIdAvailable(id)) {
        for (let i = 0; i < SIZE; i++)
          if (events[i].id === parseInt(id, 10))
            return { pos: i, data: events[i] };
      }
    }
    return { pos: -1, data: undefined };
  }

    // Deletes a course from the database.
function deleteEvent(id) {
      const res = findEventById(id);
      if (res.data !== undefined) {
        events.splice(res.pos, 1);
        return res.data;
      }
      return undefined;
    }
  

function noDuplicates(body) {
  const { date, hour, place } = body;
  const eventsOnDateAndPlace = events.filter(
    (event) => event.date === date && event.hour === hour && event.place === place
  );

  if (eventsOnDateAndPlace.length > 0) {
    const err = new Error("There is already an event registered at this date, time and place.");
    err.status = 400;
    throw err;
  }
}


// function noDuplicates(arr1, arr2) {
//   arr1.forEach((item1) => arr2.push(item1));

//   return [...new Set(arr2)].sort();
// }

module.exports = {
  routeEvents: route,
  Events: events
};

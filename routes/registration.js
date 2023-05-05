// Global Imports
const express = require("express");
const Joi = require("joi");
const route = express.Router();
const { Students } = require('./students');
const { Events } = require('./events');

//                    ╔================╗                    //
// ===================╣      POST      ╠=================== //
//                    ╚================╝                    //

route.post('/:id0/:id1', (req, res) => {
  const idStudent = req.params.id0;
  const idEvent = req.params.id1;
  let Student = studentexist(idStudent);
  if(!Student){
    res.status(404).send('Student not found'); // Devuelve el estado HTTP
    return;
  }
  let Event = eventexist(idEvent);
  if(!Event){
   
    res.status(404).send('Event not found'); // Devuelve el estado HTTP
    return;
  }

  if (Event.students.includes(idStudent)) {
    res.status(404).send('Student registered in event');
    return;
  }else {
  Event.students.push(idStudent);
  res.send(`Student ${Student.Name} registered in event ${Event.title}`);
  }
});

//                    ╔================╗                    //
// ===================╣     DELETE     ╠=================== //
//                    ╚================╝                    //

route.delete('/:id0/:id1', (req, res) => {
  const idStudent = req.params.id0;
  const idEvent = req.params.id1;
  let Student = studentexist(idStudent);
  if(!Student){
    res.status(404).send('Student not found'); 
    return;
  }
  let Event = eventexist(idEvent);
  if(!Event){
    res.status(404).send('Event not found'); 
    return;
  }
  
  // Find the corresponding student in the student array
  const studentIndex = Event.students.findIndex((id) => id === idStudent);
  

  if (studentIndex === -1) {
    res.status(404).send("Student not found in event");
    return;
  }
    // We delete the student from the list of students registered in events
    Events.forEach((Event) => {
      const studentIndex = Event.students.findIndex((id) => id === idStudent);
      if (studentIndex !== -1) {
        Event.students.splice(studentIndex, 1);
      }
    });
  res.send(`The student ${Student.Name} was delete from the event ${Event.title}`); 
  return;
});

//                    ╔===================╗                    //
// ===================╣ Utility functions ╠=================== //
//                    ╚===================╝                    //

// Function to check if a student exists
function studentexist(id){
  return (Students.find(student => student.id === parseInt(id)));
}

// Function to check if the event exists
function eventexist(id){
  return (Events.find(event => event.id === parseInt(id)));
}


module.exports = route; 

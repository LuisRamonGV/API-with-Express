// Student class: Declares the prototype for the Student objects.
class Student {
    constructor(id, fullName, semester, email, career) {
      this.id = id;
      this.fullName = fullName;
      this.semester = semester;
      this.email = email;
      this.career = career;
    }
  }
  
  // event class: Declares the prototype for the event objects.
  class Event {
    constructor(id, title, hour, place, speaker_name,  students) {
      this.id = id;
      this.title = title;
      this.hour = hour;
      this.place = place;
      this.speaker_name = speaker_name;
      this. students = students;
    }
  }
  
  
  // SchoolManagement class: Relates the Student with the eventclass and all its CRUD operations.
  class EventManagement {
    constructor(students = [], Events = []) {
      this.students = students;
      this.events = Events;
    }
  
    /* -  -  -  -  -  -  -  -  -  -  - Utility Functions -  -  -  -  -  -  -  -  -  -  -  -  -  -  - */
    // Verifies if a specific id for a student is available.
    studentIdAvailable(id) {
      const SIZE = this.students.length;
      for (let i = 0; i < SIZE; i++)
        if (this.students[i].id === parseInt(id)) return false;
      return true;
    }
  
    // Verifies if a specific id for a event is available.
    eventIdAvailable(id) {
      const SIZE = this.events.length;
      for (let i = 0; i < SIZE; i++)
        if (this.events[i].id === parseInt(id)) return false;
      return true;
    }
  
    // Enrolls a students list in a new event.
    enrollStudents(students) {
      const EVENT_STUDENTS_SIZE = students.length;
      const STUDENTS_SIZE = this.students.length;
  
      let enrolled = [];
  
      for (let i = 0; i < EVENT_STUDENTS_SIZE; i++)
        for (let j = 0; j < STUDENTS_SIZE; j++)
          if (students[i] === this.students[j].id) {
            enrolled.push(students[i]);
            break;
          }
  
      return enrolled;
    }
  
    /* -  -  -  -  -  -  -  -  -  -  - Utility Functions End -  -  -  -  -  -  -  -  -  -  -  -  -  -  - */
  
    /* -  -  -  -  -  -  -  -  -  -  - Student's Management -  -  -  -  -  -  -  -  -  -  -  -  -  -  - */
    // Adds a student by copying from an object.
    newStudentObject(student) {
      if (this.studentIdAvailable(student.id)) this.students.push(student);
      else return undefined;
    }
  
    // Looks for a student in the database. Returns the index in the array and the respective student. If it doesn't exists, returns -1 and object undefined.
    findStudentById(id) {
      const SIZE = this.students.length;
      if (SIZE > 0) {
        if (!this.studentIdAvailable(id)) {
          for (let i = 0; i < SIZE; i++)
            if (this.students[i].id === parseInt(id, 10))
              return { pos: i, data: this.students[i] };
        }
      }
  
      return { pos: -1, data: undefined };
    }
  
    // Deletes a student from the database. It also deletes it from each event it is in.
    deleteStudent(id) {
      const res = this.findStudentById(id);
      if (res.data !== undefined) {
        this.students.splice(res.pos, 1);
        const EVENT_STUDENTS_SIZE = this.events.length;
  
        // Looks for the student registers in events.
        for (let i = 0; i < EVENT_STUDENTS_SIZE; i++) {
          const STUDENTS_IN_EVENT = this.events[i].students.length;
          for (let j = 0; j < STUDENTS_IN_EVENT; j++) {
            if (this.events[i].students[j] === id) {
              this.events[i].students.splice(j, 1);
              break;
            }
          }
        }
        return res.data;
      }
      return undefined;
    }
    /* -  -  -  -  -  -  -  -  -  -  - Student's Management End -  -  -  -  -  -  -  -  -  -  -  -  -  -  - */
  
    /* -  -  -  -  -  -  -  -  -  -  - Course's Management -  -  -  -  -  -  -  -  -  -  -  -  -  -  - */
    // Adds a course by copying from an object.
    newEventObject(event) {
      if (this.eventIdAvailable(event.id)) {
        this.events.students = this.enrollStudents(event.students);
        if (this.events.students.length > 0) this.events.push(event);
      }
    }
  
    // Looks for a student in the database. Returns the index in the array and the respective student. If it doesn't exists, returns -1 and object undefined.
    findEventById(id) {
      const SIZE = this.events.length;
      if (SIZE > 1) {
        if (!this.eventIdAvailable(id)) {
          for (let i = 0; i < SIZE; i++)
            if (this.events[i].id === parseInt(id, 10))
              return { pos: i, data: this.events[i] };
        }
      }
      return { pos: -1, data: undefined };
    }
  
    // Deletes a course from the database.
    deleteEvent(id) {
      const res = this.findEventById(id);
      if (res.data !== undefined) {
        this.events.splice(res.pos, 1);
        return res.data;
      }
      return undefined;
    }
  
    /* -  -  -  -  -  -  -  -  -  -  - Course's Management End -  -  -  -  -  -  -  -  -  -  -  -  -  -  - */
  }
  
  // Students array for testing.
  let students = [
    new Student(1, "Ramon Garcia", 8, "ramon@ugto.mx", "LISC"),
    new Student(2, "Chikistrikis", 6, "chikis@ugto.mx", "LISC"),
    new Student(3, "Choche", 12, "Choche@ugto.mx", "LIM"),
  ];
  
  // Courses array for testing. Note that it contains non-existing arrays. It does not add them.
  let events = [
  new Event(1, "Ponencia C", "12:00", "Auditorio 101", "Pinales", []),
  new Event(2, "Ponencia C++", "12:00", "Auditorio 10", "Pinales", []),
  new Event(3, "Ponencia Python", "12:00", "Auditorio 101", "Pinales", []),
  new Event(4, "Ponencia JavaScript", "12:00", "Auditorio 101", "Pinales", []),
  new Event(5, "Ponencia Ruby", "12:00", "Auditorio 101", "Pinales", []),
  ];
  
  // SchoorlManagement object initialized by constructor adding the students and courses lists.
  const schoolMgmt = new EventManagement(students, events);
  
  module.exports = schoolMgmt;
  
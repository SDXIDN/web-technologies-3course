"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class OnlineCourse {
    constructor(title, durationHours) {
        this.title = title;
        this.durationHours = durationHours;
        this.students = [];
    }
    registerStudent(student) {
        if (this.isStudentRegistered(student)) {
            console.log(`Студент ${student} вже зареєстрований на курс "${this.title}"`);
            return;
        }
        this.students.push(student);
    }
    isStudentRegistered(student) {
        return this.students.includes(student);
    }
}
class CourseManager {
    constructor() {
        this.courses = [];
    }
    addCourse(course) {
        this.courses.push(course);
    }
    removeCourse(courseName) {
        this.courses = this.courses.filter((c) => c.title !== courseName);
    }
    findCourse(courseName) {
        return this.courses.find((c) => c.title === courseName);
    }
    printCourses() {
        this.courses.forEach((c) => {
            const list = c.students.length > 0 ? c.students.join(", ") : "немає";
            console.log(`${c.title} (${c.durationHours} год). Студенти: ${list}`);
        });
    }
}
const manager = new CourseManager();
const ts = new OnlineCourse("TypeScript", 40);
const js = new OnlineCourse("JavaScript", 50);
const react = new OnlineCourse("React", 30);
manager.addCourse(ts);
manager.addCourse(js);
manager.addCourse(react);
ts.registerStudent("Олена");
ts.registerStudent("Андрій");
ts.registerStudent("Олена"); // повторна реєстрація
js.registerStudent("Марія");
console.log("Олена на TypeScript:", ts.isStudentRegistered("Олена"));
console.log("Марія на TypeScript:", ts.isStudentRegistered("Марія"));
console.log("\nВсі курси:");
manager.printCourses();
manager.removeCourse("React");
console.log("\nПісля видалення React:");
manager.printCourses();
console.log("\nПошук 'React':", manager.findCourse("React"));
//# sourceMappingURL=courses.js.map
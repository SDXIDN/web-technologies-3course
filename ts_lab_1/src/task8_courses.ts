export {};

interface Course {
  title: string;
  durationHours: number;
  students: string[];
}

class OnlineCourse implements Course {
  students: string[] = [];

  constructor(public title: string, public durationHours: number) {}

  registerStudent(student: string): void {
    if (this.isStudentRegistered(student)) {
      console.log(`Студент ${student} вже зареєстрований на курс "${this.title}"`);
      return;
    }
    this.students.push(student);
  }

  isStudentRegistered(student: string): boolean {
    return this.students.includes(student);
  }
}

class CourseManager {
  private courses: Course[] = [];

  addCourse(course: Course): void {
    this.courses.push(course);
  }

  removeCourse(courseName: string): void {
    this.courses = this.courses.filter((c) => c.title !== courseName);
  }

  findCourse(courseName: string): Course | undefined {
    return this.courses.find((c) => c.title === courseName);
  }

  printCourses(): void {
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
ts.registerStudent("Олена"); 
js.registerStudent("Марія");

console.log("Олена на TypeScript:", ts.isStudentRegistered("Олена"));
console.log("Марія на TypeScript:", ts.isStudentRegistered("Марія"));

console.log("\nВсі курси:");
manager.printCourses();

manager.removeCourse("React");
console.log("\nПісля видалення React:");
manager.printCourses();

console.log("\nПошук 'React':", manager.findCourse("React"));

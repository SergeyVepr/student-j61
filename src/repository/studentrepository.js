import {Student} from "../model/student.js";

const students = new Map();

export const addStudent = ({id, name, password}) => {
    if (students.has(id)) return false;
    students.set(id, new Student(id, name, password));
    return true;
};

export const findStudent = (id) => students.get(+id);

export const updateStudent = (id, name, password, scores) => {
    const student = students.get(id);
    if (!student) throw new Error("Student not found");
    const updateStudent = {...student, ...{name, password, scores}};
    students.set(id, updateStudent);
    return students.get(id);
}

export const deleteStudent = (id) => {
    const student = students.get(id);
    if (student) {
        students.delete(id);
        return student;
    } else {
        throw new Error("Student not found");
    }

}

export const addScore = (id, {examName, score}) => {
    const student = students.get(id);
    if (!student) throw new Error("Not found");
    student.scores[examName] = score;
    return student;
}

export const findByName = (name) => {
    const arr = Array.from(students.values()).filter(student => student.name.toLowerCase() === name.toLowerCase());
    if (arr.length === 0) throw new Error("Not found");
    return arr;
}

export const countByNames = (names) => {
    const namesLowerCase = names.map(name => name.toLowerCase());
    const arr = Array.from(students.values()).filter(
        student => namesLowerCase.includes(student.name.toLowerCase())
    );
    return arr.length;
}

export const findByMinScore = (examName, minScore) => {
    const arr = Array.from(students.values()).filter(
        student => student.scores[examName] >= minScore
    );
    if(arr.length === 0) throw new Error(
        `No student with min score ${minScore} in exam ${examName}`
    )
    return arr;
}


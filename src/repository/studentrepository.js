import Student from "../model/student.js";

export const createStudent = (student) => Student.create(student);
export const findStudentById = (id) => Student.findById({_id: id});
export const deleteStudent = (id) => Student.findByIdAndDelete({_id: id});
export const updateStudent = (id, data) => Student.findByIdAndUpdate({_id: id}, data, {returnDocument: 'after'});
export const updateStudentScores = (id, exam, score) => {
    exam = exam.toLowerCase();
    return Student.findByIdAndUpdate({_id: id}, {[`scores.${exam}`]: score}, {returnDocument: 'after'});
}
export const findStudentsByName = (name) => Student.find({name: new RegExp(`^${name}$`, `i`)});
export const countStudentsByName = (names) => {
    const regexConditions = names.map(name => ({name: new RegExp(`^${name}$`, `i`)}));
    return Student.countDocuments({$or: regexConditions});
}
export const findStudentByMinScore = (exam, minScore) => {
    exam = exam.toLowerCase();
    return Student.find({[`scores.${exam}`]: {$gte: minScore}});
}
export const getAllStudents = () => Student.find().sort({_id: 1});

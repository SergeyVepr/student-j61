import * as service from "../service/studentService.js";
import {scoreSchema, studentSchema,updateStudentSchema} from "../validator/studentValidator.js";



export const addStudent = async (req, res) => {
    const {error} =  studentSchema.validate(req.body);
    if (error) return res.status(400).json({error: error.details[0].message})
    const success = await service.addStudent(req.body);
    res.sendStatus(success ? 201 : 409);
}

export const findStudent = async (req, res) => {
    const student = await service.findStudent(+req.params.id);
    res.status(student ? 200 : 404).json(student ? student : 'Not found');
}

export const updateStudent = async (req, res) => {
    const {error} = updateStudentSchema.validate(req.body);
    if (error) return res.status(400).json({error: error.details[0].message})
    const student = await service.updateStudent(+req.params.id, req.body);
    res.status(student ? 200 : 404).json(student ? student : 'Not found student');
}

export const deleteStudent = async (req, res) => {
    const student = await service.deleteStudent(+req.params.id);
    res.status(student ? 200 : 404).json(student ? student : 'Not found student');
}

export const addScore = async (req, res) => {
    const {error} = scoreSchema.validate(req.body);
    if (error) return res.status(400).json({error: error.details[0].message})
    const success = await service.addScore(+req.params.id, req.body.exam, +req.body.score);
    res.status(success ? 200 : 404).json(success);
}

export const findByName = async (req, res) => {
    const students = await service.findByName(req.params.name);
    res.sendStatus(students ? res.status(200).json(students) : 404);
}

export const countByNames = async (req, res) => {
    const names = req.query.names;
    const list = Array.isArray(names) ? names : [names];
    res.json(await service.countByNames(list));
}

export const findByMinScore = async (req, res) => {
    res.json(await service.findByMinScore(req.params.exam, +req.params.minScore));
}

export const getAllStudents = async (req, res) => {
    res.json(await service.getAllStudents());
}
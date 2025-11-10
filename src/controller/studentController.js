import * as repo from "../repository/studentrepository.js"
import {DefaultNotFount} from "../constants/defaultNotFount.js";


export const addStudent = (req, res) => {
    const success = repo.addStudent(req.body);
    if (success) {
        res.status(204).send();
    } else {
        res.status(409).send({res: "Student already exists"});
    }
}

export const findStudent = (req, res) => {
    const student = repo.findStudent(+req.params.id);
    if (student) {
        const {password, ...studentWithoutPassword} = student;
        res.json(studentWithoutPassword);
    } else {
        res.status(404).send();
    }
}

export const updateStudent = (req, res) => {
    try {
        const student = repo.updateStudent(+req.params.id, req.body.name, req.body.password);
        const {scores, ...studentWithoutScores} = student;
        res.status(200).send(studentWithoutScores);
    } catch (e) {
        res.status(404).send(
            new DefaultNotFount(
                404,
                e.message,
                `student with id ${req.params.id} not found`,
                req.path
            )
        );
    }
}

export const deleteStudent = (req, res) => {
    try {
        const student = repo.deleteStudent(+req.params.id);
        const {password, ...studentWithOutPassword} = student;
        res.status(200).send(studentWithOutPassword);
    } catch (e) {
        res.status(404).send(
            new DefaultNotFount(
                404,
                e.message,
                `student with id ${req.params.id} not found`,
                req.path
            )
        );
    }
}

export const addScore = (req, res) => {
    try {
        repo.addScore(+req.params.id, req.body);
        res.status(204).send();
    } catch (e) {
        res.status(404).send(
            new DefaultNotFount(
                404,
                e.message,
                `student not found`,
                req.path
            )
        );
    }
}

export const findByName = (req, res) => {
    try {
        const students = repo.findByName(req.params.name);
        res.json(students.map(student => {
            const {password, ...studentWithoutPassword} = student;
            return studentWithoutPassword;
        }));
    } catch (e) {
        res.status(404).send(
            new DefaultNotFount(
                404,
                e.message,
                `student not found`,
                req.path
            )
        );
    }

}

export const countByNames = (req, res) => {
    const names = [].concat(req.query.names);
    const count = repo.countByNames(names);
    res.json(count);
}

export const findByMinScore = (req, res) => {
    try {
        const students = repo.findByMinScore(req.params.exam, +req.params.minScore);
        res.json(students.map(student => {
            const {password, ...studentWithoutPassword} = student;
            return studentWithoutPassword;
        }));
    } catch (e) {
        res.status(404).send(
            new DefaultNotFount(
                404,
                e.message,
                `student not found`,
                req.path
            )
        );
    }

}
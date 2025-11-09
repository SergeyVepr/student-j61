import * as repo from "../repository/studentrepository.js"


export const addStudent = (req, res) => {
    const success = repo.addStudent(req.body);
    if(success) {
        res.status(204).send();
    }else{
        res.status(409).send({res: "Student already exists"});
    }
}

export const findStudent = (req, res) => {
    const student = repo.findStudent(+req.params.id);
    if(student) {
        const {password, ...studentWithoutPassword} = student;
        res.json(studentWithoutPassword);
    }else{
        res.status(404).send();
    }
}

export const updateStudent = (req, res) => {
    //TODO
}

export const deleteStudent = (req, res) => {
    //TODO
}

export const addScore = (req, res) => {
    //TODO
}

export const findByName = (req, res) => {
    //TODO
}

export const countByNames = (req, res) => {
    //TODO
}

export const findByMinScore = (req, res) => {
    //TODO
}
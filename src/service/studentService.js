import * as repo from "../repository/studentRepository.js";


export const addStudent = async ({id, name, password}) => {
    if (await repo.findStudentById(id)) return false;
    await repo.createStudent({_id: id, name, password});
    return true;

}

export const findStudent = async (id) => {
    return repo.findStudentById(id);
};

export const deleteStudent = async id => {
    return repo.deleteStudent(id);
}

export const updateStudent = async (id, data) => {
    const victim = await repo.updateStudent(id, data).lean();
    if (victim) {
        victim.id = victim._id;
        delete victim._id;
        victim.scores = undefined;
    }
    return victim;
}

export const addScore = async (id, exam, score) => {
    return repo.updateStudentScores(id, exam, score);
}

export const findByName = async (name) => {
    return repo.findStudentsByName(name);

}

export const countByNames = async (names) => {
    return repo.countStudentsByName(names);

}

export const findByMinScore = async (exam, minScore) => {
    return repo.findStudentByMinScore(exam, minScore);
}

export const getAllStudents = async () => {
    return repo.getAllStudents();
}
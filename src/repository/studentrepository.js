let collection;

export const init = db => collection = db.collection('college');

export const addStudent = async ({id, name, password}) => {
    console.log(typeof collection);
    const existingStudent = await collection.findOne({_id: id});
    if (existingStudent) return false;
    await collection.insertOne({_id: id, name, password, scores: {}});
    return true;

}

export const findStudent = async (id) => {
    return await collection.findOne({_id: id});
};

export const deleteStudent = async id => {
    return await collection.findOneAndDelete({_id: id});
}

export const updateStudent = async (id, data) => {
    return await collection.findOneAndUpdate(
        {_id: id},
        {$set: data},
        {returnDocument: 'after'});
}

export const addScore = async (id, exam, score) => {
    return await collection.findOneAndUpdate(
        {_id: id},
        {$set: {['scores.' + exam.toLowerCase()]: score}},
        {returnDocument: 'after'}
    );
}

export const findByName = async (name) => {
    return await collection.find({name}).toArray();
}

export const countByNames = async (names) => {
    return await collection.find({name: {$in: names}}).count();

}

export const findByMinScore = async (exam, minScore) => {
    return await collection.find({['scores.' + exam.toLowerCase()]: {$gte: +minScore}}).toArray();
}

export const getAllStudents = async () => {
    const students = await collection.find().toArray();
    students.sort((a, b) => a._id - b._id);
    return students.map(student => ({...student, password: undefined}));
}
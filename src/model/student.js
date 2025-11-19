import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
        _id: {type: Number, required: true},
        name: {type: String, required: true},
        password: {type: String, required: true},
        scores: {
            type: Map,
            key: String,
            of: Number,
            default: {}
        }
    },
    {
        versionKey: false, _id: false,
        toJSON: {
            transform: (doc, ret) => {
                ret.id = ret._id;
                ret.name;
                delete ret._id;
                delete ret.password;
                return ret
            }
        }
    }
);

const Student = mongoose.model('Student', studentSchema, 'students');
export default Student;


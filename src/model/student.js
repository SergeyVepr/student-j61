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
        versionKey: false, id: true,
        toJSON: {
            transform: (doc, ret) => {
                ret.id = ret._id;
                ret.name;
                ret._id = undefined;
                ret.password = undefined
                return ret;
            }
        }
    }
);

const Student = mongoose.model('Student', studentSchema, 'college');
export default Student;


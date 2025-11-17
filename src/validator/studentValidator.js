import joi from 'joi';

export const studentSchema = joi.object({
    id: joi.number().required(),
    name: joi.string().required(),
    password: joi.string().required() || joi.string().not('').required()
    }
)

export const updateStudentSchema = joi.object({
    name: joi.string(),
    password: joi.string()
});

export const scoreSchema = joi.object({
    exam: joi.string().required(),
    score: joi.number().min(0).max(100).required()
})
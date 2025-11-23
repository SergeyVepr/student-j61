// Tests for schemas in studentValidator
import {describe, it, expect} from '@jest/globals'
import {studentSchema, updateStudentSchema, scoreSchema} from '../validator/studentValidator.js'

describe('studentValidator', () => {
  describe('studentSchema', () => {
    it('validates a correct object', () => {
      const {error, value} = studentSchema.validate({ id: 1, name: 'Ann', password: 'secret' })
      expect(error).toBeUndefined()
      expect(value).toMatchObject({ id: 1, name: 'Ann', password: 'secret' })
    })

    it('error when required fields are missing', () => {
      const {error} = studentSchema.validate({})
      expect(error).toBeDefined()
      expect(error.details[0].message).toBeTruthy()
    })

    it('error when id is not a number', () => {
      const {error} = studentSchema.validate({ id: 'x', name: 'Ann', password: 'p' })
      expect(error).toBeDefined()
    })
  })

  describe('updateStudentSchema', () => {
    it('allows an empty object (no changes)', () => {
      const {error} = updateStudentSchema.validate({})
      expect(error).toBeUndefined()
    })

    it('validates name update', () => {
      const {error, value} = updateStudentSchema.validate({ name: 'Bob' })
      expect(error).toBeUndefined()
      expect(value.name).toBe('Bob')
    })

    it('error when password is not a string', () => {
      const {error} = updateStudentSchema.validate({ password: 123 })
      expect(error).toBeDefined()
    })
  })

  describe('scoreSchema', () => {
    it('validates score boundaries (0 and 100)', () => {
      expect(scoreSchema.validate({ exam: 'math', score: 0 }).error).toBeUndefined()
      expect(scoreSchema.validate({ exam: 'math', score: 100 }).error).toBeUndefined()
    })

    it('error when score is out of range', () => {
      expect(scoreSchema.validate({ exam: 'math', score: -1 }).error).toBeDefined()
      expect(scoreSchema.validate({ exam: 'math', score: 101 }).error).toBeDefined()
    })

    it('error when required fields are missing', () => {
      expect(scoreSchema.validate({}).error).toBeDefined()
    })
  })
})

// Integration tests for controller with mocked service layer and supertest
import {beforeEach, describe, expect, it, jest} from '@jest/globals'
import express from 'express'
import request from 'supertest'

// Prepare service layer mocks
const serviceMocks = {
  addStudent: jest.fn(),
  findStudent: jest.fn(),
  deleteStudent: jest.fn(),
  updateStudent: jest.fn(),
  addScore: jest.fn(),
  findByName: jest.fn(),
  countByNames: jest.fn(),
  findByMinScore: jest.fn(),
  getAllStudents: jest.fn(),
}

// Mock the service module before dynamically importing the router
jest.unstable_mockModule('../service/studentService.js', () => ({
  __esModule: true,
  ...serviceMocks,
}))

// Dynamically import the router when mocks are ready
const studentRouter = (await import('../routes/studentRoutes.js')).default

function makeApp() {
  const app = express()
  app.use(express.json())
  app.use(studentRouter)
  return app
}

describe('studentController routes', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('POST /student', () => {
    it('201 when addStudent returns true', async () => {
      serviceMocks.addStudent.mockResolvedValueOnce(true)
      const app = makeApp()
      const res = await request(app)
        .post('/student')
        .send({ id: 10, name: 'Neo', password: 'matrix' })
      expect(res.status).toBe(201)
      expect(serviceMocks.addStudent).toHaveBeenCalledWith({ id: 10, name: 'Neo', password: 'matrix' })
    })

    it('409 when student already exists', async () => {
      serviceMocks.addStudent.mockResolvedValueOnce(false)
      const app = makeApp()
      const res = await request(app)
        .post('/student')
        .send({ id: 11, name: 'Trinity', password: 'pwd' })
      expect(res.status).toBe(409)
    })

    it('400 when request body fails validation', async () => {
      const app = makeApp()
      const res = await request(app)
        .post('/student')
        .send({ name: 'NoIdOrPwd' })
      expect(res.status).toBe(400)
      expect(res.body.error).toBeTruthy()
      expect(serviceMocks.addStudent).not.toHaveBeenCalled()
    })
  })

  describe('GET /student/:id', () => {
    it('200 and object when found', async () => {
      serviceMocks.findStudent.mockResolvedValueOnce({ _id: 1, name: 'A' })
      const app = makeApp()
      const res = await request(app).get('/student/1')
      expect(res.status).toBe(200)
      expect(res.body).toMatchObject({ _id: 1, name: 'A' })
    })

    it('404 and string Not found when not found', async () => {
      serviceMocks.findStudent.mockResolvedValueOnce(null)
      const app = makeApp()
      const res = await request(app).get('/student/999')
      expect(res.status).toBe(404)
      expect(res.body).toBe('Not found')
    })
  })

  describe('PATCH /student/:id', () => {
    it('400 for invalid request body', async () => {
      const app = makeApp()
      const res = await request(app)
        .patch('/student/2')
        .send({ name: 123 })
      expect(res.status).toBe(400)
      expect(serviceMocks.updateStudent).not.toHaveBeenCalled()
    })

    it('200 and transformed object on successful update', async () => {
      serviceMocks.updateStudent.mockResolvedValueOnce({ id: 2, name: 'B' })
      const app = makeApp()
      const res = await request(app)
        .patch('/student/2')
        .send({ name: 'B' })
      expect(res.status).toBe(200)
      expect(res.body).toMatchObject({ id: 2, name: 'B' })
    })

    it('404 when service returned null', async () => {
      serviceMocks.updateStudent.mockResolvedValueOnce(null)
      const app = makeApp()
      const res = await request(app)
        .patch('/student/3')
        .send({ name: 'C' })
      expect(res.status).toBe(404)
    })
  })

  describe('PATCH /score/student/:id', () => {
    it('400 for invalid score', async () => {
      const app = makeApp()
      const res = await request(app)
        .patch('/score/student/1')
        .send({ exam: 'math', score: 1000 })
      expect(res.status).toBe(400)
      expect(serviceMocks.addScore).not.toHaveBeenCalled()
    })

    it('200 and service payload for valid request', async () => {
      serviceMocks.addScore.mockResolvedValueOnce({ _id: 1, scores: { math: 90 } })
      const app = makeApp()
      const res = await request(app)
        .patch('/score/student/1')
        .send({ exam: 'math', score: 90 })
      expect(res.status).toBe(200)
      expect(res.body).toMatchObject({ _id: 1, scores: { math: 90 } })
    })
  })

  describe('GET /quantity/students', () => {
    it('returns count for array of names', async () => {
      serviceMocks.countByNames.mockResolvedValueOnce(3)
      const app = makeApp()
      const res = await request(app).get('/quantity/students?names=A&names=B')
      expect(res.status).toBe(200)
      expect(res.body).toBe(3)
      expect(serviceMocks.countByNames).toHaveBeenCalledWith(['A', 'B'])
    })
  })

  describe('GET /students/exam/:exam/minscore/:minScore', () => {
    it('proxies service response', async () => {
      const payload = [{ _id: 7, name: 'G' }]
      serviceMocks.findByMinScore.mockResolvedValueOnce(payload)
      const app = makeApp()
      const res = await request(app).get('/students/exam/math/minscore/70')
      expect(res.status).toBe(200)
      expect(res.body).toEqual(payload)
      expect(serviceMocks.findByMinScore).toHaveBeenCalledWith('math', 70)
    })
  })

  describe('GET /students', () => {
    it('returns all students', async () => {
      const list = [{ _id: 1 }, { _id: 2 }]
      serviceMocks.getAllStudents.mockResolvedValueOnce(list)
      const app = makeApp()
      const res = await request(app).get('/students')
      expect(res.status).toBe(200)
      expect(res.body).toEqual(list)
    })
  })
})

// The Arrange Act Assert pattern (AAA)
// ESM + Jest tests for studentService with mocked studentRepository

import {beforeEach, describe, expect, it, jest} from '@jest/globals'

// Prepare a manual mock of the repository used by the service
const repoMocks = {
  findStudentById: jest.fn(),
  createStudent: jest.fn(),
  deleteStudent: jest.fn(),
  updateStudent: jest.fn(),
  updateStudentScores: jest.fn(),
  findStudentsByName: jest.fn(),
  countStudentsByName: jest.fn(),
  findStudentByMinScore: jest.fn(),
  getAllStudents: jest.fn(),
}

// Mock the module path exactly as it is imported inside studentService.js
jest.unstable_mockModule('../repository/studentRepository.js', () => ({
  __esModule: true,
  ...repoMocks,
}))

// Dynamically import the service AFTER the mock is set up
const service = await import('../service/studentService.js')

describe('studentService with mocked repository', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('addStudent', () => {
    it('returns false when student already exists and does not create', async () => {
      repoMocks.findStudentById.mockResolvedValueOnce({ _id: 1 })

      const ok = await service.addStudent({ id: 1, name: 'A', password: 'p' })

      expect(ok).toBe(false)
      expect(repoMocks.createStudent).not.toHaveBeenCalled()
      expect(repoMocks.findStudentById).toHaveBeenCalledWith(1)
    })

    it('creates a new student and returns true when not exists', async () => {
      repoMocks.findStudentById.mockResolvedValueOnce(null)
      repoMocks.createStudent.mockResolvedValueOnce({ _id: 2, name: 'B' })

      const ok = await service.addStudent({ id: 2, name: 'B', password: 'secret' })

      expect(ok).toBe(true)
      expect(repoMocks.createStudent).toHaveBeenCalledWith({ _id: 2, name: 'B', password: 'secret' })
    })
  })

  it('findStudent proxies to repository', async () => {
    repoMocks.findStudentById.mockResolvedValueOnce({ _id: 3, name: 'C' })
    const res = await service.findStudent(3)
    expect(res).toEqual({ _id: 3, name: 'C' })
    expect(repoMocks.findStudentById).toHaveBeenCalledWith(3)
  })

  it('deleteStudent proxies to repository', async () => {
    repoMocks.deleteStudent.mockResolvedValueOnce({ _id: 4 })
    const res = await service.deleteStudent(4)
    expect(res).toEqual({ _id: 4 })
    expect(repoMocks.deleteStudent).toHaveBeenCalledWith(4)
  })

  describe('updateStudent', () => {
    it('returns transformed victim with id instead of _id and scores undefined', async () => {
      // Simulate repo.updateStudent returning a Mongoose-like query with .lean()
      const updated = { _id: 5, name: 'D', scores: { math: 100 } }
      repoMocks.updateStudent.mockReturnValueOnce({
        lean: () => Promise.resolve({ ...updated }),
      })

      const res = await service.updateStudent(5, { name: 'D' })

      expect(repoMocks.updateStudent).toHaveBeenCalledWith(5, { name: 'D' })
      expect(res).toMatchObject({ id: 5, name: 'D' })
      expect(res._id).toBeUndefined()
      expect(res.scores).toBeUndefined()
    })

    it('returns null when repository returns nothing', async () => {
      repoMocks.updateStudent.mockReturnValueOnce({
        lean: () => Promise.resolve(null),
      })

      const res = await service.updateStudent(6, { name: 'E' })
      expect(res).toBeNull()
    })
  })

  it('addScore proxies to repository', async () => {
    repoMocks.updateStudentScores.mockResolvedValueOnce({ _id: 7, scores: { math: 90 } })
    const res = await service.addScore(7, 'math', 90)
    expect(res).toEqual({ _id: 7, scores: { math: 90 } })
    expect(repoMocks.updateStudentScores).toHaveBeenCalledWith(7, 'math', 90)
  })

  it('findByName proxies to repository', async () => {
    repoMocks.findStudentsByName.mockResolvedValueOnce([{ _id: 8, name: 'Ann' }])
    const res = await service.findByName('Ann')
    expect(res).toEqual([{ _id: 8, name: 'Ann' }])
    expect(repoMocks.findStudentsByName).toHaveBeenCalledWith('Ann')
  })

  it('countByNames proxies to repository', async () => {
    repoMocks.countStudentsByName.mockResolvedValueOnce(3)
    const res = await service.countByNames(['A', 'B'])
    expect(res).toBe(3)
    expect(repoMocks.countStudentsByName).toHaveBeenCalledWith(['A', 'B'])
  })

  it('findByMinScore proxies to repository', async () => {
    repoMocks.findStudentByMinScore.mockResolvedValueOnce([{ _id: 9 }])
    const res = await service.findByMinScore('math', 70)
    expect(res).toEqual([{ _id: 9 }])
    expect(repoMocks.findStudentByMinScore).toHaveBeenCalledWith('math', 70)
  })

  it('getAllStudents proxies to repository', async () => {
    repoMocks.getAllStudents.mockResolvedValueOnce([{ _id: 1 }, { _id: 2 }])
    const res = await service.getAllStudents()
    expect(res).toEqual([{ _id: 1 }, { _id: 2 }])
    expect(repoMocks.getAllStudents).toHaveBeenCalled()
  })
})

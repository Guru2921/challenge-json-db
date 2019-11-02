const express = require('express')
const router = express.Router()
const apiController = require('./controllers/api')
router.put('/:studentId/', apiController.putStudent)
router.get('/:studentId/', apiController.getStudent)
router.put('/:studentId/*', apiController.putStudentProperty)
router.get('/:studentId/*', apiController.getStudentProperty)
router.delete('/:studentId/*', apiController.deleteStudentProperty)
module.exports = [
  router
]

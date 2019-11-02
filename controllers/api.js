'use strict'
const fs = require('fs')
module.exports = {
  putStudent,
  getStudent,
  putStudentProperty,
  getStudentProperty,
  deleteStudentProperty
}

// FILTER EMPTY ELEMENTS
function filterEmpty (arr) {
  var filteredArr = []
  for (var i = 0; i < arr.length; i++) {
    if (arr[i] !== '') {
      filteredArr.push(arr[i])
    }
  }
  return filteredArr
}

// CHECK IF VALARIABLE IS STRING OR NOT
function isTypeString (param) {
  if (typeof param === 'string' || param instanceof String) {
    return true
  } else {
    return false
  }
}

// PUT STUDENT
async function putStudent (req, res, next) {
  let studentId = req.params.studentId
  let propertyContent = req.body
  let filePath = 'data/' + studentId + '.json'
  try {
    fs.access(filePath, function (error) {
      // File exist
      if (!error) {
        fs.readFile(filePath, 'utf8', (err, data) => {
          if (err) {
            res.send({ status: 404, message: err })
          } else {
            try {
              let fileContent
              fileContent = JSON.parse(data)
              let propertyItem = fileContent
              for (var key in propertyContent) {
                propertyItem[key] = propertyContent[key]
              }
              let fileContentStr = JSON.stringify(fileContent)
              fs.writeFile(filePath, fileContentStr, 'utf8', (err) => {
                if (err) throw err
                res.send({ status: 200, message: 'put student suceed' })
              })
            } catch (e) { console.log(e); res.send({ status: 404, message: e }) }
          }
        })
      } else { // File Not Exist
        try {
          let fileContent = {}
          for (var key in propertyContent) {
            fileContent[key] = propertyContent[key]
          }
          let fileContentStr = JSON.stringify(fileContent)
          fs.writeFile(filePath, fileContentStr, (err) => {
            if (err) throw err
            res.send({ status: 200, message: 'add student suceed' })
          })
        } catch (e) {
          console.log(e)
          res.send({ status: 404, message: e })
        }
      }
    })
  } catch (e) { return res.send({ status: 404, message: 'file checking error' }) }
}

// GET STUDENT
async function getStudent (req, res, next) {
  let studentId = req.params.studentId
  let filePath = 'data/' + studentId + '.json'
  try {
    fs.access(filePath, function (error) {
      // File exist
      if (!error) {
        fs.readFile(filePath, 'utf8', (err, data) => {
          if (!err) {
            let fileContent
            fileContent = JSON.parse(data)
            res.send(fileContent)
          }
        })
      } else { // File Not Exist
        res.send({ 'status': 404, message: 'file not exist' })
      }
    })
  } catch (e) { res.send({ status: 404, message: 'file checking error' }) }
}

// PUT STUDENT PROPERTY
async function putStudentProperty (req, res, next) {
  let studentId = req.params.studentId
  let properties = req.params[0].split('/')
  properties = filterEmpty(properties)
  let propertyContent = req.body
  let filePath = 'data/' + studentId + '.json'
  try {
    fs.access(filePath, function (error) {
      // File exist
      if (!error) {
        fs.readFile(filePath, 'utf8', (err, data) => {
          if (err) {
            res.send({ status: 404, message: err })
          } else {
            try {
              let fileContent
              fileContent = JSON.parse(data)
              let propertyItem = fileContent
              for (var i = 0; i < properties.length; i++) {
                var property = properties[i]
                if (propertyItem.hasOwnProperty(property)) {
                  if (isTypeString(propertyItem[property])) {
                    propertyItem[property] = {}
                    propertyItem = propertyItem[property]
                  } else { propertyItem = propertyItem[property] }
                } else {
                  propertyItem[property] = {}
                  propertyItem = propertyItem[property]
                }
              }
              for (var key in propertyContent) {
                propertyItem[key] = propertyContent[key]
              }
              let fileContentStr = JSON.stringify(fileContent)
              fs.writeFile(filePath, fileContentStr, 'utf8', (err) => {
                if (err) throw err
                console.log(fileContent + ' written to ' + filePath)
                res.send({ status: 200, message: 'put property succeed' })
              })
            } catch (e) { console.log(e); res.send({ status: 404, message: e }) }
          }
        })
      } else { // File Not Exist
        try {
          var fileContent = {}
          var propertyItem = fileContent
          for (var i = 0; i < properties.length; i++) {
            var property = properties[i]
            propertyItem[property] = {}
            propertyItem = propertyItem[property]
          }
          for (var key in propertyContent) {
            propertyItem[key] = propertyContent[key]
          }
          fileContent = JSON.stringify(fileContent)
          fs.writeFile(filePath, fileContent, (err) => {
            if (err) throw err
            res.send({ status: 200, message: 'put property succeed' })
          })
        } catch (e) {
          res.send({ status: 404, message: e })
        }
      }
    })
  } catch (e) { return { status: 404, message: 'file checking error' } }
}

// GET STUDENT PROPERTY
async function getStudentProperty (req, res, next) {
  let studentId = req.params.studentId
  let properties = req.params[0].split('/')
  properties = filterEmpty(properties)
  let filePath = 'data/' + studentId + '.json'
  try {
    fs.access(filePath, function (error) {
      // File exist
      if (!error) {
        fs.readFile(filePath, 'utf8', (err, data) => {
          if (!err) {
            let fileContent
            fileContent = JSON.parse(data)
            let propertyItem = fileContent
            let isExistProperty = true
            try {
              properties.forEach(property => {
                if (propertyItem.hasOwnProperty(property)) {
                  propertyItem = propertyItem[property]
                } else {
                  isExistProperty = false
                }
              })
              if (isExistProperty) {
                res.send(propertyItem)
              } else {
                res.send({ status: 404, message: 'property not exist' })
              }
            } catch (e) { res.send({ status: 404, message: 'property not found' }) }
          }
        })
      } else { // File Not Exist
        res.send({ 'status': 404, message: 'file not exist' })
      }
    })
  } catch (e) { res.send({ status: 404, message: 'file checking error' }) }
}

// DELETE STUDENT PROPERTY
async function deleteStudentProperty (req, res, next) {
  let studentId = req.params.studentId
  let properties = req.params[0].split('/')
  properties = filterEmpty(properties)
  let filePath = 'data/' + studentId + '.json'
  try {
    fs.access(filePath, function (error) {
      // File exist
      if (!error) {
        fs.readFile(filePath, 'utf8', (err, data) => {
          if (!err) {
            let fileContent
            fileContent = JSON.parse(data)
            let propertyItem = fileContent
            let isExistProperty = true
            try {
              for (var i = 0; i < properties.length - 1; i++) {
                var property = properties[i]
                if (propertyItem.hasOwnProperty(property)) {
                  propertyItem = propertyItem[property]
                } else {
                  isExistProperty = false
                }
              }
              if (isExistProperty) {
                var lastProperty = properties[properties.length - 1]
                if (propertyItem.hasOwnProperty(lastProperty)) {
                  delete propertyItem[lastProperty]
                  fileContent = JSON.stringify(fileContent)
                  fs.writeFile(filePath, fileContent, (err) => {
                    if (err) throw err
                    res.send({ status: 200, message: 'property removed' })
                  })
                } else {
                  res.send({ status: 404, message: 'property not exist' })
                }
              } else {
                res.send({ status: 404, message: 'property not exist' })
              }
            } catch (e) { res.send({ status: 404, message: 'property not found' }) }
          }
        })
      } else { // File Not Exist
        res.send({ 'status': 404, message: 'file not exist' })
      }
    })
  } catch (e) { res.send({ status: 404, message: 'file checking eror' }) }
}

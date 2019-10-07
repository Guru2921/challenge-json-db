const express = require('express')
const bodyParser = require('body-parser')

const api = require('./api')
const middleware = require('./middleware')
const PORT = process.env.PORT || 1337
const app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended : true}))
app.use(express.json({ extended : true}))

/*-------------  REST APIS -------------*/
app.put('/:studentId/', api.putStudent)
app.get('/:studentId/', api.getStudent)
app.put('/:studentId/*', api.putStudentProperty)
app.get('/:studentId/*', api.getStudentProperty)
app.delete('/:studentId/*', api.deleteStudentProperty)

/*-------------  MIDDLEWARES -------------*/
app.use(middleware.handleError)
app.use(middleware.notFound)

const server = app.listen(PORT, () =>
  console.log(`Server listening on port ${PORT}`)
)

if (require.main !== module) {
  module.exports = server
}

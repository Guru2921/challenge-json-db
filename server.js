const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const router = require('./router')
const middleware = require('./middleware')
const PORT = process.env.PORT || 1337

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.json({ extended: true }))
app.use(router)
/* -------------  MIDDLEWARES ------------- */
app.use(middleware.handleError)
app.use(middleware.notFound)

const server = app.listen(PORT, () =>
  console.log(`Server listening on port ${PORT}`)
)

if (require.main !== module) {
  module.exports = server
}

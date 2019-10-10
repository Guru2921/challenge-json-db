const tape = require('tape')
const jsonist = require('jsonist')

const port = (process.env.PORT = process.env.PORT || require('get-port-sync')())
const endpoint = `http://localhost:${port}`
const server = require('./server')

/* ---------------- API CHECKING ------------------- */
tape('rest', async function (t) {
  var student = {
    id: 'ivan',
    name: 'ivan',
    gender: 'male'
  }
  var property1 = {
    a: 1,
    b: 2,
    c: 3,
    d: 4
  }
  var property2 = {
    x: 'test1',
    y: 'test1',
    z: 'test3'
  }

  // PUT CHECKING
  jsonist.put(`${endpoint}/${student.id}`, student, (err, body) => {
    if (err) t.error(err)
    t.ok(body.status === 200, 'PUT STUDENT CHECK')
    jsonist.put(`${endpoint}/${student.id}/math`, property1, (err, body) => {
      if (err) t.error(err)
      t.ok(body.status === 200, 'PUT PROPERTY CHECK')
      jsonist.put(`${endpoint}/${student.id}/math/section1/title1/`, property2, (err, body) => {
        if (err) t.error(err)
        t.ok(body.status === 200, 'PUT NESTED PROPERTY CHECK')
      })
    })
  })

  function sleep (ms) {
    return new Promise(resolve => setTimeout(resolve, ms))
  }

  await sleep(1000)

  // GET CHECKING
  jsonist.get(`${endpoint}/${student.id}`, (err, body) => {
    if (err) t.error(err)
    t.ok(body['id'] === student.id, 'GET STUDENT CHECK')
  })
  jsonist.get(`${endpoint}/ivan/math`, (err, body) => {
    if (err) t.error(err)
    t.ok(body['a'] === 1, 'GET PROPERTY CHECK')
  })
  jsonist.get(`${endpoint}/ivan/math/section1/title1/`, (err, body) => {
    if (err) t.error(err)
    t.ok(body['x'] === 'test1', 'GET NESTED PROPERTY CHECK')
  })
  jsonist.get(`${endpoint}/ivan1`, (err, body) => {
    if (err) t.error(err)
    t.ok(body['status'] === 404, 'GET NO FILE CHECK')
  })
  jsonist.get(`${endpoint}/ivan1`, (err, body) => {
    if (err) t.error(err)
    t.ok(body['status'] === 404, 'GET NO FILE CHECK')
  })
  jsonist.get(`${endpoint}/ivan/english/dialog`, (err, body) => {
    if (err) t.error(err)
    t.ok(body['status'] === 404, 'GET NO PROPERTY CHECK')
  })
  jsonist.get(`${endpoint}/ivan/english/grammar/present`, (err, body) => {
    if (err) t.error(err)
    t.ok(body['status'] === 404, 'GET NO PROPERTY CHECK')
  })

  await sleep(1000)

  // DELETE CHECKING
  jsonist.delete(`${endpoint}/ivan/math`, (err, body) => {
    if (err) t.error(err)
    t.ok(body['status'] === 200, 'DELETE PROPERTY CHECK')
  })

  jsonist.delete(`${endpoint}/ivan1/math`, (err, body) => {
    if (err) t.error(err)
    t.ok(body['status'] === 404, 'DELETE FILE NOT FOUND')
  })

  jsonist.delete(`${endpoint}/ivan/english/grammar`, (err, body) => {
    if (err) t.error(err)
    t.ok(body['status'] === 404, 'DELETE PROPERTY NOT FOUND')
  })

  jsonist.delete(`${endpoint}/ivan/english/talking`, (err, body) => {
    if (err) t.error(err)
    t.ok(body['status'] === 404, 'DELETE PROPERTY NOT FOUND')
  })

  jsonist.delete(`${endpoint}/ben/english/talking`, (err, body) => {
    if (err) t.error(err)
    t.ok(body['status'] === 404, 'DELETE PROPERTY NOT FOUND')
  })

  await sleep(1000)
  t.end()
})

tape('cleanup', function (t) {
  server.close()
  t.end()
})

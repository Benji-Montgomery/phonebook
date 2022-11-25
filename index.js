const express = require('express')
const app = express()
const morgan = require('morgan')
const cors = require('cors')
let persons =[
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

//const requestLogger = (request, response, next) => {
//  console.log('Method:', request.method)
//  console.log('Path: ', request.path)
//  console.log('Body: ', request.body)
//  console.log('---')
//  next()
//}

app.use(express.json())
app.use(cors())
app.use(express.static('build'))
morgan.token('type', function (req, res) { return req.headers['content-type'] })

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :type'))

//app.use(requestLogger)

app.post('/api/persons', (request, response) =>{
  const body = request.body
  const name = body.name
  const number = body.number

  morgan.token('type', function (request, res) { return JSON.stringify(request['body']) })

  for(let i = 0; i< persons.length; i++){
    if(body.name === persons[i].name){
      return response.status(400).json({
        error: 'name already in database'
      })
    }
  }
  if(!name){
    return response.status(400).json({
      error: 'name missing'
    })
  }
  if(!number){
    return response.status(400).json({
      error: 'number missing'
    })
  }

  const person = {
    id: Math.random(),
    name: body.name,
    number: body.number
  }
  console.log(body)
  persons = persons.concat(person)
  response.json(person)
})

console.log(persons.length)


app.get('/', (request, response) =>{
    response.send('<h1>Hello Same!</h1>')
})
app.get('/api/persons', (request, response) => {
    response.json(persons)
})
app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id)
  const person = persons.find(person => {
    return person.id === id
  })
  if(person){
    response.json(person)
  }else{
    response.status(404).end()
  }
  response.json(person)

})
app.get('/info', (request, response) =>{
  const infopage = ('Phonebook has info for '+ persons.length + ' people')
  const reqDate = (new Date())
  const newDate= (`<h4> </h4><div>${reqDate}</div>`)
  const newPort = (`<h3></h3><h3>Server is running on ${PORT}</h3>`)
  response.send(infopage+newDate+newPort)
})

app.delete('/api/persons/:id', (request, response) =>{
  const id = Number(request.params.id)
  persons = persons.filter(person => person.id !== id)

  response.status(204).end()
})


const PORT = process.env.PORT || 3001
console.log('ffffffffffffffff')
app.listen(PORT, () => {
  console.log(`server running on port ${PORT}`)
})
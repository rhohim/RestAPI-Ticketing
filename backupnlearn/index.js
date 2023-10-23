const express = require('express')
const app = express()
const port = 3000

// for receive data from json raw postman
const bodyparser = require('body-parser')
app.use(bodyparser.json())

// call router
const participanRoute = require("./routes/participan")


// endpoint for route
app.use('/pasarkol/participan', participanRoute)



app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
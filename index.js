const getDispo = require('./getDispo')

const stadiums = ['Alain Mimoun', 'Carnot']

const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const app = express()
app.use(cors())
app.use(bodyParser.json())
const port = process.env.PORT || 3333

app.post('/', async (req, res) => {
    const dispos = await getDispo(req.body.stadiums)
    res.send(dispos) // todo ; custom list
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})
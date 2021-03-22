const express = require('express')
const fs = require('fs')

const app = express()

const port = 5000

app.get('/api/users', (req, res) => {
    fs.readFile('./config.txt', 'utf-8', (err, data) => {
        res.json(data).status(200)
        console.log(err)
    })
})
app.get('/api/game', (req, res) => {
    fs.readFile('./configGame.txt', 'utf-8', (err, data) => {
        res.json(data).status(200)
        console.log(err)
    })
})

app.post('/api/users/:data', (req, res) => {
 fs.writeFile('./config.txt', req.params.data, err => {
        console.log(err)  })
    res.status(200).send('updated')
})

app.listen(port, () => console.log('Server started on port ' + port))


// server.js
const path = require('path')
const express = require('express')
const app = express()
const ejs = require('ejs')
const reptile = require('./reptile')

app.set('views', './views')
app.set('view engine', '.ejs')
app.use(express.static(path.join(__dirname, 'public')))

app.get('/', (req, res) => {
  reptile.posts(1, posts => {
    res.render('index', { posts })
  })
})

app.get('/page/:index', (req, res) => {
  const page = Number(req.params.index)
  reptile.posts(page, posts => {
    res.send(posts)
  })
})

app.get('/post/*', (req, res) => {
  const url = req.url.replace('/post/', '')
  reptile.detail(url, post => {
    res.render('detail', { post })
  })
})

app.listen(3000, () => {
  console.log('server is running at localhost:', 3000)
})
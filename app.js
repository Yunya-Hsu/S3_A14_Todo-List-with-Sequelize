const express = require('express')
const exphbs = require('express-handlebars')
const methodOverride = require('method-override')
const session = require('express-session')

const PORT = 3000
const routers = require('./routers/index')
const usePassport = require('./config/passport')

const app = express()

app.engine('handlebars', exphbs({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars')
app.use(session({
  secret: 'asdfghjk',
  resave: false,
  saveUninitialized: true
}))
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))
usePassport(app)

app.use(routers)

app.listen(PORT, () => {
  console.log(`Express is running on localhost: ${PORT}`)
})

import createError from 'http-errors'
import express from 'express'
import cookieParser from 'cookie-parser'
import logger from 'morgan'
import monk from 'monk'
import path from 'path'
import usersRouter from './routes/users.js'

// ##### IMPORTANT
// ### Your backend project has to switch the MongoDB port like this
// ### Thus copy paste this block to your project
const MONGODB_PORT = process.env.DBPORT || '27017'
const db = monk(`127.0.0.1:${MONGODB_PORT}/omm-ws2223`) // connect to database omm-2021
console.log(`Connected to MongoDB at port ${MONGODB_PORT}`)
// ######

const PORT = process.env.PORT || 3001

const app = express()
const __dirname = path.resolve()

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())

app.use(function (req, res, next) {
    req.db = db
    next()
})

app.use(express.static(path.join(__dirname, '../client/public')))
app.use('/users', usersRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404))
})

app.listen(PORT, () => {
    console.log('')
    console.log('Server is running')
})

app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message
    res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    res.status(err.status || 500)
    res.render('error')
})

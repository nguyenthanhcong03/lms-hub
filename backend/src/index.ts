import bodyParser from 'body-parser'
import express, { Request, Response, NextFunction, ErrorRequestHandler } from 'express'
import helmet from 'helmet'
import createError from 'http-errors'

import cors from 'cors'

import compression from 'compression'

import dotenv from 'dotenv'

import { statusCodes } from './constants/status-codes'
import { UnprocessableEntityError } from './core/error.response'
import Database from './db/init.mongodb'
import initialRouter from './routers'

dotenv.config()

const app = express()

app.use(helmet())
app.use(compression())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

// Properly invoke the MongoDB instance
Database.getInstance()

//init router
initialRouter(app)

//handle error

app.use((req: Request, res: Response, next: NextFunction) => {
  return next(createError(404, 'Not Found'))
})

const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
  const status = err.status || statusCodes.INTERNAL_SERVER_ERROR

  const errorResponse: {
    message: string
    status: number
    typeError: string
    statusMessage: string
    errors?: { field: string; message: string }[]
  } = {
    message: err.message || 'Something went wrong',
    status,
    typeError: err.typeError || 'INTERNAL_SERVER_ERROR',
    statusMessage: err.statusMessage || 'error'
  }

  if (err instanceof UnprocessableEntityError) {
    errorResponse.errors = err.errors
  }

  res.status(status).json(errorResponse)
  return
}

app.use(errorHandler)

app.listen(process.env.PORT || 8888, () => {
  console.log('Server is listening on port ' + process.env.PORT)
})

const express = require('express')
require('express-async-errors')

const { PORT } = require('./util/config')
const { connectToDatabase } = require('./util/db')

const routerBlog = require("./controllers/blogs")
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const authorRouter = require('./controllers/author')
const readinglistsRouter = require('./controllers/readinglists')

const app = express()

app.use(express.json())

app.use('/api/blogs', routerBlog)
app.use('/api/users', usersRouter)
app.use('/api/authors', authorRouter)
app.use('/api/readinglists', readinglistsRouter)
app.use('/api', loginRouter)

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: "unknown endpoint" });
};

app.use(unknownEndpoint);

const errorHandler = (error,request,response,next) => {
    // console.log(error.message);
    // console.log(error.name);

    if(error.name === "Error"){
        return response.status(400).send({ error:error.message });
    }else if(error.name === "SequelizeValidationError"){
        return response.status(400).send({ error:error.message });
    }else if(error.name === "SequelizeUniqueConstraintError"){
        return response.status(400).send({ error:error.message });
    }else if(error.name === "SequelizeEagerLoadingError"){
        return response.status(400).send({ error:error.message });
    }

    next(error);
};

app.use(errorHandler);

const start = async () => {
    await connectToDatabase()
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`)
    })
}

start()
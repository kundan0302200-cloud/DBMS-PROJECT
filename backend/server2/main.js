import express from 'express'
import dotenv from 'dotenv'
import {conn} from './config/connectDB.js'
import taskController from './controller/controller.js'

dotenv.config({ quiet: true })

const app = express()
app.use(express.json())

//routing to task controller
app.use('/task', taskController)
app.use('/tasks', taskController)

app.get("/", (req, res)=>{
    res.json({"code": 200, "message": "server is running!"})
});

const PORT = process.env.PORT || 8002

const startServer = async () => {
    try {
        await conn()
        app.listen(PORT, ()=>{
            console.log("Server running in port http://localhost:"+ PORT )
        })
    } catch (error) {
        console.error('Server not started because MongoDB is unavailable.')
        process.exit(1)
    }
}

startServer()

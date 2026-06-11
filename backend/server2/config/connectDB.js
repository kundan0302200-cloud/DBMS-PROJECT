import mongoose from 'mongoose'
import dotenv from 'dotenv'

dotenv.config({ quiet: true })

const url = process.env.MONGO_URL

let db

export const conn = async () => {
    try{
        if(!url){
            throw new Error('MONGO_URL is missing in .env')
        }

        if(!db){
            db = await mongoose.connect(url, {
                serverSelectionTimeoutMS: 10000
            })
            console.log(`MongoDB connected: ${db.connection.host}/${db.connection.name}`)
        }
        return db
    }catch(err){
        console.error('MongoDB connection failed:', err.message)
        throw err
    }
}

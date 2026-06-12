import { Task } from '../model/task.js'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import * as vectorService from './vectorService.js';
dotenv.config({ quiet: true })

const secret = process.env.SECRET_KEY

const getTokenUserId = (token) => {
    if (!token) {
        return null
    }

    try {
        const payload = jwt.verify(token, secret)
        return payload.id || payload.crid || payload.user_id || null
    } catch (error) {
        const payload = jwt.decode(token)
        return (
            (payload && payload.id) ||
            (payload && payload.crid) ||
            (payload && payload.user_id) ||
            null
        )
    }
}

export const createTask = async(data, token) => {
    let response = {}
    try {
        const creatorId = getTokenUserId(token)

        if (creatorId) {
            data.createdby = creatorId
        }

        if (!data.createdby) {
            return { code: 400, message: 'createdby is required because token does not contain id' }
        }

        await Task.create(data)
        response = { code: 200, message: 'Task created successfully!' }
    } catch (error) {
        response = { code: 500, message: error.message }
    }
    return response
}

export async function getAllTasks(page, size, token) {
    let response

    try {
        const pageNumber = Math.max(Number(page) || 1, 1)
        const pageSize = Math.max(Number(size) || 20, 1)
        const skip = (pageNumber - 1) * pageSize

        const tasks = await Task.find({})
            .skip(skip)
            .limit(pageSize)
            .sort({ createdat: -1 })

        const totalrecords = await Task.countDocuments({})
        response = {
            code: 200,
            page: pageNumber,
            size: pageSize,
            totalpages: Math.ceil(totalrecords / pageSize),
            totalrecords,
            tasks: tasks
        }
    } catch (e) {
        response = {
            code: 500,
            message: e.message
        }
    }

    return response
}

export async function deleteTask(id, token) {
    let response
    try {
        const task = await Task.findByIdAndDelete(id)
        if (!task) {
            return { code: 404, message: "Task not found" }
        }

        response = { code: 200, message: "Task has been deleted" }
    } catch (e) {
        response = { code: 500, message: e.message }
    }
    return response
}

export async function updateTask(id, data, token) {
    let response
    try {
        const { _id, createdby, createdat, updatedat, ...updateData } = data

        const task = await Task.findByIdAndUpdate(
            id,
            updateData, { new: true, runValidators: true }
        )

        if (!task)
            return { code: 404, message: "Task not found" }

        response = { code: 200, message: "Task has been updated" }
    } catch (e) {
        response = { code: 500, message: e.message }
    }
    return response
}
//vector search

export async function vectorSearch(query, token) {
    let response;
    try {
        const payload = jwt.verify(token, secret);
        const queryVector = await vectorService.generateVector(query);

        const tasks = await Tasks.find({ createdby: payload.crid });
        const searchResult = tasks.map(task => {
                const similarity = vectorService.cosineSimilarity(queryVector, task.vector);
                console.log(task.title, similarity);
                return {...task._doc, similarity };

            })
            .filter(task => task.similarity > 0.10)
            .sort((a, b) => b.similarity - a.similarity)
            .slice(0, 5);

        response = { code: 200, task: searchResult };

    } catch (e) {
        response = { code: 500, message: e.message };
    }
    return response;
}
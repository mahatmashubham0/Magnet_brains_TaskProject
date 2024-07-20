import ErrorHandler from "../middlewares/error.js";
// import { Task } from "../models/task.js";

import {Task} from '../models/task.js'
import {User} from '../models/user.js'

// Create a new task
export const createTask = async (req, res) => {
  const { title, description, dueDate, priority, status, user } = req.body;

  if (!title || !description || !dueDate || !priority || !user) {
    return res.status(400).json({ message: 'All fields are required.' });
  }

  try {
    const foundUser = await User.findById(user);
    if (!foundUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const newTask = new Task({ title, description, dueDate, priority, status, user });
    await newTask.save();

    foundUser.tasks.push(newTask);
    await foundUser.save();

    res.status(201).json({
      message: 'Task created successfully',
      task: newTask,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};


// Get all tasks
export const getTasks = async (req, res) => {
  try {
    const { priority, status, page = 1, limit = 10 } = req.query;
    const query = {};

    if (priority) {
      query.priority = priority;
    }

    if (status) {
      query.status = status;
    }

    const tasks = await Task.find(query)
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .exec();

    const totalTasks = await Task.countDocuments(query);
    const totalPages = Math.ceil(totalTasks / limit);

    res.json({
      tasks,
      totalPages,
      currentPage: parseInt(page),
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a single task
export const getTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id).populate('user', 'name email');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};


// Get a single task By usinng Jwt way
export const getSingleTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.user.id).populate('user', 'name email');

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};


// Update a task
export const updateTask = async (req, res) => {
  const { title, description, dueDate, priority, status, user } = req.body;
  console.log("===>",req.body)

  try {
    let task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    task.title = title || task.title;
    task.description = description || task.description;
    task.dueDate = dueDate || task.dueDate;
    task.priority = priority || task.priority;
    task.status = status || task.status;
    task.user = user || task.user;

    await task.save();

    res.status(200).json({ message: 'Task updated successfully', task });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};


// Delete a task

export const deleteTask = async (req, res) => {
  try {
    const{id}=req.params;
    console.log("id",id);;
    const task = await Task.findById(id)
    // const taskUserId = task.user.toString()
    
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    console.log('Task found:', task);
    // console.log('Task user:', taskUserId);


    const userUpdateResult = await User.updateOne({ _id: task.user.toString() }, { $pull: { task: task._id } });
    console.log('User update result:', userUpdateResult);

    await task.deleteOne();

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({ message: 'Server Error', error });
  }
};



// get task based on priority
export const getTasksPriority = async (req, res) => {
  const priority = req.params.status;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  if (!['high', 'medium', 'low'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    const tasks = await Task.find({ priority })
      .skip(skip)
      .limit(limit)
    const totalTasks = await Task.countDocuments({ status });

    res.status(200).json({
      tasks,
      totalPages: Math.ceil(totalTasks / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};

// get task based on priority
export const getTasksByStatus = async (req, res) => {
  const status = req.params.status;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  if (!['pending', 'completed'].includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    const tasks = await Task.find({ status })
      .skip(skip)
      .limit(limit)
    const totalTasks = await Task.countDocuments({ status });

    res.status(200).json({
      tasks,
      totalPages: Math.ceil(totalTasks / limit),
      currentPage: page,
    });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error });
  }
};




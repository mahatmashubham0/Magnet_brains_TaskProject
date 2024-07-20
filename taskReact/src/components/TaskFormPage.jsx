import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchdata, server } from './api';

const TaskForm = () => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('medium');
  const [status, setStatus] = useState('pending');
  const [user, setUser] = useState('');
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (id) {
      fetchTask(id);
    }
  }, [id]);

  const fetchTask = async (taskId) => {
    const response = await axios.get(`${server}/tasks/info/${taskId}`);
    const task = response.data;
    console.log(task);
    setTitle(task.title);
    setDescription(task.description);
    setDueDate(task.dueDate);
    setPriority(task.priority);
    setStatus(task.status);
    setUser(task.user);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const taskData = { title, description, dueDate, priority, status, user };

    if (id) {
      console.log(taskData);
      await axios.put(`${server}/tasks/info/${id}`, taskData);
    } else {
      await axios.post(`${server}/tasks`, taskData);
    }
    fetchdata();
   
    navigate('/tasklist')   
  };

  
   
  

  return (
    <div className="container mx-auto p-4">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
        <h2 className="text-xl font-bold mb-4">{id ? 'Update Task' : 'Add Task'}</h2>
        <div className="mb-4">
          <label className="block text-gray-700">Title</label>
          <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required className="w-full p-2 border rounded"/>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required className="w-full p-2 border rounded"></textarea>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Due Date</label>
          <input type="text" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required className="w-full p-2 border rounded"/>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Priority</label>
          <select value={priority} onChange={(e) => setPriority(e.target.value)} className="w-full p-2 border rounded">
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value)} className="w-full p-2 border rounded">
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">User</label>
          <input type="text" value={user._id} onChange={(e) => setUser(e.target.value)} required className="w-full p-2 border rounded"/>
        </div>
        <button type="submit" className="bg-blue-500 text-white p-2 rounded">{id ? 'Update Task' : 'Add Task'}</button>
      </form>
    </div>
  );
};

export default TaskForm;

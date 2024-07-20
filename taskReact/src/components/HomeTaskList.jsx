import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Pagination from './Pagination';
import { useNavigate } from 'react-router-dom'
import { server } from './api';
import Confirmationmodal from './Confirmationmodal';


const TaskList = () => {
  const [tasks, setTasks] = useState([]); 
  const[confirmationmodal,setConfirmationModal]=useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [priority, setPriority] = useState('');
  const [status, setStatus] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTasks();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPage, priority, status]); 

 const fetchTasks = async () => {
    const response = await axios.get(`${server}/tasks`, {
        params: { priority, status, page: currentPage, limit: 10 },
    });
    setTasks(response.data.tasks);
    setCurrentPage(response.data.currentPage);
    setTotalPages(response.data.totalPages);
  };

  

  const deleteTask = async (id) => {  
    
    console.log("id",id);
    await axios.delete(`${server}/tasks/info/${id}`);
    fetchTasks();          
  };
   
  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return '';
    }
  };

  return (
    <div className="container mx-auto p-4">
  
      <h1 className="text-2xl font-bold mb-4">Task List</h1>
      <div className="flex justify-between mb-4">
        <div>
          <label className="mr-2">Priority:</label>
          <select className="p-2 border" value={priority} onChange={(e) => setPriority(e.target.value)}>
            <option value="">All</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <div>
          <label className="mr-2">Status:</label>
          <select className="p-2 border" value={status} onChange={(e) => setStatus(e.target.value)}>
            <option value="">All</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
          </select>
        </div>
      </div>
      <table className="min-w-full bg-white border-collapse">
        <thead>
          <tr>
            <th className="border p-2">Title</th>
            <th className="border p-2">Due Date</th>
            <th className="border p-2">Status</th>
            <th className="border p-2">Priority</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task._id} className={getPriorityClass(task.priority)}>
              <td className="border p-2">{task.title}</td>
              <td className="border p-2">{task.dueDate}</td>
              <td className="border p-2">{task.status}</td>
              <td className="border p-2">{task.priority}</td>
              <td className="border p-2">
                <button className="bg-red-500 text-white p-1 rounded mr-2" onClick={() => {
                      setConfirmationModal({
                        text1: "Are you sure",
                        text2:
                          " you want to delete this Task",
                        btn1Text: "Delete",
                        btn2Text: "Cancel",
                        btn1Handler: ()=>deleteTask(task._id),
                        btn2Handler:()=>setConfirmationModal(null),
                      })
                    }}>Delete</button>
                <button className="bg-blue-500 text-white p-1 rounded" onClick={() => navigate(`/update/${task._id}`)}>Update</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination currentPage={currentPage} totalPages={totalPages} setCurrentPage={setCurrentPage} />
     { confirmationmodal && <Confirmationmodal modalData={confirmationmodal}/>}
    </div>
  );
};

export default TaskList;


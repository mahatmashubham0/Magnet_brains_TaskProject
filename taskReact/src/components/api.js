import axios from "axios";

export const server = 'http://localhost:4000/api/v1/task'

export const fetchdata=async()=>{
    const response = await axios.get('http://localhost:4000/api/v1/task/tasks', {
    });
    console.log("fetchdata",response)
}  

export const auth={ 
    isAuth:false,
    token:localStorage.getItem('token')
}
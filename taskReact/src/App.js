import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import TaskList from './components/HomeTaskList'
import Header from "./components/Header";
import Login from "./components/Login";
import Signup from "./components/Signup";
import { createContext, useState } from "react";
import TaskForm from "./components/TaskFormPage";

export const Context = createContext({ isAuthenticated: false });

const App = () => {  
  

  const [IsAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({}); 
  

  return (
    <Context.Provider
    value={{
      IsAuthenticated,  // it's used for navigate after navigate move another page
      setIsAuthenticated,
      loading, // it's used for disabble button after cliking
      setLoading,
      user,
      setUser,
    }}
  >
    <Router>
      <Header />
      <Routes>
        <Route path="/" element={<Login/>} /> 
        <Route path="/tasklist" element={<TaskList/>} /> 
        <Route path="/signup" element={<Signup />}/> 
        <Route path="/add" element={<TaskForm />} />
        <Route path="/update/:id" element={<TaskForm />} />
      </Routes>
    </Router>
   </Context.Provider>
  );
}

export default App;

import express from "express";
import {
  createTask,
  deleteTask,
  getSingleTaskById,
  getTask,
  getTasks,
  getTasksByStatus,
  getTasksPriority,
  updateTask,
} from "../controllers/task.js";
import { isAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post('/tasks', createTask);

router.get('/tasks', getTasks);

router.route('/tasks/:status')
      .get(isAuthenticated , getTasksByStatus)

router.route('/tasks/:priority')
    .get(isAuthenticated , getTasksPriority)

router.route('/tasks/:priority')
    .get(isAuthenticated , getSingleTaskById)


router.get('/tasks/info/:id', getTask);
router.put('/tasks/info/:id', updateTask);
router.delete('/tasks/info/:id',  deleteTask);

export default router;

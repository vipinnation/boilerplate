import express, { Request, Response } from 'express';
import { branchRoutes } from './branches.routes';
import { schoolRoutes } from './school.routes';
import { parentRoutes } from './parent.routes';
import { studentRoutes } from './students.routes';
import { teacherRoutes } from './teacher.routes';
import { staffRoutes } from './staff.routes';

const routes = express.Router();


routes.get('/', (req: Request, res: Response) => {
    try {
        res.send('Welcome to Graphical Api version 1.0 ');
    } catch (error) {
    }
});




routes.use("/branches", branchRoutes)
routes.use("/schools", schoolRoutes)
routes.use("/parents", parentRoutes)
routes.use("/students", studentRoutes)
routes.use("/teachers", teacherRoutes)
routes.use("/staff", staffRoutes)



export = routes;

import { Priority, TaskStatus, UserAccountStatus } from "@prisma/client";
import { CreateUserPayload } from "../modules/user/user.interface";
import { CreateTaskPayload } from "../modules/task/task.interface";

const createUserpayload: CreateUserPayload = {
    name: 'Md.Arafat Hasan',
    email: 'arafat@gmail.com',
    username: 'arafat123',
    password: '123456',
  };

  const user = {
    id: 'cuiduhuyhiuhdkd',
    name: createUserpayload.name,
    profilePhoto: null,
    gender: null,
    username: createUserpayload.username,
    email: createUserpayload.email,
    password: 'hashed_password',
    status: UserAccountStatus.Active,
    passwordLastChangedAt: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    isActive: false,
  };


   const createTaskPayload: CreateTaskPayload = {
       title: "Design task management dashboard",
       description: "Create a responsive dashboard UI for task listing, filters, and status overview.",
       dueDate: "2025-01-15",
       priority: Priority.High,
       status: TaskStatus.To_Do,
       assignedToId: "clx9k2a8f0001v3q9d1m8a7b2", }; 
  
     const authUser = {
       id: 'clx9k1a9z0000v3q9a1b2c3d4'
       }
  
      const createdTask = {
       id: "clx9k4d2a0001v3q9r8m1n2b3",
       title: "Implement task assignment logic", 
       description: "Allow admins to assign tasks to users and notify them in real time.",
       dueDate: new Date("2025-01-20T18:00:00.000Z"),
       priority: Priority.High, status: TaskStatus.To_Do, 
       createdAt: new Date("2025-01-05T10:30:00.000Z"), 
       updatedAt: new Date("2025-01-07T08:45:00.000Z"),
       creatorId: authUser.id, assignedToId: "clx9k2a8f0001v3q9d1m8a7b2"
       };
  
  
      const updatedTask = {
       id: "clx9k4d2a0001v3q9r8m1n2b3",
       title: "Title has updated",
       description: "Allow admins to assign tasks to users and notify them in real time.",
       dueDate: new Date("2025-01-20T18:00:00.000Z"), priority: Priority.High, 
       status: TaskStatus.To_Do, createdAt: new Date("2025-01-05T10:30:00.000Z"), 
       updatedAt: new Date("2025-01-07T08:45:00.000Z"),
       creatorId: authUser.id, 
       assignedToId: "cuidnsjbxhjxbsjkhbsj" 
       };
  

const testData = 
{
user,
authUser,
createUserpayload,
createTaskPayload,
createdTask,
updatedTask
} 


export default testData
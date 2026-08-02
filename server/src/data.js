import mongoose from "mongoose";
import dotenv from "dotenv";
import Team from "./models/Team.js";
import User from "./models/User.js";
import Tag from "./models/Tag.js";
import Project from "./models/Project.js";
import Task from "./models/Task.js";
dotenv.config({ path: "./.env" });

dotenv.config();

await mongoose.connect(process.env.MONGODB_URI);

const seedData = async () => {
  try {
    console.log("Clearing old data...");

    await Task.deleteMany();
    await Project.deleteMany();
    await Team.deleteMany();
    await User.deleteMany();
    await Tag.deleteMany();

    console.log("Creating teams...");

    const teams = await Team.insertMany([
      {
        name: "Frontend Team",
        description: "Responsible for React and UI development",
      },
      {
        name: "Backend Team",
        description: "Responsible for APIs and database",
      },
      {
        name: "Design Team",
        description: "Responsible for UX and visual design",
      },
    ]);

    console.log("Creating users...");

    const users = await User.insertMany([
      { name: "Sunny Raj", email: "sunny@workasana.com" },
      { name: "Priya Sharma", email: "priya@workasana.com" },
      { name: "Amit Kumar", email: "amit@workasana.com" },
      { name: "Neha Singh", email: "neha@workasana.com" },
      { name: "Rahul Verma", email: "rahul@workasana.com" },
    ]);

    console.log("Creating tags...");

    await Tag.insertMany([
      { name: "UI" },
      { name: "API" },
      { name: "Database" },
      { name: "Bug" },
      { name: "Feature" },
      { name: "Performance" },
      { name: "Testing" },
      { name: "Documentation" },
    ]);

    console.log("Creating projects...");

    const projects = await Project.insertMany([
      {
        name: "Workasana Web App",
        description: "Project management application built with MERN stack",
        team: teams[0]._id,
        status: "Active",
      },
      {
        name: "Mobile Companion App",
        description: "React Native app for task management on mobile devices",
        team: teams[0]._id,
        status: "Planning",
      },
      {
        name: "Analytics Dashboard",
        description: "Advanced reporting and analytics for managers",
        team: teams[1]._id,
        status: "Active",
      },
      {
        name: "Design System",
        description: "Reusable components and visual guidelines",
        team: teams[2]._id,
        status: "Completed",
      },
    ]);

    console.log("Creating tasks...");

    await Task.insertMany([
      {
        name: "Build login page",
        project: projects[0]._id,
        team: teams[0]._id,
        owners: [users[0]._id, users[1]._id],
        tags: ["UI", "Feature"],
        status: "Completed",
        dueDate: new Date("2026-08-05"),
        timeToComplete: 2,
      },
      {
        name: "Implement JWT authentication",
        project: projects[0]._id,
        team: teams[1]._id,
        owners: [users[2]._id],
        tags: ["API", "Feature"],
        status: "In Progress",
        dueDate: new Date("2026-08-10"),
        timeToComplete: 3,
      },
      {
        name: "Create dashboard charts",
        project: projects[2]._id,
        team: teams[1]._id,
        owners: [users[0]._id, users[3]._id],
        tags: ["Feature", "Performance"],
        status: "In Progress",
        dueDate: new Date("2026-08-12"),
        timeToComplete: 4,
      },
      {
        name: "Fix sidebar responsive issue",
        project: projects[0]._id,
        team: teams[0]._id,
        owners: [users[1]._id],
        tags: ["Bug", "UI"],
        status: "Blocked",
        dueDate: new Date("2026-08-08"),
        timeToComplete: 1,
      },
      {
        name: "Optimize MongoDB queries",
        project: projects[2]._id,
        team: teams[1]._id,
        owners: [users[2]._id, users[4]._id],
        tags: ["Database", "Performance"],
        status: "To Do",
        dueDate: new Date("2026-08-15"),
        timeToComplete: 5,
      },
      {
        name: "Create component library",
        project: projects[3]._id,
        team: teams[2]._id,
        owners: [users[3]._id],
        tags: ["UI", "Documentation"],
        status: "Completed",
        dueDate: new Date("2026-08-01"),
        timeToComplete: 6,
      },
      {
        name: "Write API documentation",
        project: projects[2]._id,
        team: teams[1]._id,
        owners: [users[4]._id],
        tags: ["Documentation", "API"],
        status: "Completed",
        dueDate: new Date("2026-08-03"),
        timeToComplete: 2,
      },
      {
        name: "Setup testing environment",
        project: projects[0]._id,
        team: teams[1]._id,
        owners: [users[2]._id],
        tags: ["Testing"],
        status: "To Do",
        dueDate: new Date("2026-08-18"),
        timeToComplete: 3,
      },
      {
        name: "Design mobile navigation",
        project: projects[1]._id,
        team: teams[2]._id,
        owners: [users[3]._id, users[1]._id],
        tags: ["UI", "Feature"],
        status: "In Progress",
        dueDate: new Date("2026-08-11"),
        timeToComplete: 2,
      },
      {
        name: "Implement push notifications",
        project: projects[1]._id,
        team: teams[1]._id,
        owners: [users[0]._id],
        tags: ["Feature", "API"],
        status: "To Do",
        dueDate: new Date("2026-08-20"),
        timeToComplete: 4,
      },
      {
        name: "Review accessibility",
        project: projects[3]._id,
        team: teams[2]._id,
        owners: [users[1]._id, users[4]._id],
        tags: ["UI", "Testing"],
        status: "Completed",
        dueDate: new Date("2026-08-02"),
        timeToComplete: 2,
      },
      {
        name: "Fix chart rendering bug",
        project: projects[2]._id,
        team: teams[1]._id,
        owners: [users[0]._id],
        tags: ["Bug", "Feature"],
        status: "In Progress",
        dueDate: new Date("2026-08-09"),
        timeToComplete: 1,
      },
    ]);

    console.log("Seed completed successfully 🎉");
    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedData();
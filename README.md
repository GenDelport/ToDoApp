# ToDoApp
A full-stack Todo List application built with Angular and .NET Core, designed to manage tasks effectively. 
The project uses an Azure SQL Database for data storage, with migrations already included in the project.

## Features
* User Authentication (Sign up and Login using Username and Password)
* Add, Edit, Delete, and Toggle the status of tasks
* Task filtering (View all tasks, pending tasks, or completed tasks)
* Modern UI built with Angular Material
* Backend API with .NET Core and SQL database integration

## Prerequisites
Before running the project, ensure the following are installed:
1. Node.js
2.  Angular CLI (19 or above)
3.  Angular Material


# IMPORTANT
Please find attached in the email the password to the sql server. Naviage to 'appsettings.Development.js' and paste in the password next to 'Password='.
For packages run "npm install" in the todoapp.client directory to install all dependencies.

## Setting up the Database locally
The project is configured to use an Azure SQL Database. If you wish to connect to your own database, follow these steps:

1. Update the Connection string
* Navigate to appsettings.Development.json in backend project.
* Update the DefaultConnection to your SQl Server instance
  
2. Apply Migration
* Open up a termin or Package Manager Console and update the database with command "Update-Database"

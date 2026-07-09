# 👥 Employee Management System (EMS)

![React](https://img.shields.io/badge/-React-61DAFB?style=flat-square&logo=react&logoColor=black)
![Spring Boot](https://img.shields.io/badge/-Spring_Boot-6DB33F?style=flat-square&logo=spring-boot&logoColor=white)
![Java](https://img.shields.io/badge/-Java-ED8B00?style=flat-square&logo=openjdk&logoColor=white)
![MySQL](https://img.shields.io/badge/-MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white)

A full-stack Employee Management System built with a React frontend and a Spring Boot backend. This application allows administrators to easily manage employee records, including adding, updating, viewing, and deleting employee data.

## 🌟 Features
- **Employee CRUD Operations**: Create, Read, Update, and Delete employees.
- **RESTful API**: Robust backend API built with Spring Boot.
- **Modern UI**: Clean and responsive user interface built with React.
- **Database Integration**: Persists data reliably using MySQL (or your configured database).

## 📸 Screenshots
*(Add screenshots of your application here. You can upload them to the repo and link them like this: `![Dashboard](./assets/dashboard.png)`)*

## 🛠️ Getting Started

### Prerequisites
Make sure you have the following installed on your local machine:
- [Node.js](https://nodejs.org/) (for the frontend)
- [Java Development Kit (JDK)](https://www.oracle.com/java/technologies/downloads/)
- Maven (optional, if you want to build from scratch)

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/aravindh2003s/Employee-Management-System-Project.git
   cd Employee-Management-System-Project
   ```

2. **Frontend Setup**
   ```bash
   cd ems-frontend
   npm install
   ```

3. **Backend Setup**
   Configure your database credentials in the `ems-backend/src/main/resources/application.properties` file.

## 🚀 Running the Application

You can use the provided batch scripts to run the application easily on Windows:
- Run `run.bat` to start both the backend and frontend simultaneously.
- Run `run-frontend.bat` to start only the frontend.
- Run `build.bat` to build the projects.

Alternatively, you can start them manually:

**Start the Backend Server**
```bash
cd ems-backend
./mvnw spring-boot:run
```
*The backend API will run on http://localhost:8080*

**Start the Frontend Client**
```bash
cd ems-frontend
npm start
```
*The client application will run on http://localhost:3000*

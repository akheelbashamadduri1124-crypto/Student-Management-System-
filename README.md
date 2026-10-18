# Student Management System

A Java + MySQL student CRUD project with a React web interface, Spring Boot REST API, and admin-only write access.

## Stack
- Java 17+, Maven, Spring Boot
- MySQL (cloud database required for public deployment)
- React + Vite
- Spring Security HTTP Basic authentication

## Local setup

### 1. Database
Create a MySQL database and table if they do not already exist:
```sql
CREATE DATABASE IF NOT EXISTS student_management;
USE student_management;
CREATE TABLE IF NOT EXISTS students (
  id INT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(254) NOT NULL,
  branch VARCHAR(100) NOT NULL,
  age INT NOT NULL CHECK (age >= 0)
);
```

### 2. Start backend
Set credentials in the same PowerShell terminal that runs Maven:
```powershell
$env:DB_URL = "jdbc:mysql://localhost:3306/student_management"
$env:DB_USERNAME = "root"
$env:DB_PASSWORD = "YOUR_MYSQL_PASSWORD"
$env:ADMIN_USERNAME = "admin"
$env:ADMIN_PASSWORD = "CHOOSE_A_STRONG_ADMIN_PASSWORD"
mvn spring-boot:run
```
Do not commit real passwords or paste them into public issue trackers.

### 3. Start frontend
Open a second terminal:
```powershell
cd frontend
npm.cmd install
npm.cmd run dev
```
Open http://localhost:5173. Student records are visible without logging in. Select **Admin login** to add, edit, or delete records.

## API permissions
- `GET /api/students` and `GET /api/students/{id}`: public read-only access
- `POST /api/students`, `PUT /api/students/{id}`, `DELETE /api/students/{id}`: require HTTP Basic admin credentials
- `GET /api/admin/verify`: verifies admin credentials

The frontend only shows Add/Edit/Delete controls after a successful admin login. The backend independently enforces the role; hiding UI buttons alone is not security.

## Deploy to Render for a resume link

1. Push this repository/branch to GitHub.
2. Create a **managed MySQL database** with a cloud provider (Render's standard web/static services do not run your local MySQL server). Ensure the provider permits connections from the Render service and provides a JDBC-compatible host, port, database name, username, and password.
3. In Render, create a **Web Service** from this repository and select Docker as the runtime. Set the Dockerfile path to `./Dockerfile`.
4. In the backend service Environment settings, add:
   - `DB_URL`: `jdbc:mysql://CLOUD_DB_HOST:3306/DATABASE_NAME?sslMode=REQUIRED` (use the exact URL/SSL instructions from your database provider)
   - `DB_USERNAME`: cloud database username
   - `DB_PASSWORD`: cloud database password
   - `ADMIN_USERNAME`: e.g. `admin`
   - `ADMIN_PASSWORD`: a unique, strong password
   - `FRONTEND_ORIGIN`: your deployed frontend origin, e.g. `https://your-student-app.onrender.com`
5. Create a **Static Site** from the same repository, set root directory to `frontend`, build command to `npm install && npm run build`, and publish directory to `dist`. Set build environment variable `VITE_API_URL` to `https://YOUR-BACKEND.onrender.com/api/students`.
6. After the static site has its URL, set `FRONTEND_ORIGIN` in the backend to that exact origin (no trailing slash), then redeploy the backend.
7. Run the SQL schema against the cloud database and add only non-sensitive demo data. Do not expose real student personal information in a public portfolio.
8. Test the deployed public read view, admin login, and denied unauthenticated write requests before adding the frontend URL to your resume.

Render URLs and external database credentials are specific to your account and must be configured in the Render dashboard. Localhost URLs will not work for public visitors.

## Environment variables
- `DB_URL` (defaults to local `student_management` URL)
- `DB_USERNAME` (defaults to `root`)
- `DB_PASSWORD` (required)
- `ADMIN_USERNAME` (defaults to `admin`)
- `ADMIN_PASSWORD` (required)
- `FRONTEND_ORIGIN` (defaults to local Vite origin)
- `VITE_API_URL` (frontend build-time API URL; defaults to localhost for local development)

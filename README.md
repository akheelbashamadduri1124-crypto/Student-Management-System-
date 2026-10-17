# Student Management System

A Java + MySQL student CRUD project with a React web interface. The original console entry point (`Main`) and JDBC DAO are retained; Spring Boot exposes the same DAO to the frontend through a REST API.

## Stack

- Java 17+
- Maven
- Spring Boot REST API
- MySQL
- React + Vite

## 1. Database setup

Create the database and table in MySQL. If you already have a `student_management.students` table, compare its columns before running the schema.

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

## 2. Configure database credentials

The application reads the following environment variables:

- `DB_URL` (optional; defaults to `jdbc:mysql://localhost:3306/student_management`)
- `DB_USERNAME` (optional; defaults to `root`)
- `DB_PASSWORD` (required)

Set these in your shell or Eclipse Run Configuration > Environment before starting the app. Never commit your real password.

## 3. Start the Java API

Requires JDK 17+ and Maven. From the repository root:

```bash
mvn spring-boot:run
```

The API listens on http://localhost:8080.

| Method | Endpoint | Action |
| --- | --- | --- |
| GET | `/api/students` | List students |
| GET | `/api/students/{id}` | Get one student |
| POST | `/api/students` | Add student |
| PUT | `/api/students/{id}` | Update student |
| DELETE | `/api/students/{id}` | Delete student |

Example POST JSON:

```json
{
  "id": 1001,
  "name": "Asha Rao",
  "email": "asha@example.com",
  "branch": "Computer Science",
  "age": 20
}
```

## 4. Start the React frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

Open http://localhost:5173. To point the UI at a different API URL, set `VITE_API_URL` before running Vite (the default is `http://localhost:8080/api/students`).

## Notes

- This is a local-development setup, not a production deployment. Add authentication and authorization before exposing student records to the internet.
- The API uses the existing JDBC DAO and table. Verify the actual MySQL schema and test CRUD flows locally before deploying.
- The legacy console entry point remains in `Main.java`; run it separately from Eclipse if you still want the console version.

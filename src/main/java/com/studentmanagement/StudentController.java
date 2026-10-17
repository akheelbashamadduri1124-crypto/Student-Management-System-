package com.studentmanagement;

import java.sql.SQLException;
import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/students")
@CrossOrigin(origins = {"http://localhost:5173"})
public class StudentController {
    private final StudentDAO dao = new StudentDAO();

    @GetMapping
    public List<Student> getAll() {
        try {
            return dao.getAllStudent();
        } catch (SQLException ex) {
            throw databaseError(ex);
        }
    }

    @GetMapping("/{id}")
    public Student getById(@PathVariable int id) {
        try {
            Student student = dao.getStudentById(id);
            if (student == null) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found");
            }
            return student;
        } catch (SQLException ex) {
            throw databaseError(ex);
        }
    }

    @PostMapping
    public ResponseEntity<Student> create(@RequestBody Student student) {
        validate(student, true);
        try {
            if (dao.addStudent(student)) {
                return ResponseEntity.status(HttpStatus.CREATED).body(student);
            }
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Student could not be created");
        } catch (SQLException ex) {
            if ("23000".equals(ex.getSQLState())) {
                throw new ResponseStatusException(HttpStatus.CONFLICT, "Student ID or email already exists");
            }
            throw databaseError(ex);
        }
    }

    @PutMapping("/{id}")
    public Student update(@PathVariable int id, @RequestBody Student student) {
        validate(student, false);
        if (student.getId() != 0 && student.getId() != id) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Path ID must match student ID");
        }
        student.setId(id);
        try {
            if (!dao.updateStudent(student)) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found");
            }
            return dao.getStudentById(id);
        } catch (SQLException ex) {
            throw databaseError(ex);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable int id) {
        try {
            if (!dao.deleteStudent(id)) {
                throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Student not found");
            }
            return ResponseEntity.noContent().build();
        } catch (SQLException ex) {
            throw databaseError(ex);
        }
    }

    private void validate(Student student, boolean creating) {
        if (student == null
            || (creating && student.getId() <= 0)
            || student.getName() == null || student.getName().isBlank()
            || student.getEmail() == null
            || !student.getEmail().matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$") 
            || student.getBranch() == null || student.getBranch().isBlank()
            || student.getAge() < 0) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Provide a valid ID, name, email, branch, and non-negative age");
        }
    }

    private ResponseStatusException databaseError(SQLException ex) {
        return new ResponseStatusException(
            HttpStatus.INTERNAL_SERVER_ERROR,
            "Database operation failed. Check database configuration and server logs."
        );
    }
}

package com.studentmanagement;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;

public class DBConnection {
    private DBConnection() {}

    public static Connection getConnection() throws SQLException {
        String url = System.getenv().getOrDefault(
            "DB_URL", "jdbc:mysql://localhost:3306/student_management"
        );
        String username = System.getenv().getOrDefault("DB_USERNAME", "root");
        String password = System.getenv("DB_PASSWORD");

        if (password == null || password.isBlank()) {
            throw new SQLException("DB_PASSWORD environment variable is not set.");
        }
        return DriverManager.getConnection(url, username, password);
    }
}

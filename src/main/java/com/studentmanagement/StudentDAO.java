package com.studentmanagement;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class StudentDAO {

	public boolean addStudent(Student student) throws SQLException {
		
		String sql ="INSERT INTO students(id,name,email,branch,age) VALUES(?,?,?,?,?)" ;
		
		try(Connection con =DBConnection.getConnection();
		
		PreparedStatement ps = con.prepareStatement(sql)
		
		){
	   
	   ps.setInt(1,student.getId());
	 
	   ps.setString(2, student.getName());
		
     	ps.setString(3, student.getEmail());
		
		ps.setString(4,student.getBranch());
		
		ps.setInt(5, student.getAge());
		
		int rows = ps.executeUpdate();
				
		return rows > 0;
		
		}
	}
	
	public Student getStudentById(int id) throws SQLException {
		
		String sql="SELECT * FROM students WHERE id=?";
		
		try(
				Connection con =DBConnection.getConnection();
				
				PreparedStatement ps = con.prepareStatement(sql)){
			
			ps.setInt(1, id);
			
		 ResultSet rs = ps.executeQuery();
		
		 if(rs.next()) {
			 
			 int studentId = rs.getInt("id");
			 
			 String name = rs.getString("name");
			 
			 String email = rs.getString("email");
			 
			 String branch = rs.getString("branch");
			 
			 int age = rs.getInt("age");
			 
			 Student student = new Student(studentId,name,email,branch,age);
			 
			 return student;
	  }
			
			
			return null;
			
			
		}
		
		
		
	}
	
	public List<Student> getAllStudent( ) throws SQLException {
		
		
		
		List<Student> list = new ArrayList<>();
		
		String sql = "SELECT * FROM students";
		
		try (
				Connection con = DBConnection.getConnection();
		        
				PreparedStatement ps = con.prepareStatement(sql)){
			
			         ResultSet rs =ps.executeQuery();
				
				while(rs.next()) {
					
					int id =rs.getInt("id");
					
					String name = rs.getString("name");
					
					String email = rs.getString("email");
					
					String branch = rs.getString("branch");
					
					int age = rs.getInt("age");
					
					
					Student student = new Student(id,name,email,branch,age);
					
					list.add(student);
					
				}
				  return list;
			 
			
		}
		 
	}
	
	
	public boolean updateStudent(Student student)  throws SQLException {
		
		
		String sql = "UPDATE students SET  name=?,email=?,branch=?,age=?  WHERE id=?";
		
		try( 
				Connection con = DBConnection.getConnection();
				
				PreparedStatement  ps = con.prepareStatement(sql)){
			
			ps.setString(1,student.getName());
			
			ps.setString(2, student.getEmail());
			
			ps.setString(3, student.getBranch());
			
			ps.setInt(4, student.getAge());
			
			ps.setInt(5, student.getId());
			
		   int rows =ps.executeUpdate();
			
			
			 return rows>0;
		}
}
	
	
	public boolean deleteStudent(int id)  throws SQLException  {
		
		String sql = "DELETE FROM students WHERE id = ?";
		
		try(       
				
				Connection con = DBConnection.getConnection();
				
				PreparedStatement ps = con.prepareStatement(sql)){
			
			ps.setInt(1, id);
			
			int rows =ps.executeUpdate();
			
			return rows>0;
		
		}
	}

	 
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
	
}

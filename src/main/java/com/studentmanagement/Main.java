package com.studentmanagement;

import java.sql.SQLIntegrityConstraintViolationException;

import java.sql.SQLException;

import java.util.List;

import java.util.Scanner;

public class Main {

	public static void main(String [] args) throws SQLException   {
	
		Scanner sc = new Scanner(System.in);
		
		StudentDAO dao = new StudentDAO();
		
		boolean running = true ;
		
		while(running) {
			
			System.out.println("======= Student Management System =========");
			
			System.out.println("1.Add Student");
			
			System.out.println("2.View Student");
			
			System.out.println("3.View All Students");
			
			System.out.println("4.Update Students");
			
			System.out.println("5.Delete Student");
			
			System.out.println("6.Exit");
			
			System.out.println("Enter Your Choice :");
			
			int choice = sc.nextInt();
			
			switch(choice) {
			
			
			        case 1 :{
			        	// Add student
			        	int id ;
			        	
			        	while(true) {
			       
			        		System.out.println("Enter Student ID :");
			        		
			        		id=sc.nextInt();
			        		
			        		break;
			        	}
			       	sc.nextLine();
			   //-----------------------------------//     	
			        	String name ; 
			        	
			        	while(true) {
			        		
			        		System.out.println("Enter student Name :");
			        		
			        		name = sc.nextLine();
			        		
			        		if(!name.trim().isEmpty() && name.matches("[a-zA-Z]+")) {
			        			
			        			break ;
			        			
			        		}
			       
			        		System.out.println("Please Enter a valid name");
			        		
			        	}
			        	
			        	
			        	String email;
			        	
			        	while(true) {
			        		
			        		System.out.println("Enter student Email :");
			        		
			        		email = sc.nextLine();
			        		
			        		if(email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$")) {
			        			break ;
			        			
			        	}
			        		System.out.println("Invalid Email");
			        		System.out.println("Please enter valid email.");
			        	}
			        
			           System.out.println("Enter Branch :");
			        	
			        	String branch = sc.nextLine();
			        	
			            int age ;
			        	
			        	while(true) {
			        		
			        		System.out.println("Enter Student age :");
			        		
			        		age=sc.nextInt();
			        		
			        		if(age>=0) {
			        			break ;
			        		}
			        		
			        		System.out.println("Age Cannot be negative .");
			        		
			        		System.out.println("------------------------");
			        		
			        		System.out.println("Please Enter Valid Age.");
			        	}
			        	
			        	 Student student = new Student(id,name,email,branch,age);
			    
			        	while(true) {
			        		
			        	 try{ 
			        		 boolean result = dao.addStudent(student);
			        	
			        	 if(result) {
			        		 System.out.println("Student Added Successfully");
			        		 break ;
			        		 
			        	 }
			        	 }catch(SQLIntegrityConstraintViolationException e) {
			        		 System.out.println("Id already Exists");
			        		 System.out.println("Please Enter a different ID .");
			        		 
			        		 id=sc.nextInt();
			        		 student.setId(id);
			        	 }
			        }
			        	        
			        break ;
			   }
			        case 2:{
			        	//View student 
			        	
			        	System.out.println("Enter the Student ID :");
			        	
			        	int id = sc.nextInt();
			        	
			        	Student student = dao.getStudentById(id);
			        	
			        	if(student != null) {
			        		
			        		System.out.println("Student Found :");
			        		System.out.println(student);
			        		
			        	}else {
			        		System.out.println("Student Not Found.......😒😒😒");
			        	}
			         break ;
			  }	
			        case 3:{
			        	//view All Students
			        	
			         List<Student> students = dao.getAllStudent();
			        	
			        	if(students.isEmpty()) {
			        		System.out.println("Students Not Found ");
			        	}else{
			        		for(Student student :students) {
			        		 
			        		System.out.println(student);
			        	                                    }	
			                }
			       
			        	break;
			  }
			        
			        case 4:{
			        	//Update Student
			        	
			        	System.out.println("Enter student ID :");
			        	
			        	int id =sc.nextInt();
			        	
			        	sc.nextLine();
			        	 
			        	System.out.println("Enter Student Name :");
			        	
			        	String name = sc.nextLine();
			        	
			        	System.out.println("Enter Student Email :");
			        	
			        	String email = sc.nextLine();
			        	
			        	System.out.println("Enter Student Branch :");
			        	
			        	String branch= sc.nextLine();
			        	
			        	System.out.println("Enter Student Age :");
			        	
			        	int age =sc.nextInt();
			        	
			         Student student = new Student(id,name,email,branch,age);
			        
			          boolean update = dao.updateStudent(student);
			        
			          if(update) {
			        	 System.out.println("Student updated successfully.");
			          }else {
			        	  System.out.println("Student Not Found.");
			          }
			           break;
			   }
			        case 5:
			        	//Delete Student
			        	
			        	System.out.println("Enter student ID :");
			        	
			        	int id = sc.nextInt();
			        	
			        	boolean result = dao.deleteStudent(id);
			        	
			        	if(result) {
			        		
			        		System.out.println("Student deleted successfully ");
			        		
			        	}else {
			        		System.out.println("Student not found");
			        	}
			         break ;
			        
			        case 6:
			        	System.out.println("Exiting......");
			        	 running = false ;
			        	 break ;
			        
			        default:
			        	System.out.println("Invalid Choice.Please enter 1-6.");
			        	break ;
			        	
			        	
	       	}
			 
		 }
          sc.close();  
		
	  }
   }

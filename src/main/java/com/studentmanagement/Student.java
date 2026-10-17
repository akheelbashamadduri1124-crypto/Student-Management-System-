package com.studentmanagement;

public class Student {
	
	private int id ;
	private String name;
	private String email;
	private String branch;
	private int age;
	
	public Student(int id,String name,String email,String branch ,int age) {
		this.id=id;
		this.name=name;
		this.email=email;
		this.branch=branch;
		this.age=age;
	}
	
	 

	 



	public void setId(int id) {
		 this.id = id;
	}
	
	public  void setName(String name) {
		 this.name= name;
	}
	
   public void setEmail(String email) {
		 this.email=email;
	}
 
   public  void setAge( int age) {
		 this.age= age;
	}
   
   public void setBranch(String branch) {
	   this.branch=branch;
   }
	
	public  int getAge() {
		return age;
	}
	
	public int getId() {
		return id;
	}
	
	public String getName() {
		return name;
	}
	
	public String getEmail() {
		return email;
	}
	
	public String getBranch() {
		return branch;
	}
	
	public String toString() {
		return "Student{"+"id="+id+
				",name= " + name+ 
				",email= " +email +
				",branch= " +branch +
				",age= "+age+
				'}';
	}
	
	

}

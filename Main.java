public class Main {
    public static void main(String[] args) {
       ArrayList<Student> students = new ArrayList<>();
       Student student1 = new Student(1, "Alice", 20, " JAVA");
         Student student2 = new Student(2, "Bob", 22, "Python");
            Student student3 = new Student(3, "Charlie", 21, "C++");
            Student student4 = new Student(4, "Akheel", 23, "JavaScript");
            students.add(student1);
            students.add(student2);
            students.add(student3);
            students.add(student4);
            for(Student student : students){
                student.displayStudent();
            }
    }
}
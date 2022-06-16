package Database;

import edu.brown.cs.student.Main.Database.Database;
import org.junit.Test;

import java.io.File;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

public class DatabaseTest {


  @Test
  public void testLoadTable() throws SQLException, ClassNotFoundException {

    Database database = new Database();
    database.loadData("data/notes.sqlite3");

    //check if filename exists
    File file = new File("data/notes.sqlite3");
    boolean valid = file.exists();
    // If the file does not exist, the method should create it
    assertTrue(valid);
  }



//  @Test
//  public void testAddNote() throws SQLException, ClassNotFoundException {
//
//    // Load the file
//    Database database = new Database();
//    database.loadData("data/notes.sqlite3");
//
//    // Add a couple of dummy notes
//    database.addNote("arjunshanmugam31@gmail.com", "data/arjunshanmugam31@gmail.com/Semester " +
//            "2/Coffee.md", "Coffee", "data/arjunshanmugam31@gmail.com/Semester " +
//            "2/Basketball/post_moves.md~data/arjunshanmugam31@gmail.com/teee" +
//            ".md~data/arjunshanmugam31@gmail.com/Semester 1/Reinforcement " +
//            "Learning/reinforcement_notes.md", "beans~dark roast~Blue State Coffee", "This note " +
//            "talks all about coffee.");
//
//
//
//
//  }

//  @Test
//  public void testGetUsersNotes() throws SQLException, ClassNotFoundException, IOException {
//    // Load the file
//    Database database = new Database();
//    database.loadData("data/notes.sqlite3");
//
//
//
//    List<Map<String, Object>> note = database.getSingleUsersNotes("arjunshanmugam31@gmail.com");
//
//    assertEquals(3, note.size());
//    assertEquals("Coffee", note.get(0).get("name"));
//    assertEquals("This note talks all about coffee.", note.get(0).get("description"));
//
//
//  }


  @Test
  public void testBuildString() throws SQLException, ClassNotFoundException {
    // Load the file
    Database database = new Database();
    database.loadData("data/notes.sqlite3");


    List<String> tags = new ArrayList<>();
    tags.add("Dark Roast");
    tags.add("Beans");
    tags.add("Black");

    String string = database.buildStringOfLinksAndTags(tags);

    assertEquals("Dark Roast~Beans~Black~", string);


  }

  @Test
  public void testGetName() throws SQLException, ClassNotFoundException {
    // Load the file
    Database database = new Database();
    database.loadData("data/notes.sqlite3");


    assertEquals("TaShawnIsAQT.md", database.getNameFromFilePath("data/arjunshanmugam31@gmail" +
            ".com/Semester 1/TaShawnIsAQT.md"));


  }





}

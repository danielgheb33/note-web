package FileSystem;

import com.google.gson.Gson;
import edu.brown.cs.student.Main.FileSystem.FileSystem;
import org.junit.Test;

public class FileSystemTest {




  @Test
  public void testDirectoryStructure() {
    Gson GSON = new Gson();
    FileSystem fileSystem = new FileSystem("data/test_user@gmail.com", "");


    System.out.println(GSON.toJson(fileSystem));


  }

}

package edu.brown.cs.student.Main.FileSystem;


import java.io.File;
import java.util.ArrayList;
import java.util.List;

public class FileSystem {
  private String name;
  private String path;
  private String type;
  private List<FileSystem> children;


  /**
   * Root constructor
   */
  public FileSystem(String absoluteRoot, String relativeRoot) {

    File root = new File(absoluteRoot);
    this.name = root.getName();
    this.path = relativeRoot;
    this.type = root.isDirectory() ? "Folder" : "File";
    this.children = new ArrayList<>();

    // Store list of pathnames within root folder
    String[] pathNames = root.list();

    if (root.isDirectory()) {

      for (String pathName : pathNames) {

        File child = new File(pathName);
        this.children.add(new FileSystem(absoluteRoot + "/" + child.getName(),
            relativeRoot + "/" + child.getName()));
      }

    }

  }


}

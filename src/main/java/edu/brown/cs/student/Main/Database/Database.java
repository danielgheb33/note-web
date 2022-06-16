package edu.brown.cs.student.Main.Database;

import com.google.common.collect.ImmutableMap;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.sql.*;
import java.util.*;

public class Database {
  private static Connection conn = null;

  public Database() {

  }

  public void loadData(String filename) throws SQLException, ClassNotFoundException {

    Class.forName("org.sqlite.JDBC");
    String urlToDB = "jdbc:sqlite:" + filename;
    conn = DriverManager.getConnection(urlToDB);

    Statement stat = conn.createStatement();
    stat.executeUpdate("PRAGMA foreign_keys=ON;");

    //create table for notes
    PreparedStatement notes;
    notes = conn.prepareStatement("CREATE TABLE IF NOT EXISTS note("
            + "email TEXT,"
            + "id TEXT,"
            + "noteName TEXT,"
            + "links TEXT,"
            + "tags TEXT,"
            + "description TEXT,"
            + "PRIMARY KEY (id));");
    notes.executeUpdate();
    notes.close();
    stat.close();

  }

  public void addOrUpdateNote(String email, String id,
                              String noteName, String links, String tags, String description) throws SQLException, ClassNotFoundException {


    PreparedStatement checkIfExists = conn.prepareStatement("SELECT COUNT(note.id) AS num FROM" +
            " note " +
            "WHERE note.id = ?");
    checkIfExists.setString(1, id);

    ResultSet rs = checkIfExists.executeQuery();


    // Now, we check whether count is 0, implying that record does not exist...
    int numMatchingRecords = rs.getInt("num");

    if (numMatchingRecords == 0) {
//       If there is no note already in sql database
      PreparedStatement prep;
      prep = conn.prepareStatement("INSERT INTO note VALUES (?, ?, ?, ?, ?, ?)");
      prep.setString(1, email);
      prep.setString(2, id);
      prep.setString(3, noteName);
      prep.setString(4, links);
      prep.setString(5, tags);
      prep.setString(6, description);
      prep.executeUpdate();
      prep.close();
    } else {
      // Otherwise, record already exists and we want to UPDATE
      PreparedStatement prep;
      prep = conn.prepareStatement("UPDATE note SET note.email = ?, note.id = ?, note.noteName = " +
              "?, note.links = ?, note.tags = ?, note.description = ? WHERE note.id = ?");
      prep.setString(1, email);
      prep.setString(2, id);
      prep.setString(3, noteName);
      prep.setString(4, links);
      prep.setString(5, tags);
      prep.setString(6, description);
      prep.setString(7, id);
      prep.executeUpdate();
      prep.close();
    }


  }

  public Map<String, Object> getSingleNote(String path, String userID) throws SQLException, IOException {
    PreparedStatement getSingleNote = conn.prepareStatement("SELECT * FROM note WHERE note"
            + ".id = ?");
    getSingleNote.setString(1, userID + path);

    ResultSet resultSetOfOneNote = getSingleNote.executeQuery();


    return this.convertResultSetToImmutableMap(resultSetOfOneNote, userID).get(0);
  }

  public List<Map<String, Object>> getSingleUsersNotes(String email) throws SQLException, IOException {

    // Querying the database
    PreparedStatement getSingleUsersNotes = conn.prepareStatement("SELECT * FROM note WHERE note"
            + ".email = ?");
    getSingleUsersNotes.setString(1, email);

    ResultSet resultSetOfNotes = getSingleUsersNotes.executeQuery();


    return convertResultSetToImmutableMap(resultSetOfNotes, email);


  }

  public String buildStringOfLinksAndTags(List<String> linksOrTags) {
    StringBuilder string = new StringBuilder();
    for (String link : linksOrTags) {
      string.append(link + "~");
    }
    return string.toString();
  }


  public String getNameFromFilePath(String filepath) {
    List<String> separatedFilepath = Arrays.asList(filepath.split("/"));
    return separatedFilepath.get(separatedFilepath.size() - 1);


  }


  private List<Map<String, Object>> convertResultSetToImmutableMap(ResultSet resultSetOfNotes,
                                                                   String userID) throws SQLException, IOException {

    List<Map<String, Object>> notes = new ArrayList<>();

    while (resultSetOfNotes.next()) {

      // Split up the String containing links into a list of links; we split on "~"
      List<String> links = Arrays.asList(resultSetOfNotes.getString("links").split("~"));
      List<String> tags = Arrays.asList(resultSetOfNotes.getString("tags").split("~"));

      // Read file and grab its content
      String content = Files.readString(Paths.get("data/" + resultSetOfNotes.getString("id")));

      Map<String, Object> note = ImmutableMap.<String, Object>builder().put("userID",
              userID).put("path", resultSetOfNotes.getString("id")).put("name",
              resultSetOfNotes.getString("noteName")).put("tags", tags).put(
              "description", resultSetOfNotes.getString("description")).put("links",
              links).put("content", content).build();


      notes.add(note);

    }

    resultSetOfNotes.close();


    return notes;

  }


  public void saveNote(JSONObject noteDatum) throws JSONException, IOException, SQLException, ClassNotFoundException {
    String userID = noteDatum.getString("userID");
    String path = noteDatum.getString("path");
    String content = noteDatum.getString("content");
    String noteName = noteDatum.getString("name");
    String description = noteDatum.getString("description");

      // Store the name of the note from the end of the noteID variable
      // Store links
      JSONArray jsonLinks = noteDatum.getJSONArray("links");
      List<String> linksList = new ArrayList<>();
      for (int i = 0; i < jsonLinks.length(); i++) {
        linksList.add(jsonLinks.getString(i));
      }

      // Store tags
      List<String> tagsList = new ArrayList<>();
      JSONArray jsonTags = noteDatum.getJSONArray("tags");
      for (int j = 0; j < jsonTags.length(); j++) {
        tagsList.add(jsonTags.getString(j));
      }

      String links = this.buildStringOfLinksAndTags(linksList);
      String tags = this.buildStringOfLinksAndTags(tagsList);

    // Check if directory with name "userID" exists; if not, create it
    File userDirectory = new File("data/" + userID);
    if (!userDirectory.exists()) {
      userDirectory.mkdir();
    }

    // Now, we create the .md file and write to it
    String[] splitPath = path.split("/");
    StringBuilder forDirectories = new StringBuilder();
    for (int i = 0; i < splitPath.length - 1; i++) {
      forDirectories.append(splitPath[i]).append("/");
    }
    Files.createDirectories(Paths.get("data/" + userID + "/" + forDirectories.toString()));
    FileWriter fileWriter = new FileWriter("data/" + userID + path);
    fileWriter.write(content);
    fileWriter.close();

    this.addOrUpdateNote(userID, userID + path, noteName, links, tags, description);


  }
}

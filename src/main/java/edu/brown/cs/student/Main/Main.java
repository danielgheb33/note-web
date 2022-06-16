package edu.brown.cs.student.Main;

import com.google.gson.Gson;
import edu.brown.cs.student.Main.Database.Database;
import edu.brown.cs.student.Main.FileSystem.FileSystem;
import freemarker.template.Configuration;
import joptsimple.OptionParser;
import joptsimple.OptionSet;
import org.json.JSONObject;
import spark.*;
import spark.template.freemarker.FreeMarkerEngine;

import java.io.*;
import java.util.List;
import java.util.Map;


/**
 * The Main class of our project. This is where execution begins.
 */
public final class Main {
  private static final int DEFAULT_PORT = 4567;
  private static final Gson GSON = new Gson();
  private static final Database database = new Database();
  private final String[] args;

  private Main(String[] args) {
    this.args = args;
  }

  /**
   * The initial method called when execution begins.
   *
   * @param args An array of command line arguments
   * @throws Exception SQL, fileNotFound exceptions
   */
  public static void main(String[] args) throws Exception {
    new Main(args).run();
  }

  private static FreeMarkerEngine createEngine() {
    Configuration config = new Configuration();
    File templates = new File("src/main/resources/spark/template/freemarker");
    try {
      config.setDirectoryForTemplateLoading(templates);
    } catch (IOException ioe) {
      System.out.printf("ERROR: Unable use %s for template loading.%n",
          templates);
      System.exit(1);
    }
    return new FreeMarkerEngine(config);
  }

  /**
   * Starts the server with passed arguments from the terminal
   *
   * @throws Exception if something goes wrong when starting the server
   */
  private void run() throws Exception {
    database.loadData("data/notes.sqlite3");

    // Parse command line arguments
    OptionParser parser = new OptionParser();
    parser.accepts("gui");
    parser.accepts("port").withRequiredArg().ofType(Integer.class)
        .defaultsTo(DEFAULT_PORT);
    OptionSet options = parser.parse(args);

    if (options.has("gui")) {
      runSparkServer((int) options.valueOf("port"));
    }
  }

  /**
   * Starts the Spark server
   *
   * @param port the port on which the server will run
   */
  private void runSparkServer(int port) {
    Spark.port(port);
    Spark.externalStaticFileLocation("src/main/resources/static");

    Spark.options("/*", (request, response) -> {
      String accessControlRequestHeaders = request.headers("Access-Control-Request-Headers");
      if (accessControlRequestHeaders != null) {
        response.header("Access-Control-Allow-Headers", accessControlRequestHeaders);
      }

      String accessControlRequestMethod = request.headers("Access-Control-Request-Method");

      if (accessControlRequestMethod != null) {
        response.header("Access-Control-Allow-Methods", accessControlRequestMethod);
      }

      return "OK";
    });

    Spark.before((request, response) -> response.header("Access-Control-Allow-Origin", "*"));

    Spark.exception(Exception.class, new ExceptionPrinter());
    FreeMarkerEngine freeMarker = createEngine();

    // Setup Spark Routes
    Spark.post("/saved-note", new saveNote());
    Spark.post("/filesystem", new getUserFileSystem());
    Spark.post("/note-datum", new getNoteDatum());
    Spark.post("/notes-data", new getUserNotes());
  }

  private static class getUserFileSystem implements Route {

    @Override
    public Object handle(Request request, Response response) throws Exception {
      JSONObject data = new JSONObject(request.body());
      String userID = data.getString("userID");

      FileSystem fileSystem = new FileSystem("data/" + userID, "");

      return GSON.toJson(fileSystem);
    }
  }

  private static class getNoteDatum implements Route {

    @Override
    public Object handle(Request request, Response response) throws Exception {
      JSONObject data = new JSONObject(request.body());
      String userID = data.getString("userID");
      String path = data.getString("path");

      Map<String, Object> note = database.getSingleNote(path, userID);

      return GSON.toJson(note);
    }
  }

  private static class getUserNotes implements Route {

    @Override
    public Object handle(Request request, Response response) throws Exception {
      JSONObject data = new JSONObject((request.body()));
      String userID = data.getString("userID");

      List<Map<String, Object>> notes = database.getSingleUsersNotes(userID);

      return GSON.toJson(notes);
    }
  }

  private static class saveNote implements Route {

    @Override
    public Object handle(Request request, Response response) throws Exception {
      JSONObject data = new JSONObject((request.body()));
      JSONObject noteDatum = data.getJSONObject("noteDatum");

      database.saveNote(noteDatum);

      return "Success!";
    }
  }


  /**
   * Display an error page when an exception occurs in the server.
   */
  private static class ExceptionPrinter implements ExceptionHandler {
    @Override
    public void handle(Exception e, Request req, Response res) {
      res.status(500);
      StringWriter stacktrace = new StringWriter();
      try (PrintWriter pw = new PrintWriter(stacktrace)) {
        pw.println("<pre>");
        e.printStackTrace(pw);
        pw.println("</pre>");
      }
      res.body(stacktrace.toString());
    }
  }
}

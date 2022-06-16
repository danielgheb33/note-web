import React, { useEffect, useRef } from "react";
import refPan from "./utilities/refPan";
import PhysicsEnvironment from "./physics_engine/PhysicsEnvironment";
import { drawCircle, drawOutsetCurve, drawText, randomColor } from './utilities/drawing_utilities';
import {getNotesData} from "../server_utilities";

function NoteWeb(props) {
  /////////////////////////////////////////////////constants//////////////////////////////////////////////////////////////

  const INIT_X = 0;
  const MIN_X = -200;
  const MAX_X = 200;

  const INIT_Y = 0;
  const MIN_Y = -200;
  const MAX_Y = 200;

  const INIT_SCALE = 0.05;
  const MIN_SCALE = 0.01;
  const MAX_SCALE = 1;

  const VIEW_WIDTH = window.innerWidth;
  const VIEW_HEIGHT = window.innerHeight;

  /////////////////////////////////////////////////states and references//////////////////////////////////////////////////

  // reference to the canvas element
  const canvasRef = useRef();

  // reference to the physics environment
  const physicsRef = useRef(new PhysicsEnvironment(2));

  // reference to the most up-to-date mouse position
  const mouseRef = useRef({ x: 0, y: 0 });

  // these references store information about the current files
  const notesByPathRef = useRef({});
  const notesByParticleRef = useRef({});
  const foldersByPathRef = useRef({});
  const foldersByParticleRef = useRef({});
  const tagsRef = useRef({});

  // these control how and where the particles are rendered
  const [offsetRef, startPan] = refPan({ x: INIT_X, y: INIT_Y });
  const scaleRef = useRef(INIT_SCALE);



    /////////////////////////////////////////////////Effects////////////////////////////////////////////////////////////////

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
  }, []);

  /**
    * This populates all the particles using a fetch command
    */
  useEffect(() => {

    const tempParticles = [];
    physicsRef.current.bounds = [[MIN_X, MAX_X], [MIN_Y, MAX_Y]];
    physicsRef.current.gravity = 1;

    const handleNoteData = (data) => {

      const notesByPath = notesByPathRef.current;
      const notesByParticle = notesByParticleRef.current;

      const physicsEnvironment = physicsRef.current;

      // random walk distributes particles with a preference for the center
      function randomWalk(num_walks) {
        let random_walk = 0;
        for (let i = 0; i < num_walks; ++i) {
          random_walk += Math.random();
        }
        return random_walk / num_walks;
      }

      // the bounds of where to place the particles
      const env_right = physicsEnvironment.bounds[0][0];
      const env_bottom = physicsEnvironment.bounds[1][0];
      const env_width =
        physicsEnvironment.bounds[0][1] - physicsEnvironment.bounds[0][0];
      const env_height =
        physicsEnvironment.bounds[1][1] - physicsEnvironment.bounds[1][0];

      for (const noteDatum of data) {

        const tags = noteDatum["tags"];
        const tagCounts = {};
        if (tags.length > 0) { tagCounts[tags[0]] = 1; }

        tags.forEach(tag => {
          if (tag in tagsRef.current) {
            tagsRef.current[tag].count += 1;
          } else {
            tagsRef.current[tag] = {
              count: 1,
              color: randomColor("bright")
            };
          }

          // if (tag in tagCounts) {
          //   tagCounts[tag] += 1;
          // } else {
          //   tagCounts[tag] = 1;
          // }
        });

        const links = noteDatum["links"];

        const particleID = physicsEnvironment.addParticle(
          tagCounts,
          Math.sqrt(links.length + 1),
          links.length + 1,
          [env_right + (env_width * randomWalk(50)),
          env_bottom + (env_height * randomWalk(50))]
        );

        const newNote = {
          name: noteDatum["name"],
          path: noteDatum["id"],
          tags: tags,
          description: noteDatum["description"],
          links: noteDatum["links"],
          particleID: particleID
        };

        tempParticles.push(particleID);
        notesByParticle[particleID] = newNote;
        notesByPath[newNote.path] = newNote;
      }

      props.setViewMode("tags");
    };

    console.log(props.userID)
    getNotesData(props.userID, handleNoteData);

    return () => {
      for (const particleID of tempParticles) {
        physicsRef.current.removeParticle(particleID);
      }
    };

  }, []);

  /**
   * This artificially populates the physics environment for testing.
   * @todo uncomment this to see what many interconnected notes could look like!!!
   */
  // useEffect(() => {
  //
  //   const NUM_NOTES = 100;
  //
  //   const notesByPath = notesByPathRef.current;
  //   const notesByParticle = notesByParticleRef.current;
  //
  //   const physicsEnvironment = physicsRef.current;
  //   physicsEnvironment.bounds = [[MIN_X, MAX_X], [MIN_Y, MAX_Y]];
  //   physicsEnvironment.gravity = 1;
  //   physicsEnvironment.atmosphere = 0.5;
  //
  //   // random walk distributes particles with a preference for the center
  //   function randomWalk(num_walks) {
  //     let random_walk = 0;
  //     for (let i = 0; i < num_walks; ++i) {
  //       random_walk += Math.random();
  //     }
  //     return random_walk / num_walks;
  //   }
  //
  //   // the bounds of where to place the particles
  //   const env_right = physicsEnvironment.bounds[0][0];
  //   const env_bottom = physicsEnvironment.bounds[1][0];
  //   const env_width =
  //     physicsEnvironment.bounds[0][1] - physicsEnvironment.bounds[0][0];
  //   const env_height =
  //     physicsEnvironment.bounds[1][1] - physicsEnvironment.bounds[1][0];
  //
  //   for (let i = 0; i < NUM_NOTES; i++) {
  //
  //     const getTags = () => {
  //       const tagBank = ["math", "physics", "art", "english", "anatomy", "history", "chinese", "archeology", "errands", "meetings"];
  //       const tags = [];
  //       const numTags = Math.floor(5 * Math.random());
  //       for (let j = 0; j < numTags; j++) {
  //         const newTag = Math.floor(tagBank.length * Math.random());
  //         tags.push(tagBank[newTag]);
  //       }
  //       return tags;
  //     };
  //
  //     const tags = getTags();
  //     const tagCounts = {};
  //     if (tags.length > 0) { tagCounts[tags[0]] = 1; }
  //
  //     tags.forEach(tag => {
  //       if (tag in tagsRef.current) {
  //         tagsRef.current[tag].count += 1;
  //       } else {
  //         tagsRef.current[tag] = {
  //           count: 1,
  //           color: randomColor("bright")
  //         };
  //       }
  //
  //       // if (tag in tagCounts) {
  //       //   tagCounts[tag] += 1;
  //       // } else {
  //       //   tagCounts[tag] = 1;
  //       // }
  //     });
  //
  //     const getLinks = () => {
  //       const links = [];
  //       const num_links = Math.floor(3 * Math.random());
  //       for (let j = 0; j < num_links; j++) {
  //         const newLink = "/note" + Math.floor(NUM_NOTES * Math.random());
  //         links.push(newLink);
  //       }
  //       return links;
  //     };
  //
  //     const links = getLinks();
  //
  //     const particleID = physicsEnvironment.addParticle(
  //       tagCounts,
  //       Math.sqrt(links.length + 1),
  //       links.length + 1,
  //       [env_right + (env_width * randomWalk(2)),
  //       env_bottom + (env_height * randomWalk(2))]
  //     );
  //
  //     const newNote = {
  //       name: "note" + i,
  //       path: "/note" + i,
  //       tags: tags,
  //       description: "This is a description of note #" + i,
  //       links: links,
  //       particleID: particleID
  //     };
  //
  //     notesByParticle[particleID] = newNote;
  //     notesByPath[newNote.path] = newNote;
  //   }
  //
  //   console.log("init physics: ", physicsEnvironment);
  //   console.log("init notesByPath", notesByPath);
  //   console.log("init notesByParticle", notesByParticle);
  //
  //   return () => {
  //     for (let i = 0; i < 100; i++) {
  //       physicsEnvironment.removeParticle(i);
  //     }
  //   };
  //
  // }, []);


  useEffect(() => {
    const physicsEnvironment = physicsRef.current;
    const notesByPath = notesByPathRef.current;
    const tagDict = tagsRef.current;
    const tempConstraints = [];
    const tempParticles = [];
    const tempGroups = [];

    switch (props.viewMode) {
      case "tags": // in this mode the web groups the notes by tags

        physicsEnvironment.gravity = 0.00;
        physicsEnvironment.atmosphere = 10;
        const tags = Object.keys(tagDict);
        for (let i = 0; i < tags.length; i++) {
          tempGroups.push(tags[i]);
          for (let j = i; j < tags.length; j++) {
            if (j === i) {
              physicsEnvironment.setGroup(tags[i], 1);
            } else {
              physicsEnvironment.addInteraction(tags[i], tags[j], 0);
            }
          }
        }
        break;

      case "links": // in this mode the web groups the notes by links

        physicsEnvironment.gravity = -3;
        physicsEnvironment.atmosphere = 0.1;
        for (const notePath of Object.keys(notesByPath)) {
          const note = notesByPath[notePath];
          for (const linkPath of note.links) {
            if (linkPath in notesByPath) {
              const link = notesByPath[linkPath];
              const linkConnection = physicsEnvironment.addConstraint(
                2 * (Math.sqrt(note.links.length + 1) + Math.sqrt(link.links.length + 1)),
                0.1,
                0.5,
                note.particleID,
                link.particleID
              );
              tempConstraints.push(linkConnection);
            }
          }
        }
        break;

      case "filesystem": // in this mode the web groups the notes by directory
        break;

      default:
        break;
    }

    return () => {
      tempParticles.forEach(e => physicsEnvironment.removeParticle(e));
      tempConstraints.forEach(e => physicsEnvironment.removeConstraint(e));
      tempGroups.forEach(e => physicsEnvironment.removeGroup(e));
    };
  }, [props.viewMode]);

  /**
   * This starts the physics renderer.
   */
  useEffect(() => {

    /**
     * Converts a position in the physics environment to the relative position compared to the current viewport.
     *
     * @param {number} x - the absolute x position in space
     * @param {number} y - the absolute y position in space
     * @returns {number[]} - the position relative to the viewport
     */
    function absoluteToCanvas(x, y) {
      const distancePerPixel = scaleRef.current;
      const canvas = canvasRef.current;
      const canvasLeftBorder = offsetRef.current.x - distancePerPixel * canvas.width * 0.5;
      const canvasBottomBorder =
        offsetRef.current.y - distancePerPixel * canvas.height * 0.5;
      const relX = (x - canvasLeftBorder) / distancePerPixel;
      const relY = canvas.height - (y - canvasBottomBorder) / distancePerPixel;
      return [relX, relY];
    }

    /**
     * renders a list of particles onto a context
     *
     * @param ctx - the context to be rendered onto
     * @param particles - the list of particles to render
     */
    function renderParticles(ctx, particles) {
      const distancePerPixel = scaleRef.current;
      const notesByParticle = notesByParticleRef.current;
      let hoveredParticle;

      // this loop draws each particle onto the canvas
      for (const particle of particles) {
        if (particle != null) {
          const [relX, relY] = absoluteToCanvas(
            particle.position[0],
            particle.position[1]
          );
          const relRadius = particle.radius / distancePerPixel;

          const distToMouse = Math.sqrt(
            Math.pow(mouseRef.current.x - relX, 2) +
            Math.pow(mouseRef.current.y - relY, 2)
          );
          const mouseOver = relRadius > distToMouse;

          if (mouseOver) {
            hoveredParticle = particle;
          }

          let noteName = "dir";
          let noteColor = "#808080";
          if (particle.id in notesByParticle) {
            noteName = notesByParticle[particle.id].name;
            const noteTags = notesByParticle[particle.id].tags;
            if (noteTags.length > 0) {
              noteColor = tagsRef.current[noteTags[0]].color; //averageColor(...noteTags.map(e => tagsRef.current[e].color));
            } else {
              noteColor = "#FFFFFF";
            }
          }
          drawCircle(ctx, relX, relY, relRadius, noteColor);
          drawText(
            ctx,
            relX,
            relY,
            noteName,
            (3 * relRadius) / noteName.length,
            true
          );
        }
      }

      // it is necessary to draw the hovered particle after-the-fact so that it is "on-top" of other particles
      if (hoveredParticle != null) {
        const [relX, relY] = absoluteToCanvas(
          hoveredParticle.position[0],
          hoveredParticle.position[1]
        );
        const relRadius = (1.2 * hoveredParticle.radius) / distancePerPixel;
        const noteName = notesByParticle[hoveredParticle.id].name;
        drawCircle(ctx, relX, relY, relRadius, "red");
        drawText(
          ctx,
          relX,
          relY,
          noteName,
          (3 * relRadius) / noteName.length,
          true
        );
        const particleNote = notesByParticle[hoveredParticle.id];
        drawText(
          ctx,
          mouseRef.current.x + 5,
          mouseRef.current.y + 20,
          "Title: " + particleNote.name,
          10,
          false
        );
        drawText(
          ctx,
          mouseRef.current.x + 5,
          mouseRef.current.y + 32,
          "Path: " + particleNote.path,
          10,
          false
        );
        drawText(
          ctx,
          mouseRef.current.x + 5,
          mouseRef.current.y + 44,
          "Tags: " + particleNote.tags,
          10,
          false
        );
        drawText(
          ctx,
          mouseRef.current.x + 5,
          mouseRef.current.y + 56,
          "Description: " + particleNote.description,
          10,
          false
        );
        drawText(
          ctx,
          mouseRef.current.x + 5,
          mouseRef.current.y + 68,
          "Links: " + particleNote.links,
          10,
          false
        );
      }
    }

    /**
     * draws all the constraints of a physics environment on a canvas context
     *
     * @param ctx - the context to be drawn on
     * @param constraints - the constraints to be drawn
     */
    function renderConstraints(ctx, constraints) {
      const distancePerPixel = scaleRef.current;
      const width = 1;
      const sagitta = 4 / distancePerPixel;
      const dashPattern = [0.5 / distancePerPixel, 0.2 / distancePerPixel];

      for (const constraint of constraints) {
        if (constraint != null) {
          const [startX, startY] = absoluteToCanvas(
            constraint.particleA.position[0],
            constraint.particleA.position[1]
          );
          const [endX, endY] = absoluteToCanvas(
            constraint.particleB.position[0],
            constraint.particleB.position[1]
          );
          drawOutsetCurve(
            ctx,
            startX,
            startY,
            endX,
            endY,
            sagitta,
            width,
            "#FFFFFF",
            dashPattern
          );
        }
      }
    }

    const physicsUpdate = setInterval(() => {
      const physicsEnvironment = physicsRef.current;
      // console.log(physicsEnvironment);
      physicsEnvironment.step(0.01);
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");

      ctx.fillStyle = "#404050";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      renderConstraints(ctx, physicsEnvironment.constraints);
      renderParticles(ctx, physicsEnvironment.particles);
    }, 1);

    return () => {
      clearInterval(physicsUpdate);
    };
  }, []);

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  /**
   * Rescales the current view window of the map based on mouse scroll.
   * @param {WheelEvent} e a wheel event
   */
  function scrollZoom(e) {
    const scale = scaleRef.current;
    if (e.deltaY < 0 && scale < MAX_SCALE) {
      scaleRef.current = scale * 1.1;
      console.log("new scale: ", scaleRef.current);
    }

    if (e.deltaY > 0 && scale > MIN_SCALE) {
      scaleRef.current = scale * 0.9;
      console.log("new scale: ", scaleRef.current);
    }
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  function dblClickHandler(e) {

    const distancePerPixel = scaleRef.current;

    const canvas = canvasRef.current;

    const canvasLeftBorder = offsetRef.current.x - distancePerPixel * canvas.width * 0.5;
    const canvasBottomBorder =
      offsetRef.current.y - distancePerPixel * canvas.height * 0.5;
    const PhysicsEnvironment = physicsRef.current;

    for (const particle of PhysicsEnvironment.particles) {
      const relX = (particle.position[0] - canvasLeftBorder) / distancePerPixel;
      const relY =
        canvas.height -
        (particle.position[1] - canvasBottomBorder) / distancePerPixel;
      const relRadius = particle.radius / distancePerPixel;

      const distToMouse = Math.sqrt(
        Math.pow(mouseRef.current.x - relX, 2) +
        Math.pow(mouseRef.current.y - relY, 2)
      );
      const mouseOver = relRadius > distToMouse;

      if (mouseOver) {
        props.history.push({
          pathname: "/editor",
          state: { note: notesByParticleRef.current[particle.id].path }
        });
        window.location.href = "/editor";
      }
    }
  }

  function mouseMoveHandler(e) {
    const canvasBounds = canvasRef.current.getBoundingClientRect();
    mouseRef.current.x = e.clientX - canvasBounds.left;
    mouseRef.current.y = e.clientY - canvasBounds.top;
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  document.body.style.overflow = "hidden";

  return (
    <div>
      <canvas
        ref={canvasRef}
        height={VIEW_HEIGHT}
        width={VIEW_WIDTH}
        onWheel={scrollZoom}
        onMouseDown={(e) =>
          startPan(e, scaleRef.current, MIN_X, MAX_X, MIN_Y, MAX_Y)
        }
        onDoubleClick={dblClickHandler}
        onMouseMove={mouseMoveHandler}
      />
    </div>
  );
}

export default NoteWeb;

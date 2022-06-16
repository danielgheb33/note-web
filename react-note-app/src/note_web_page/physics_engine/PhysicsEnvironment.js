import Constraint from "./Constraint";
import Particle from "./Particle";
import {
  dot_product,
  scalar_multiply,
  vector_add,
  vector_norm,
  vector_subtract,
} from "./vector_utilities";

export default class PhysicsEnvironment {
  /**
   * Creates a physics environment with a particular set of dimensions.
   *
   * @constructor
   * @param {number} dimensions
   */
  constructor(dimensions) {
    this.dimensions = dimensions;
    this.bounds = new Array(dimensions).fill([0, 0]);
    this.particles = [];
    this.vacant_particles = [];
    this.constraints = [];
    this.vacant_constraints = [];
    this.group_dict = {};
    this.gravity = 0;
    this.atmosphere = 0;
    // this.collisionForceCalc =
    //   (overlap, p1, p2) => -30 * overlap;
    // this.groupForceCalc =
    //   (c, v1, v2, dist) => c * v1 * v2;
  }

  ///////////////////////////////////////////////Adding-Removing Particles/////////////////////////

  /**
   * Adds a particle to the environment.
   *
   * @param {object} group_values an object mapping the groups to which to particle belongs to its values in those groups
   * @param {number} radius the radius of the new particle
   * @param {number} mass the mass of the new particle
   * @param {number[]} position the position vector of the new particle
   * @param {number[]} velocity the velocity of the new
   * @param {boolean} fixed a boolean indicating if the particle is fixed in space
   * @param {number[]} force the initial force vector experienced by the particle
   * @returns {number} the id of the particle that was added
   */
  addParticle(group_values, radius, mass, position, velocity, fixed, force) {

    let newID;

    // If there is an empty slot in the particle list, then the new particle is placed there.
    // Otherwise the particle is placed at the end of the list.
    if (this.vacant_particles.length > 0) {
      newID = this.vacant_particles.pop();
      const newParticle = new Particle(
        newID,
        group_values,
        radius,
        mass,
        position,
        velocity,
        fixed,
        force
      );
      this.particles[newID] = newParticle;
    } else {
      newID = this.particles.length;
      const newParticle = new Particle(
        newID,
        group_values,
        radius,
        mass,
        position,
        velocity,
        fixed,
        force
      );
      this.particles.push(newParticle);
    }

    return newID;
  }

  /**
   * Removes the particle with the provided ID.
   *
   * @param {number} id the id of the particle to remove
   */
  removeParticle(id) {
    const connections = this.particles[id].connections_dict;
    for (const connectedID of Object.keys(connections)) {
      const connectedParticle = this.particles[connectedID];
      delete connectedParticle.connections_dict[id];  //removes references of the particle we are deleting from other particles
      const constraints = connections[connectedID];

      for (const constraintID of Object.keys(constraints)) {
        delete this.constraints[constraintID];  //deletes any constraints that the particle is a part of
        this.vacant_constraints.push(constraintID);
      }
    }
    delete this.particles[id];  //finally, we delete the actual particle
    this.vacant_particles.push(id);
  }

  ///////////////////////////////////////////////Adding-Removing Constraints///////////////////////

  /**
   * Creates a new constraint between two particles.
   *
   * @param {number} free_length the free length of the constraint (length when no forces are applied)
   * @param {number} stiffness the stiffness of the constraint (how much it wishes to return to the free length)
   * @param {number} dampening the dampening of the constraint (how much it resists changes in length)
   * @param {number} id_A the id of the first particle
   * @param {number} id_B the id of the second particle
   * @returns {number} the id of the new constraint
   */
  addConstraint(free_length, stiffness, dampening, id_A, id_B) {

    const particleA = this.particles[id_A];
    const particleB = this.particles[id_B];
    let newConstraint;
    let newID;

    // if there is a vacant spot in the constraints list, then the new constraint is placed there,
    // otherwise it is placed at the end of the constraints list
    if (this.vacant_constraints.length > 0) {
      newID = this.vacant_constraints.pop();
      newConstraint = new Constraint(
        newID,
        free_length,
        stiffness,
        dampening,
        particleA,
        particleB
      );
      this.constraints[newID] = newConstraint;
    } else {
      newID = this.constraints.length;
      newConstraint = new Constraint(
        newID,
        free_length,
        stiffness,
        dampening,
        particleA,
        particleB
      );
      this.constraints.push(newConstraint);
    }

    if (id_B in particleA.connections_dict) {
      particleA.connections_dict[id_B][newID] = newConstraint;
    } else {
      const innerDict = {};
      innerDict[newID] = newConstraint;
      particleA.connections_dict[id_B] = innerDict;
    }

    if (id_A in particleB.connections_dict) {
      particleB.connections_dict[id_A][newID] = newConstraint;
    } else {
      const innerDict = {};
      innerDict[newID] = newConstraint;
      particleB.connections_dict[id_A] = innerDict;
    }

    return newID;
  }

  /**
   * Removes the constraint with the provided ID.
   *
   * @param {number} id the id of the constraint to remove
   */
  removeConstraint(id) {
    const particleA = this.constraints[id].particleA;
    const particleB = this.constraints[id].particleB;
    delete particleA.connections_dict[particleB.id][id];
    delete particleB.connections_dict[particleA.id][id];
    delete this.constraints[id];
    this.vacant_constraints.push(id);
  }

  ///////////////////////////////////////////////Adding-Removing Group Interactions////////////////

  /**
   * Adds a group to the environment along with the attraction constant that particles in that 
   * group experience towards other particles in that group.
   * 
   * @param {string} group a group
   * @param {number} attraction the attraction that particles in that group feel towards each other
   */
  setGroup(group, attraction) {
    if (group in this.group_dict) {
      this.group_dict[group][group] = attraction;
    } else {
      const innerDict = {};
      innerDict[group] = attraction;
      this.group_dict[group] = innerDict;
    }
  }

  /**
   * Adds an interaction (attraction value) between particles of different groups.
   *
   * @param {string} group1 the first group in the interaction
   * @param {string} group2 the second group in the interaction
   * @param {number} attraction the attraction constant
   */
  addInteraction(group1, group2, attraction) {
    if (group1 in this.group_dict) {
      this.group_dict[group1][group2] = attraction;
    } else {
      const innerDict = {};
      innerDict[group2] = attraction;
      this.group_dict[group1] = innerDict;
    }

    if (group2 in this.group_dict) {
      this.group_dict[group2][group1] = attraction;
    } else {
      const innerDict = {};
      innerDict[group1] = attraction;
      this.group_dict[group2] = innerDict;
    }
  }

  /**
   * Deletes a group from the interaction table.
   *
   * @param {string} group the group to delete
   */
  removeGroup(group) {
    for (const otherGroup of Object.keys(this.group_dict[group])) {
      delete this.group_dict[otherGroup][group];
    }
    delete this.group_dict[group];
  }

  /////////////////////////////////////////////////Calculating Environment Forces//////////////////

  /**
   * Calculates the force felt by a particle pushing it back into bounds.
   *
   * @param {Particle} particle the particle
   * @returns {number[]} the force vector felt by the particle due to being in/out of bounds
   */
  boundingForce(particle) {
    const bounding_forces = [];
    for (let d = 0; d < this.dimensions; d++) {
      const lower_bound = this.bounds[d][0];
      const upper_bound = this.bounds[d][1];
      const position = particle.position[d];

      const escape_penalty = 50; // the force that the particle feels pushing it back in bounds
      let bounding_force = 0;
      if (position < lower_bound) {
        bounding_force = escape_penalty;
      }
      if (position > upper_bound) {
        bounding_force = -escape_penalty;
      }
      bounding_forces.push(bounding_force);
    }
    return bounding_forces;
  }

  /**
   * Calculates the drag force felt by a particle.
   *
   * @param {Particle} particle the particle
   * @returns {number[]} the force vector felt by the particle due to atmospheric drag
   */
  dragForce(particle) {
    return scalar_multiply(-this.atmosphere, particle.velocity);
  }

  /**
   * Calculates the environmental forces on a particle and applies them (forces not caused by other
   * particles)
   *
   * @param {Particle} particle the particle
   * @return {number[]} the force on the particle due to the environment
   */
  environmentForces(particle) {
    const drag = this.dragForce(particle);
    const bounding = this.boundingForce(particle);
    return vector_add(drag, bounding);
  }

  /////////////////////////////////////////////////Calculating Inter-Particle Forces///////////////

  /**
   * Calculates the force between two particles due to gravity.
   *
   * @param {number} massA the first mass
   * @param {number} massB the second mass
   * @param {number} distance the distance between the two masses
   * @returns {number} the magnitude of the gravitational force betweeen two masses
   */
  gravitationalForce(massA, massB, distance) {
    return (this.gravity * massA * massB) / (distance * distance);
  }

  /**
   * Calculates the force between two particles due to collision.
   *
   * @param {Particle} particleA the first particle
   * @param {Particle} particleB the second particle
   * @param {number} distance the distance between the two particles
   * @returns {number} the magnitude of the collision force between two particles
   */
  collisionForce(particleA, particleB, distance) {
    const overlap = (1 * (particleA.radius + particleB.radius)) - distance;
    // this.collisionForceCalc(overlap)
    return overlap > 0 ? -100 * overlap : 0;
  }

  /**
   * Calculates the force between two particles due to their groups.
   *
   * @param {Particle} particleA the first particle
   * @param {Particle} particleB the second particle
   * @param {number} distance the distance between the two particles
   * @returns {number} the magnitude of the force between two particles due to their groups
   */
  groupForces(particleA, particleB, distance) {
    let force = 0;
    for (const groupA of Object.keys(particleA.group_values)) {
      for (const groupB of Object.keys(particleB.group_values)) {
        if ((groupA in this.group_dict) && (groupB in this.group_dict)) {
          const attractionConstant = this.group_dict[groupA][groupB];
          const valA = particleA.group_values[groupA];
          const valB = particleB.group_values[groupB];
          const interaction = attractionConstant * valA * valB * distance;
          // this.groupForceCalc(attractionConstant, valA, valB, distance);
          force += interaction;
        }
      }
    }
    return force;
  }

  /**
   * Calculates the spring force of a constraint.
   * 
   * @param {Constraint} constraint the constraint
   * @param {number} length the length of the constraint
   * @return {number} the scalar of the force from a spring
   */
  springForce(constraint, length, direction) {
    return (length - constraint.free_length) * constraint.stiffness;
  }

  /**
   * Calculates the dampening force of a constraint given its velocity and direction.
   * 
   * @param {Constraint} constraint the constraint
   * @param {number[]} velocity the relative velocity of the ends of the spring
   * @param {number[]} direction the direction vector of the spring (which way is the spring pointing?)
   * @return {number} the scalar of the dampening force
   */
  dampeningForce(constraint, velocity, direction) {
    return dot_product(velocity, direction) * constraint.dampening;
  }

  /**
   * Calculates the force felt by particleA due to interactions with particleB.
   * 
   * @param {Particle} particleA the first particle in the interaction
   * @param {Particle} particleB the second particle in the interaction
   * @return {number[]} the force vector felt by particleA from the sum of interactions 
   */
  interactiveForces(particleA, particleB) {
    const difference =
      vector_subtract(particleB.position, particleA.position);
    const velocity_difference =
      vector_subtract(particleB.velocity, particleA.velocity);
    let distance = vector_norm(difference);
    distance = distance < 1e-10 ? 1e-10 : distance; //prevents division by zero
    const direction = scalar_multiply(1 / distance, difference);

    const gravitational_force = this.gravitationalForce(particleA.mass, particleB.mass, distance);
    const collision_force = this.collisionForce(particleA, particleB, distance);
    const group_forces = this.groupForces(particleA, particleB, distance);

    let constraint_force = 0;
    if (particleB.id in particleA.connections_dict) {
      for (const constraint of Object.values(particleA.connections_dict[particleB.id])) {
        constraint_force += this.springForce(constraint, distance);
        constraint_force += this.dampeningForce(constraint, velocity_difference, direction);
      }
    }

    const total_force = gravitational_force + collision_force + group_forces + constraint_force;
    return scalar_multiply(total_force, direction);
  }

  /////////////////////////////////////////////////Applying All Forces///////////////////////////////

  /**
   * Sets the forces of all particles in the environment to zero.
   */
  clearForces() {
    for (const particle of this.particles) {
      particle.force.fill(0);
    }
  }

  /**
   * Calculates the force on each particle of the environment and adds it.
   */
  applyForces() {
    for (let i = 0; i < this.particles.length; ++i) {
      if (this.particles[i] != null) {
        const particle_i = this.particles[i];
        particle_i.force = vector_add(particle_i.force, this.environmentForces(particle_i));

        for (let j = i + 1; j < this.particles.length; ++j) {
          if (this.particles[j] != null) {
            const particle_j = this.particles[j];

            const force_i = this.interactiveForces(particle_i, particle_j);
            const force_j = scalar_multiply(-1, force_i);

            particle_i.force = vector_add(particle_i.force, force_i);
            particle_j.force = vector_add(particle_j.force, force_j);
          }
        }
      }
    }
  }

  /**
   * Advances the physics environment by a time step determined by time_step.
   * 
   * @param {number} time_step the amount of time to advance the system
   */
  step(time_step) {
    this.clearForces();
    this.applyForces();
    for (const particle of this.particles) {
      if (particle != null) {
        particle.step(time_step);
      }
    }
  }
}

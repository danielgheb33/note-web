import { scalar_multiply, vector_add } from "./vector_utilities";

export default class Particle {
  /**
   * Creates a particle with the ability to set all parameters.
   *
   * @constructor
   * @param {number} id the id of the particle
   * @param {object} group_values an object mapping the groups to which to particle belongs to its values in those groups
   * @param {number} radius the radius of the particle at the time of creation
   * @param {number} mass the mass of the particle at the time of creation
   * @param {number[]} position the position vector of the particle at the time of creation
   * @param {number[]} velocity the velocity vector of the particle at the time of creation
   * @param {boolean} fixed a boolean determining whether the particle is fixed or able to move/be moved
   * @param {number[]} force the force vector that the particle experiences at the time of creation
   */
  constructor(id, group_values, radius, mass, position, velocity, fixed, force) {
    this.id = id;
    this.group_values = group_values;
    this.radius = radius;
    this.mass = mass;
    this.position = position;
    this.velocity = velocity || new Array(position.length).fill(0);
    this.fixed = fixed || false;
    this.force = force || new Array(position.length).fill(0);
    this.connections_dict = {};
  }

  /**
   * This method updates the values of the particle over a single time step with the application of a constant force.
   *
   * @param {number} time_step - the amount of time over which the change occurs
   */
  step(time_step) {
    if (this.fixed) {
      this.position = vector_add(
        this.position,
        scalar_multiply(time_step, this.velocity)
      );
    } else {
      const acceleration = scalar_multiply(this.mass, this.force);
      const next_velocity = vector_add(
        this.velocity,
        scalar_multiply(time_step, acceleration)
      );
      const avg_velocity = scalar_multiply(
        0.5,
        vector_add(this.velocity, next_velocity)
      );

      // here we update the values
      this.position = vector_add(
        this.position,
        scalar_multiply(time_step, avg_velocity)
      );
      this.velocity = next_velocity;
    }
  }
}

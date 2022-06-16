export default class Constraint {
  /**
   * Creates an unbreakable constraint between two particles with a particular free-length (length to
   * which the constraint wishes to return), stiffness (resistance to shifting the length of the
   * constraint away from the free-length), and dampening (resistance to sudden changes in the length)
   *
   * @param {number} id the id of the constraint
   * @param {number} free_length the default length of the constraint
   * @param {number} stiffness the resistance to changes in the length away from the free-length
   * @param {number} dampening the resistance to sudden changes in the length
   * @param {Particle} particleA the first object to which the constraint is linked
   * @param {Particle} particleB the second object to which the constraint is linked
   */
  constructor(id, free_length, stiffness, dampening, particleA, particleB) {
    this.id = id;
    this.free_length = free_length;
    this.stiffness = stiffness;
    this.dampening = dampening;
    this.particleA = particleA;
    this.particleB = particleB;
  }
}

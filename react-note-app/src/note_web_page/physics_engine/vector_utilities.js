
/**
 * Sums the two vectors with element-wise addition.
 * 
 * @param {number[]} v1 the first vector to sum
 * @param {number[]} v2 the second vector to sum
 * @returns {number[]} the sum of the two vectors
 */
export function vector_add(v1, v2) {
    return v1.map((el, index) => el + v2[index]);
}

/**
 * Takes an arbitrary number of input vectors and returns the sum.
 * 
 * @returns the sum of all input vectors
 */
export function sum_vectors() {
    const sum = [];
    for (let i=0; i<arguments[0].length; i++) {
        let term = 0;
        for (let j=0; j<arguments.length; j++) {
            term += arguments[j][i];
        }
        sum.push(term);
    }
    return sum;
}

/**
 * Takes the difference of the two vectors with element-wise subtraction.
 * 
 * @param {number[]} v1 the vector to be subtracted from
 * @param {number[]} v2 the vector to subtract
 * @returns {number[]} the difference of the two vectors
 */
export function vector_subtract(v1, v2) {
    return v1.map((el, index) => el - v2[index]);
}

/**
 * Multiplies the vector "v" by a scalar "s".
 * 
 * @param {number} s the scalar
 * @param {number[]} v the vector to extend
 * @returns {number[]} the scaled vector
 */
export function scalar_multiply(s, v) {
    return v.map(el => s * el);
}

/**
 * Takes the dot product of two vectors.
 * 
 * @param {number[]} v1 the first vector to dot
 * @param {number[]} v2 the second vector to dot
 * @returns {number} the dot product of the two vectors
 */
export function dot_product(v1, v2) {
    return v1.reduce((acc, el, index) => acc + (el * v2[index]), 0);
}

/**
 * Finds the length/magnitude/norm of a vector.
 * 
 * @param {number[]} v the vector whose length we are finding
 * @returns {number} the length/magnitude/norm of the vector
 */
export function vector_norm(v) {
    const square_sums = v.reduce((acc, el) => acc + (el * el), 0);
    return Math.sqrt(square_sums);
}

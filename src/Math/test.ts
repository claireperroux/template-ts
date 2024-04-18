import { Matrix3x3 } from "./Matrix3x3";

const matrixA = new Matrix3x3([
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1]
]);

const matrixB = new Matrix3x3([
    [1, 1, 1],
    [1, 1, 1],
    [1, 1, 1]
]);

const resultMatrix = matrixA.multiply(matrixB);

console.log("Résultat de la multiplication des matrices:");
resultMatrix.elements.forEach(row => console.log(row.join(' ')));
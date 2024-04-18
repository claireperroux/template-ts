import { Vector2D } from "./Vector2D";

export class Matrix3x3 {

    elements: number[][];

    constructor(elements: number[][]) {
        this.elements = elements;
    }

    multiply(matrix: Matrix3x3): Matrix3x3 {
        let result: number[][] = [
            [0, 0, 0],
            [0, 0, 0],
            [0, 0, 0]
        ];
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                for (let k = 0; k < 3; k++) {
                    result[i][j] += this.elements[i][k] * matrix.elements[k][j];
                }
            }
        }
        return new Matrix3x3(result);
    }

}

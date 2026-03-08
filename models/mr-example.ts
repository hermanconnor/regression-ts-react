import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';
import * as math from 'mathjs';

/**
 * Perform Linear Regression using the Normal Equation:
 * B = (X'X)^-1 X'Y
 */
async function runRegression() {
  try {
    // 1. Setup Input Data
    const X: number[][] = [
      [1, 6], // [study hour, sleep hour]
      [2, 2],
      [3, 1],
      [4, 5],
      [5, 7],
    ];
    const Y: number[] = [60, 55, 50, 70, 85];

    // 2. Matrix Transformations
    const YMatrix = math.matrix(Y).resize([5, 1]);
    const XWithIntercept: number[][] = X.map((row) => [1, ...row]);

    const XMatrix = math.matrix(XWithIntercept);
    const XTransposed = math.transpose(XMatrix);

    // 3. Matrix Calculations
    const XTransposedX = math.multiply(XTransposed, XMatrix);
    const XTransposedY = math.multiply(XTransposed, YMatrix);

    // 4. Solve for coefficients (B)
    const inverseXTransposedX = math.inv(XTransposedX as math.Matrix);
    const BMatrix = math.multiply(
      inverseXTransposedX,
      XTransposedY,
    ) as math.Matrix;

    // 5. Format the resulting coefficients
    const coefficients: string[] = (BMatrix.toArray() as number[][]).map(
      (c: number[]) => c[0].toFixed(2),
    );

    // 6. File Saving Logic
    const outputPath = './public/mr-example-coefficients.json';
    const outputData = JSON.stringify({ coefficients }, null, 2);

    // Ensure directory exists
    await mkdir(dirname(outputPath), { recursive: true });

    // Save to JSON
    await writeFile(outputPath, outputData, 'utf-8');

    console.log('✅ Coefficients have been calculated and saved!');
    console.table({
      Intercept: coefficients[0],
      'Study Hours': coefficients[1],
      'Sleep Hours': coefficients[2],
    });
  } catch (error) {
    console.error('❌ Failed to process regression:', error);
    process.exit(1);
  }
}

runRegression();

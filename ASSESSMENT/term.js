
const fs = require('fs');

// Function to decode y-values based on the given base
function decodeYValue(value, base) {
    return parseInt(value, base);
}

// Function to perform Lagrange interpolation and find the constant term c
function lagrangeInterpolation(points) {
    let constantTerm = 0;

    // Loop over each point (xi, yi)
    for (let i = 0; i < points.length; i++) {
        const { x: xi, y: yi } = points[i];
        let term = yi;

        // Calculate the Lagrange basis polynomial for this point
        for (let j = 0; j < points.length; j++) {
            if (i !== j) {
                const { x: xj } = points[j];
                term *= -xj / (xi - xj); // Construct Lagrange term
            }
        }

        // Add the term to the constant term sum
        constantTerm += term;
    }

    return constantTerm;
}

// Main function to read input and solve for constant term c
function findConstantTerm(filePath) {
    // Read and parse the JSON file
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    
    // Extract keys and validate minimum requirements
    const { n, k } = data.keys;

    if (n < k) {
        console.error('Error: Not enough points to solve for the coefficients.');
        return;
    }

    const points = [];

    // Decode each (x, y) pair from JSON
    for (const [x, { value, base }] of Object.entries(data)) {
        if (!isNaN(x)) { // Filter out keys like 'keys'
            const decodedY = decodeYValue(value, parseInt(base)); // Decode y
            points.push({ x: parseInt(x), y: decodedY });
        }
    }

    // Find the constant term using Lagrange interpolation
    const constantTerm = lagrangeInterpolation(points);
    console.log('The constant term c is:', constantTerm);
}

// Example: Call the function with the input JSON file path
findConstantTerm('input.json');
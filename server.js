const thetaSpacing = 0.07;
const phiSpacing = 0.02;

const screenSize = { width: 450, height: 100 };

const R1 = 1; // Radius of tube of donut
const R2 = 2; // Distance from center of donut to center of tube
const K2 = 5;

const K1 = screenSize.width * K2 * 0.30 / (8 * (R1 + R2)); // Reduced the multiplier because it looked bad

function renderFrame(A, B) {
    let cosA = Math.cos(A), sinA = Math.sin(A);
    let cosB = Math.cos(B), sinB = Math.sin(B);

    let output = Array(screenSize.height).fill().map(() => Array(screenSize.width).fill(' '));
    let zBuffer = Array(screenSize.height).fill().map(() => Array(screenSize.width).fill(0));

    for (let theta = 0; theta < (2 * Math.PI); theta += thetaSpacing) {
        let cosTheta = Math.cos(theta), sinTheta = Math.sin(theta);

        for (let phi = 0; phi < 2 * Math.PI; phi += phiSpacing) {
            let cosPhi = Math.cos(phi), sinPhi = Math.sin(phi);
            let circleX = R2 + R1 * cosPhi;
            let circleY = R1 * sinPhi;

            let x = circleX * (cosB * cosTheta + sinA * sinB * sinTheta) - circleY * cosA * sinB;
            let y = circleX * (sinB * cosTheta - sinA * cosB * sinTheta) + circleY * cosA * cosB;
            let z = K2 + cosA * circleX * sinTheta + circleY * sinA;
            let oneOverZ = 1 / z;

            let xp = Math.floor(screenSize.width / 2 + K1 * oneOverZ * x);
            let yp = Math.floor(screenSize.height / 2 - K1 * oneOverZ * y);

            let L = (cosPhi * cosTheta * sinB) - (cosA * cosTheta * sinPhi) - (sinA * sinTheta) + (cosB * (cosA * sinTheta - cosTheta * sinA * sinPhi)); // some parentheses aren't really necessary, but I feel it looks better.

            if (xp >= 0 && xp < screenSize.width && yp >= 0 && yp < screenSize.height) {
                if (oneOverZ > zBuffer[yp][xp]) {
                  zBuffer[yp][xp] = oneOverZ;
                  let luminanceIndex = Math.floor((L + 1) * 6);
                  output[yp][xp] = ".,-~:;=!*#$@"[luminanceIndex] || '@';
                }
              }
        };
    };
    return output.map(row => row.join('')).join('\n');
};

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function animateDonut() {
    let A = 0, B = 0;
    while (true) {
        console.clear();
        console.log(renderFrame(A, B));
        console.log(`Frame: ${Math.floor(A * 100)}`);
        
        A += 0.07;
        B += 0.03;
        await sleep(50);
    }
}

animateDonut();

let canvas, ctx;
let driftingStars = [];
let risingStars = [];
const numDriftingStars = 300;
const numRisingStars = 50;
let time = 0;

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function createDriftingStars(width, height) {
    driftingStars = [];
    for (let i = 0; i < numDriftingStars; i++) {
        driftingStars.push({
            x: random(0, width),
            y: random(0, height),
            radius: 0.6,
            brightness: random(0.5, 1),
            speedX: random(0.05, 0.15),
            speedY: random(0.08, 0.18),
            oscillation: random(0.5, 1.5)
        });
    }
}

function createRisingStars(height) {
    risingStars = [];
    for (let i = 0; i < numRisingStars; i++) {
        risingStars.push({
            x: random(0, canvas.width),
            y: random(height * 0.3, height),
            radius: random(1.5, 3),
            brightness: random(0.6, 1),
            speedX: random(0.02, 0.05),
            speedY: random(0.05, 0.1),
            oscillation: random(0.3, 1.2)
        });
    }
}

function drawStars(stars, direction = "drift") {
    for (let star of stars) {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${random(200,255)}, ${random(200,255)}, 255, ${star.brightness})`;
        ctx.shadowBlur = 4;
        ctx.shadowColor = "white";
        ctx.fill();

        // Mise à jour de la position de chaque étoile
        star.x += star.speedX + Math.sin(time * 0.002) * star.oscillation;
        star.y += (direction === "drift" ? star.speedY : -star.speedY) + Math.cos(time * 0.002) * star.oscillation;
        star.x = (star.x + canvas.width) % canvas.width;
        star.y = direction === "drift" ? (star.y + canvas.height) % canvas.height : (star.y < 0 ? canvas.height : star.y);
    }
}

function animate() {
    // Nettoyage du canvas
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Dessin des étoiles
    drawStars(driftingStars, "drift");
    drawStars(risingStars, "rise");

    time += 1.5;
    requestAnimationFrame(animate);
}

onmessage = function(e) {
    if (e.data.canvas) {
        // Initialisation lors du premier message
        canvas = e.data.canvas;
        ctx = canvas.getContext("2d");
        canvas.width = e.data.width;
        canvas.height = e.data.height;
        createDriftingStars(canvas.width, canvas.height);
        createRisingStars(canvas.height);
        animate();
    } else if (e.data.type === "resize") {
        // Mise à jour lors d'un redimensionnement
        canvas.width = e.data.width;
        canvas.height = e.data.height;
        createDriftingStars(canvas.width, canvas.height);
        createRisingStars(canvas.height);
    }
};

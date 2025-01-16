const canvas = document.getElementById("spaceCanvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Déclaration des objets pour l'animation
const driftingStars = [];
const risingStars = [];
const nebulae = [];

const numDriftingStars = 1600;
const numRisingStars = 50;
const numNebulae = 6;

let time = 0;
let lastTimestamp = 0;

/** 
 * Génère un nombre aléatoire entre min et max
 * @param {number} min - Valeur minimale
 * @param {number} max - Valeur maximale
 * @returns {number} - Nombre aléatoire
 */
const random = (min, max) => Math.random() * (max - min) + min;

/**
 * Initialise les étoiles dérivantes qui se déplacent lentement dans le fond
 */
function createDriftingStars() {
    for (let i = 0; i < numDriftingStars; i++) {
        driftingStars.push({
            x: random(0, canvas.width),
            y: random(0, canvas.height),
            radius: random(0.3, 0.7),
            brightness: random(0.5, 1),
            speedX: random(0.05, 0.15),
            speedY: random(0.08, 0.18),
            oscillation: random(0.5, 1.5)
        });
    }
}

/**
 * Initialise les étoiles montantes
 */
function createRisingStars() {
    for (let i = 0; i < numRisingStars; i++) {
        risingStars.push({
            x: random(0, canvas.width),
            y: random(canvas.height * 0.5, canvas.height),
            radius: random(1.5, 3),
            brightness: random(0.6, 1),
            speedX: random(0.02, 0.05),
            speedY: random(0.05, 0.1),
            oscillation: random(0.3, 1.2)
        });
    }
}

/**
 * Initialise les nébuleuses
 */
function createNebulae() {
    for (let i = 0; i < numNebulae; i++) {
        let size = random(300, 600);
        nebulae.push({
            x: random(0, canvas.width),
            y: random(0, canvas.height),
            size: size,
            opacity: 0.018,
            cloudiness: random(0.4, 0.6),
            color: `rgba(30, 144, 255, ${random(0.02, 0.04)})`,
            speedX: random(0.004, 0.012),
            speedY: random(0.002, 0.008),
            opacityVariation: random(0.0002, 0.0005),
            shapeNoise: random(5, 15) // Ajoute un effet de dispersion
        });
    }
}

/**
 * Dessine et anime les nébuleuses.
 */
function drawNebulae() {
    for (let nebula of nebulae) {
        let gradient = ctx.createRadialGradient(
            nebula.x, nebula.y, nebula.size * 0.3,
            nebula.x, nebula.y, nebula.size
        );
        gradient.addColorStop(0, nebula.color);
        gradient.addColorStop(0.5, `rgba(30, 144, 255, ${nebula.opacity * 0.5})`);
        gradient.addColorStop(1, "rgba(0, 0, 0, 0)");

        ctx.globalAlpha = nebula.cloudiness;
        ctx.globalCompositeOperation = "lighter";
        ctx.beginPath();
        ctx.fillStyle = gradient;

        // Création d’une forme naturelle avec des variations aléatoires
        let points = 10 + Math.floor(Math.random() * nebula.shapeNoise);
        let angleStep = (Math.PI * 2) / points;

        ctx.moveTo(nebula.x + Math.cos(0) * nebula.size, nebula.y + Math.sin(0) * nebula.size);
        for (let i = 1; i <= points; i++) {
            let angle = i * angleStep;
            let radius = nebula.size * (0.8 + Math.random() * 0.4);
            let x = nebula.x + Math.cos(angle) * radius;
            let y = nebula.y + Math.sin(angle) * radius;
            ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();

        ctx.globalCompositeOperation = "source-over";
        ctx.globalAlpha = 1;

        // Déplacement
        nebula.x += nebula.speedX * Math.sin(time * 0.0003);
        nebula.y += nebula.speedY * Math.cos(time * 0.0003);

        // Variation d’opacité
        nebula.opacity += nebula.opacityVariation;
        if (nebula.opacity > 0.05 || nebula.opacity < 0.02) {
            nebula.opacityVariation *= -1;
        }

        // Bouclage sur les bords
        nebula.x = (nebula.x + canvas.width) % canvas.width;
        nebula.y = (nebula.y + canvas.height) % canvas.height;
    }
}

/**
 * Dessine et anime les étoiles dérivantes.
 */
function drawStars(stars, direction = "drift") {
    for (let star of stars) {
        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${random(200, 255)}, ${random(200, 255)}, 255, ${star.brightness})`;
        ctx.shadowBlur = 4;
        ctx.shadowColor = "white";
        ctx.fill();

        // Mise à jour de la position
        star.x += star.speedX + Math.sin(time * 0.002) * star.oscillation;
        star.y += (direction === "drift" ? star.speedY : -star.speedY) + Math.cos(time * 0.002) * star.oscillation;

        // Bouclage sur les bords
        star.x = (star.x + canvas.width) % canvas.width;
        star.y = direction === "drift"
            ? (star.y + canvas.height) % canvas.height
            : (star.y < 0 ? canvas.height : star.y);
    }
}

/**
 * Fonction d'animation
 */
function animate(timestamp) {
    lastTimestamp = timestamp;

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    drawNebulae();
    drawStars(driftingStars, "drift");
    drawStars(risingStars, "rise");

    time += 1.5;
    requestAnimationFrame(animate);
}


window.addEventListener("resize", () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
});

createDriftingStars();
createRisingStars();
createNebulae();
requestAnimationFrame(animate);

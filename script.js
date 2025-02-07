const ROWS = 50;
const COLS = 150;
const NUM_PARTICLES = ROWS * COLS;
const SPACING = 3; // Überprüfe, ob ein größerer Abstand hier hilft
const MARGIN = 100;
const THICKNESS = Math.pow(40, 2); // Verdrängungseffekt
const COLOR = 220;
const DRAG = 0.95;
const EASE = 0.25;
const canvas = document.createElement("canvas");
const ctx = canvas.getContext("2d");

let container, image, pixels = [], mouseX, mouseY, stats;
let w, h, t, mx, my, man = false, tog = true;

const particle = {
  vx: 0,
  vy: 0,
  x: 0,
  y: 0,
  ox: 0,
  oy: 0,
  r: 0,
  g: 0,
  b: 0,
  a: 0
};

// Initialisierung der Canvas und des Partikel-Arrays
function init() {
  container = document.getElementById("container");
  container.appendChild(canvas); // Canvas zum Container hinzufügen
  
  // Bild laden
  image = new Image();
  image.src = 'LoriAnzugDunkelblau.png'; // Pfad zum Bild (achte darauf, dass der Pfad korrekt ist)
  
  image.onload = function() {
    const scaleFactor = 0.12; // Skaliere das Bild auf 12% der Originalgröße
    canvas.width = image.width * scaleFactor;
    canvas.height = image.height * scaleFactor;

    // Bild auf das Canvas zeichnen
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height); 

    // Bilddaten extrahieren
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    // Partikel-Daten aus den Bilddaten extrahieren
    for (let y = 0; y < canvas.height; y += SPACING) {
      for (let x = 0; x < canvas.width; x += SPACING) {
        const index = (y * canvas.width + x) * 4;
        const r = data[index];
        const g = data[index + 1];
        const b = data[index + 2];
        const a = data[index + 3];

        pixels.push({
          x, y,
          ox: x,
          oy: y,
          vx: 0,
          vy: 0,
          r, g, b, a
        });
      }
    }

    // Event Listener für Mausbewegungen
    container.addEventListener("mousemove", function (e) {
      const bounds = container.getBoundingClientRect();
      mouseX = e.clientX - bounds.left;
      mouseY = e.clientY - bounds.top;
      man = true;
    });

    // Event Listener für Mausverlassen
    container.addEventListener("mouseleave", function() {
      man = false; // Wenn die Maus den Bereich verlässt, wird man auf false gesetzt
    });

    // Animation starten
    animate();
  };

  image.onerror = function() {
    console.error("Das Bild konnte nicht geladen werden. Überprüfe den Bildpfad.");
  };
}

// Animation der Partikel
function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Canvas löschen

  for (let i = 0; i < pixels.length; i++) {
    const p = pixels[i];

    let dx = mouseX - p.x;
    let dy = mouseY - p.y;
    let distanceSquared = dx * dx + dy * dy;
    let force = -THICKNESS / distanceSquared;

    // Wenn die Maus im Bereich des Canvas ist, wird die Partikel-Verdrängung aktiviert
    if (man && distanceSquared < THICKNESS) {
      const angle = Math.atan2(dy, dx);
      p.vx += force * Math.cos(angle);
      p.vy += force * Math.sin(angle);
    } else {
      // Wenn die Maus den Bereich verlässt, wird die Geschwindigkeit zurückgesetzt und der Effekt schließt sich
      p.vx *= DRAG;
      p.vy *= DRAG;
      p.x += (p.vx += (p.ox - p.x) * EASE);
      p.y += (p.vy += (p.oy - p.y) * EASE);
    }

    // Partikel zeichnen
    ctx.fillStyle = `rgba(${p.r}, ${p.g}, ${p.b}, ${p.a / 255})`;
    ctx.fillRect(p.x, p.y, SPACING, SPACING);
  }

  // Nutzung von requestAnimationFrame für flüssigere Animation
  requestAnimationFrame(animate);
}

// Initialisierung starten
init();

// Auto-generated seating data. Only the Brauttisch is seated so far; everyone
// else has table/seat set to null until their table is decided. Table colors
// double as the "find your table" color for the photo session.
//
// Coordinate space is shared by the floor-plan overview AND the per-table
// detail view (the detail view just crops its <svg viewBox> to one table's
// bounding box), so every shape/seat is defined once, here.
//
// `colors` on a guest is an array of photo-group color names (a person can
// be in multiple groups, shown as a pie-sliced seat marker). Photo-group
// assignment hasn't happened yet, so every guest is temporarily "rot" here.

function rectSeats(rect, cap) {
  const top = Math.ceil(cap / 2);
  const bottom = cap - top;
  const seats = [];
  for (let i = 0; i < top; i++) {
    seats.push({ x: rect.x + (rect.w * (i + 0.5)) / top, y: rect.y - 14, dir: "n" });
  }
  for (let i = 0; i < bottom; i++) {
    seats.push({ x: rect.x + (rect.w * (i + 0.5)) / bottom, y: rect.y + rect.h + 14, dir: "s" });
  }
  return seats;
}

const brauttischTop = { x: 320, y: 90, w: 340, h: 70 };
const brauttischLeftArm = { x: 320, y: 170, w: 100, h: 110 };
const brauttischRightArm = { x: 560, y: 170, w: 100, h: 110 };

// The Brauttisch is one C-shaped table (16 seats), not three separate tables:
// 6 along the top bar, 3 along the outside of each arm, 1 on the outer bottom
// tip of each arm, and 1 on the inside of each arm facing into the opening
// (which faces the Bühne).
const brauttischSeats = [
  ...[0, 1, 2, 3, 4, 5].map((i) => ({
    x: brauttischTop.x + (brauttischTop.w * (i + 0.5)) / 6,
    y: brauttischTop.y - 14,
    dir: "n",
  })),
  ...[0, 1, 2].map((i) => ({
    x: brauttischLeftArm.x - 14,
    y: brauttischLeftArm.y + (brauttischLeftArm.h * (i + 0.5)) / 3,
    dir: "w",
  })),
  { x: brauttischLeftArm.x + brauttischLeftArm.w / 2, y: brauttischLeftArm.y + brauttischLeftArm.h + 14, dir: "s" },
  { x: brauttischLeftArm.x + brauttischLeftArm.w + 14, y: brauttischLeftArm.y + brauttischLeftArm.h / 2, dir: "e" },
  ...[0, 1, 2].map((i) => ({
    x: brauttischRightArm.x + brauttischRightArm.w + 14,
    y: brauttischRightArm.y + (brauttischRightArm.h * (i + 0.5)) / 3,
    dir: "e",
  })),
  { x: brauttischRightArm.x + brauttischRightArm.w / 2, y: brauttischRightArm.y + brauttischRightArm.h + 14, dir: "s" },
  { x: brauttischRightArm.x - 14, y: brauttischRightArm.y + brauttischRightArm.h / 2, dir: "w" },
];

const RECT_TABLE_DEFS = [
  { id: "t3", label: "Tisch 3", cap: 10, color: "#828C7B", rect: { x: 20, y: 80, w: 260, h: 70 } },
  { id: "t4", label: "Tisch 4", cap: 8, color: "#A67C5A", rect: { x: 20, y: 170, w: 260, h: 70 } },
  { id: "t5", label: "Tisch 5", cap: 8, color: "#9CAF88", rect: { x: 20, y: 260, w: 260, h: 70 } },
  { id: "t6", label: "Tisch 6", cap: 10, color: "#B08968", rect: { x: 20, y: 350, w: 260, h: 70 } },
  { id: "t7", label: "Tisch 7", cap: 10, color: "#7D8C74", rect: { x: 730, y: 190, w: 230, h: 70 } },
  { id: "t8", label: "Tisch 8", cap: 10, color: "#D6B589", rect: { x: 730, y: 280, w: 230, h: 70 } },
  { id: "t9", label: "Tisch 9", cap: 6, color: "#8C6F5C", rect: { x: 730, y: 370, w: 230, h: 70 } },
];

const TABLES = [
  {
    id: "brauttisch",
    label: "Brauttisch",
    cap: 16,
    color: "#BF8B78",
    shapeRects: [brauttischTop, brauttischLeftArm, brauttischRightArm],
    seats: brauttischSeats,
  },
  ...RECT_TABLE_DEFS.map((t) => ({
    id: t.id,
    label: t.label,
    cap: t.cap,
    color: t.color,
    shapeRects: [t.rect],
    seats: rectSeats(t.rect, t.cap),
  })),
];

// Non-seating landmarks, drawn for orientation only.
const LANDMARKS = [
  { id: "theke", label: "Theke", rect: { x: 730, y: 20, w: 230, h: 70 } },
  { id: "garten", label: "Garten / Außenbereich", rect: { x: 730, y: 100, w: 230, h: 60 } },
  { id: "buehne", label: "Bühne", rect: { x: 320, y: 420, w: 340, h: 70 } },
];

// Bold, easily-told-apart photo-group colors. Kept as a shared lookup so the
// main seating plan and the Fotoliste page render identical colors.
const PHOTO_COLOR_HEX = {
  rot: "#e11d1d",
  blau: "#1d63e1",
  gruen: "#1f9e4c",
  grün: "#1f9e4c",
  gelb: "#f0c419",
  orange: "#f0790a",
  lila: "#8e3fd6",
  violett: "#8e3fd6",
  rosa: "#e0489a",
  pink: "#e0489a",
  tuerkis: "#12a4a0",
  türkis: "#12a4a0",
  schwarz: "#2b2b2b",
  weiss: "#e9e3da",
  weiß: "#e9e3da",
  grau: "#8a8a86",
  braun: "#6b4a35",
  beige: "#c9b896",
  gold: "#c9a24b",
  silber: "#b9b9b3",
};

function photoColorHex(name) {
  const known = PHOTO_COLOR_HEX[name.toLowerCase()];
  if (known) return known;
  // Fallback so an unrecognized color word (future data) still gets a
  // distinct, stable color instead of breaking.
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return `hsl(${hash % 360}, 60%, 45%)`;
}

// Pure geometry for pie-sliced seat markers (a guest with multiple colors
// gets one wedge per color). No DOM here — each page's own script draws the
// actual <path> using its own element-creation helper.
function photoPolarPoint(cx, cy, r, angleDeg) {
  const rad = ((angleDeg - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function photoPieSlicePath(cx, cy, r, startAngle, endAngle) {
  const start = photoPolarPoint(cx, cy, r, endAngle);
  const end = photoPolarPoint(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y} Z`;
}

const GUESTS = [
  // Brauttisch — seated per couple's placement (2026-08-09). Seat 10 (inside, left arm) is open.
  { name: "Hans-Walter Schaller", table: "brauttisch", seat: 0, isChild: false, isVeggie: false, isVegan: false, colors: ["rot"] },
  { name: "Beate Schaller", table: "brauttisch", seat: 1, isChild: false, isVeggie: false, isVegan: false, colors: ["rot"] },
  { name: "Barbara Schaller-Graß", table: "brauttisch", seat: 2, isChild: false, isVeggie: false, isVegan: false, colors: ["rot"] },
  { name: "Christopher Schaller-Graß", table: "brauttisch", seat: 3, isChild: false, isVeggie: false, isVegan: false, colors: ["rot"] },
  { name: "Stefan Graß", table: "brauttisch", seat: 4, isChild: false, isVeggie: false, isVegan: false, colors: ["rot"] },
  { name: "Andrea Graß", table: "brauttisch", seat: 5, isChild: false, isVeggie: false, isVegan: false, colors: ["rot"] },
  { name: "Christoph Schaller", table: "brauttisch", seat: 6, isChild: false, isVeggie: false, isVegan: false, colors: ["rot"] },
  { name: "Bibi Stewart", table: "brauttisch", seat: 7, isChild: false, isVeggie: false, isVegan: false, colors: ["rot"] },
  { name: "Nicole Knoop", table: "brauttisch", seat: 8, isChild: false, isVeggie: false, isVegan: false, colors: ["rot"] },
  { name: "Natalie Schönberger", table: "brauttisch", seat: 9, isChild: false, isVeggie: false, isVegan: false, colors: ["rot"] },
  { name: "Oli Graß", table: "brauttisch", seat: 11, isChild: false, isVeggie: false, isVegan: false, colors: ["rot"] },
  { name: "Katrin Paulus", table: "brauttisch", seat: 12, isChild: false, isVeggie: false, isVegan: false, colors: ["rot"] },
  { name: "Felix Haenlein", table: "brauttisch", seat: 13, isChild: false, isVeggie: false, isVegan: false, colors: ["rot"] },
  { name: "Christina Hofmann", table: "brauttisch", seat: 14, isChild: false, isVeggie: true, isVegan: false, colors: ["rot"] },
  { name: "Martin Weydenhammer", table: "brauttisch", seat: 15, isChild: false, isVeggie: false, isVegan: false, colors: ["rot"] },

  // Tisch 7 — full (10/10).
  { name: "Alexandre Girault", table: "t7", seat: 0, isChild: false, isVeggie: false, isVegan: false, colors: ["rot"] },
  { name: "Emma Girault", table: "t7", seat: 1, isChild: true, isVeggie: false, isVegan: false, colors: ["rot"] },
  { name: "Elisa", table: "t7", seat: 2, isChild: true, isVeggie: false, isVegan: false, colors: ["rot"] },
  { name: "Charlotte Reuter", table: "t7", seat: 3, isChild: false, isVeggie: false, isVegan: false, colors: ["rot"] },
  { name: "Lisa Oefler", table: "t7", seat: 4, isChild: false, isVeggie: true, isVegan: false, colors: ["rot"] },
  { name: "Simon Gutfleisch", table: "t7", seat: 5, isChild: false, isVeggie: true, isVegan: false, colors: ["rot"] },
  { name: "Kindolino Piewak", table: "t7", seat: 6, isChild: true, isVeggie: false, isVegan: false, colors: ["rot"] },
  { name: "Luisa Piewak", table: "t7", seat: 7, isChild: false, isVeggie: true, isVegan: false, colors: ["rot"] },
  { name: "Thiemo Fröhlich", table: "t7", seat: 8, isChild: false, isVeggie: false, isVegan: false, colors: ["rot"] },
  { name: "Mats Herrmann", table: "t7", seat: 9, isChild: false, isVeggie: false, isVegan: false, colors: ["rot"] },

  // Tisch 6 — full (10/10).
  { name: "Ailsa Saffar", table: "t6", seat: 0, isChild: false, isVeggie: false, isVegan: false, colors: ["rot"] },
  { name: "Sebastian Reuther", table: "t6", seat: 1, isChild: false, isVeggie: false, isVegan: false, colors: ["rot"] },
  { name: "Shanice Arendt", table: "t6", seat: 2, isChild: false, isVeggie: true, isVegan: false, colors: ["rot"] },
  { name: "Marcel Penno", table: "t6", seat: 3, isChild: false, isVeggie: true, isVegan: false, colors: ["rot"] },
  { name: "Jonas Zipfel", table: "t6", seat: 4, isChild: false, isVeggie: false, isVegan: false, colors: ["rot"] },
  { name: "Johannes Beier", table: "t6", seat: 5, isChild: false, isVeggie: false, isVegan: false, colors: ["rot"] },
  { name: "Robert Schrepfer", table: "t6", seat: 6, isChild: false, isVeggie: false, isVegan: false, colors: ["rot"] },
  { name: "Colin Schrepfer", table: "t6", seat: 7, isChild: true, isVeggie: false, isVegan: false, colors: ["rot"] },
  { name: "Xue Lin", table: "t6", seat: 8, isChild: false, isVeggie: false, isVegan: false, colors: ["rot"] },
  { name: "Andrea Müller", table: "t6", seat: 9, isChild: false, isVeggie: false, isVegan: false, colors: ["rot"] },

  // Tisch 4 — Christine and Robert moved to Tisch 5, Walburga moved in from Tisch 8. Seat 7 open.
  { name: "Katharina Waters", table: "t4", seat: 0, isChild: false, isVeggie: false, isVegan: false, colors: ["rot"] },
  { name: "Nik Waters", table: "t4", seat: 1, isChild: false, isVeggie: false, isVegan: false, colors: ["rot"] },
  { name: "Anke Schellermann", table: "t4", seat: 2, isChild: false, isVeggie: false, isVegan: false, colors: ["rot"] },
  { name: "Maxi Schellermann", table: "t4", seat: 3, isChild: false, isVeggie: false, isVegan: false, colors: ["rot"] },
  { name: "Isabella Zuchold", table: "t4", seat: 4, isChild: false, isVeggie: true, isVegan: false, colors: ["rot"] },
  { name: "Fabian Schellermann", table: "t4", seat: 5, isChild: false, isVeggie: false, isVegan: false, colors: ["rot"] },
  { name: "Walburga Graß", table: "t4", seat: 6, isChild: false, isVeggie: false, isVegan: false, colors: ["rot"] },

  // Tisch 5 — seat 3, 7 open. Marco (seat 6) sits opposite Daniela (seat 2).
  { name: "Robert Chwalka", table: "t5", seat: 0, isChild: false, isVeggie: false, isVegan: false, colors: ["rot"] },
  { name: "Christine Kuhnt", table: "t5", seat: 1, isChild: false, isVeggie: false, isVegan: false, colors: ["rot"] },
  { name: "Daniela Hofman", table: "t5", seat: 2, isChild: false, isVeggie: false, isVegan: false, colors: ["rot"] },
  { name: "Lara Hofmann", table: "t5", seat: 4, isChild: false, isVeggie: true, isVegan: false, colors: ["rot"] },
  { name: "Gertraud Schirmer", table: "t5", seat: 5, isChild: false, isVeggie: false, isVegan: false, colors: ["rot"] },
  { name: "Marco Hofmann", table: "t5", seat: 6, isChild: false, isVeggie: false, isVegan: false, colors: ["rot"] },

  // Tisch 8 — seats 4, 8-9 open.
  { name: "Veronika Sticht", table: "t8", seat: 0, isChild: false, isVeggie: false, isVegan: false, colors: ["rot"] },
  { name: "Klaus Sticht", table: "t8", seat: 1, isChild: false, isVeggie: false, isVegan: false, colors: ["rot"] },
  { name: "Thomas Klein", table: "t8", seat: 2, isChild: false, isVeggie: false, isVegan: false, colors: ["rot"] },
  { name: "Dagmar Klein", table: "t8", seat: 3, isChild: false, isVeggie: false, isVegan: false, colors: ["rot"] },
  { name: "Lisa Klein", table: "t8", seat: 5, isChild: false, isVeggie: false, isVegan: false, colors: ["rot"] },
  { name: "Patrick Wiche", table: "t8", seat: 6, isChild: false, isVeggie: false, isVegan: false, colors: ["rot"] },
  { name: "Moritz Klein", table: "t8", seat: 7, isChild: false, isVeggie: false, isVegan: false, colors: ["rot"] },

  // Tisch 3 — full (10/10).
  { name: "David Eiber", table: "t3", seat: 0, isChild: false, isVeggie: true, isVegan: false, colors: ["rot"] },
  { name: "Lisa Kraus", table: "t3", seat: 1, isChild: false, isVeggie: true, isVegan: false, colors: ["rot"] },
  { name: "Tassilo Elsberger", table: "t3", seat: 2, isChild: false, isVeggie: true, isVegan: false, colors: ["rot"] },
  { name: "Anna Heißmann", table: "t3", seat: 3, isChild: false, isVeggie: true, isVegan: false, colors: ["rot"] },
  { name: "Gregor Hlinka", table: "t3", seat: 4, isChild: false, isVeggie: false, isVegan: false, colors: ["rot"] },
  { name: "Melanie Beege", table: "t3", seat: 5, isChild: false, isVeggie: true, isVegan: false, colors: ["rot"] },
  { name: "Milo", table: "t3", seat: 6, isChild: true, isVeggie: false, isVegan: false, colors: ["rot"] },
  { name: "Christian Beege", table: "t3", seat: 7, isChild: false, isVeggie: false, isVegan: true, colors: ["rot"] },
  { name: "Thomas Trautner", table: "t3", seat: 8, isChild: false, isVeggie: false, isVegan: false, colors: ["rot"] },
  { name: "Marina Hlinka", table: "t3", seat: 9, isChild: false, isVeggie: false, isVegan: false, colors: ["rot"] },
];

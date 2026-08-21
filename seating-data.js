// Auto-generated seating data. A guest's photo-session group is simply
// whichever table they're seated at — no separate per-guest color field —
// so Fotoliste groups guests by table ("Gruppe Tisch 1", "Gruppe Tisch 2", …)
// and uses each table's own color as that group's swatch.
//
// Coordinate space is shared by the floor-plan overview AND the per-table
// detail view (the detail view just crops its <svg viewBox> to one table's
// bounding box), so every shape/seat is defined once, here.

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
  { id: "t3", label: "Tisch 2", cap: 10, color: "#828c7b", rect: { x: 20, y: 80, w: 260, h: 70 } },
  { id: "t4", label: "Tisch 3", cap: 8, color: "#697363", rect: { x: 20, y: 170, w: 260, h: 70 } },
  { id: "t5", label: "Tisch 4", cap: 8, color: "#d1a582", rect: { x: 20, y: 260, w: 260, h: 70 } },
  { id: "t6", label: "Tisch 5", cap: 10, color: "#bf8b78", rect: { x: 20, y: 350, w: 260, h: 70 } },
  { id: "t7", label: "Tisch 6", cap: 10, color: "#d1a582", rect: { x: 730, y: 190, w: 230, h: 70 } },
  { id: "t8", label: "Tisch 7", cap: 10, color: "#697363", rect: { x: 730, y: 280, w: 230, h: 70 } },
  // Fototisch has no seats any more — a prop/backdrop spot, not a guest table.
  { id: "t9", label: "Fototisch", cap: 0, color: "#0d0300", rect: { x: 730, y: 370, w: 230, h: 70 } },
];

// Perceptual luminance check so the white-on-color overview labels stay
// readable no matter which custom color a table gets — a light table color
// (like Brauttisch's white) automatically flips its label to dark ink
// instead of needing a one-off override.
function isLightColor(hex) {
  const c = hex.replace("#", "");
  const r = parseInt(c.substring(0, 2), 16);
  const g = parseInt(c.substring(2, 4), 16);
  const b = parseInt(c.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6;
}

function tableLabelColors(hex) {
  return isLightColor(hex)
    ? { label: "#2b2b2b", sublabel: "rgba(13, 3, 0, 0.65)" }
    : { label: "#fffdfb", sublabel: "rgba(255, 255, 255, 0.85)" };
}

const TABLES = [
  {
    // Formerly "Brauttisch" — renamed to Tisch 1 to fold it into the same
    // 1-7 numbering as every other table. Internal id stays "brauttisch"
    // since every GUESTS entry still references it that way.
    id: "brauttisch",
    label: "Tisch 1",
    cap: 16,
    color: "#ffffff",
    labelColors: tableLabelColors("#ffffff"),
    shapeRects: [brauttischTop, brauttischLeftArm, brauttischRightArm],
    seats: brauttischSeats,
  },
  ...RECT_TABLE_DEFS.map((t) => ({
    id: t.id,
    label: t.label,
    cap: t.cap,
    color: t.color,
    labelColors: tableLabelColors(t.color),
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

const GUESTS = [
  // Tisch 1 (Brauttisch) — seated per couple's placement (2026-08-09). Seat 10 (inside, left arm) is open.
  { name: "Hans-Walter Schaller", table: "brauttisch", seat: 0, isChild: false, isVeggie: false, isVegan: false },
  { name: "Beate Schaller", table: "brauttisch", seat: 1, isChild: false, isVeggie: false, isVegan: false },
  { name: "Barbara Schaller-Graß", table: "brauttisch", seat: 2, isChild: false, isVeggie: false, isVegan: false },
  { name: "Christopher Schaller-Graß", table: "brauttisch", seat: 3, isChild: false, isVeggie: false, isVegan: false },
  { name: "Stefan Graß", table: "brauttisch", seat: 4, isChild: false, isVeggie: false, isVegan: false },
  { name: "Andrea Graß", table: "brauttisch", seat: 5, isChild: false, isVeggie: false, isVegan: false },
  { name: "Christoph Schaller", table: "brauttisch", seat: 6, isChild: false, isVeggie: false, isVegan: false },
  { name: "Bibi Stewart", table: "brauttisch", seat: 7, isChild: false, isVeggie: false, isVegan: false },
  { name: "Nicole Knoop", table: "brauttisch", seat: 8, isChild: false, isVeggie: false, isVegan: false },
  { name: "Natalie Schönberger", table: "brauttisch", seat: 9, isChild: false, isVeggie: false, isVegan: false },
  { name: "Oli Graß", table: "brauttisch", seat: 11, isChild: false, isVeggie: false, isVegan: false },
  { name: "Katrin Paulus", table: "brauttisch", seat: 12, isChild: false, isVeggie: false, isVegan: false },
  { name: "Felix Haenlein", table: "brauttisch", seat: 13, isChild: false, isVeggie: false, isVegan: false },
  { name: "Christina Hofmann", table: "brauttisch", seat: 14, isChild: false, isVeggie: true, isVegan: false },
  { name: "Martin Weydenhammer", table: "brauttisch", seat: 15, isChild: false, isVeggie: false, isVegan: false },

  // Tisch 6 — full (10/10).
  { name: "Alexandre Girault", table: "t7", seat: 0, isChild: false, isVeggie: false, isVegan: false },
  { name: "Emma Girault", table: "t7", seat: 1, isChild: true, isVeggie: false, isVegan: false },
  { name: "Elisa", table: "t7", seat: 2, isChild: true, isVeggie: false, isVegan: false },
  { name: "Charlotte Reuter", table: "t7", seat: 3, isChild: false, isVeggie: false, isVegan: false },
  { name: "Lisa Oefler", table: "t7", seat: 4, isChild: false, isVeggie: true, isVegan: false },
  { name: "Simon Gutfleisch", table: "t7", seat: 5, isChild: false, isVeggie: true, isVegan: false },
  { name: "Kindolino Piewak", table: "t7", seat: 6, isChild: true, isVeggie: false, isVegan: false },
  { name: "Luisa Piewak", table: "t7", seat: 7, isChild: false, isVeggie: true, isVegan: false },
  { name: "Thiemo Fröhlich", table: "t7", seat: 8, isChild: false, isVeggie: false, isVegan: false },
  { name: "Mats Herrmann", table: "t7", seat: 9, isChild: false, isVeggie: false, isVegan: false },

  // Tisch 5 — full (10/10).
  { name: "Ailsa Saffar", table: "t6", seat: 0, isChild: false, isVeggie: false, isVegan: false },
  { name: "Sebastian Reuther", table: "t6", seat: 1, isChild: false, isVeggie: false, isVegan: false },
  { name: "Shanice Arendt", table: "t6", seat: 2, isChild: false, isVeggie: true, isVegan: false },
  { name: "Marcel Penno", table: "t6", seat: 3, isChild: false, isVeggie: true, isVegan: false },
  { name: "Jonas Zipfel", table: "t6", seat: 4, isChild: false, isVeggie: false, isVegan: false },
  { name: "Johannes Beier", table: "t6", seat: 5, isChild: false, isVeggie: false, isVegan: false },
  { name: "Robert Schrepfer", table: "t6", seat: 6, isChild: false, isVeggie: false, isVegan: false },
  { name: "Colin Schrepfer", table: "t6", seat: 7, isChild: true, isVeggie: false, isVegan: false },
  { name: "Xue Lin", table: "t6", seat: 8, isChild: false, isVeggie: false, isVegan: false },
  { name: "Andrea Müller", table: "t6", seat: 9, isChild: false, isVeggie: false, isVegan: false },

  // Tisch 3 — Christine and Robert moved to Tisch 4, Walburga moved in from Tisch 7. Seat 7 open.
  { name: "Katharina Waters", table: "t4", seat: 0, isChild: false, isVeggie: false, isVegan: false },
  { name: "Nick Waters", table: "t4", seat: 1, isChild: false, isVeggie: false, isVegan: false },
  { name: "Anke Schellermann", table: "t4", seat: 2, isChild: false, isVeggie: false, isVegan: false },
  { name: "Maxi Schellermann", table: "t4", seat: 3, isChild: false, isVeggie: false, isVegan: false },
  { name: "Isabella Zuchold", table: "t4", seat: 4, isChild: false, isVeggie: true, isVegan: false },
  { name: "Fabian Schellermann", table: "t4", seat: 5, isChild: false, isVeggie: false, isVegan: false },
  { name: "Walburga Graß", table: "t4", seat: 6, isChild: false, isVeggie: false, isVegan: false },

  // Tisch 4 — seat 3, 7 open. Marco (seat 6) sits opposite Daniela (seat 2).
  { name: "Robert Chwalka", table: "t5", seat: 0, isChild: false, isVeggie: false, isVegan: false },
  { name: "Christine Kuhnt", table: "t5", seat: 1, isChild: false, isVeggie: false, isVegan: false },
  { name: "Daniela Hofman", table: "t5", seat: 2, isChild: false, isVeggie: false, isVegan: false },
  { name: "Lara Hofmann", table: "t5", seat: 4, isChild: false, isVeggie: true, isVegan: false },
  { name: "Gertraud Schirmer", table: "t5", seat: 5, isChild: false, isVeggie: false, isVegan: false },
  { name: "Marco Hofmann", table: "t5", seat: 6, isChild: false, isVeggie: false, isVegan: false },

  // Tisch 7 — seats 4, 8-9 open.
  { name: "Veronika Sticht", table: "t8", seat: 0, isChild: false, isVeggie: false, isVegan: false },
  { name: "Klaus Sticht", table: "t8", seat: 1, isChild: false, isVeggie: false, isVegan: false },
  { name: "Thomas Klein", table: "t8", seat: 2, isChild: false, isVeggie: false, isVegan: false },
  { name: "Dagmar Klein", table: "t8", seat: 3, isChild: false, isVeggie: false, isVegan: false },
  { name: "Lisa Klein", table: "t8", seat: 5, isChild: false, isVeggie: false, isVegan: false },
  { name: "Patrick Wiche", table: "t8", seat: 6, isChild: false, isVeggie: false, isVegan: false },
  { name: "Moritz Klein", table: "t8", seat: 7, isChild: false, isVeggie: false, isVegan: false },

  // Tisch 2 — full (10/10).
  { name: "David Eiber", table: "t3", seat: 0, isChild: false, isVeggie: true, isVegan: false },
  { name: "Lisa Kraus", table: "t3", seat: 1, isChild: false, isVeggie: true, isVegan: false },
  { name: "Tassilo Elsberger", table: "t3", seat: 2, isChild: false, isVeggie: true, isVegan: false },
  { name: "Anna Heißmann", table: "t3", seat: 3, isChild: false, isVeggie: true, isVegan: false },
  { name: "Gregor Hlinka", table: "t3", seat: 4, isChild: false, isVeggie: false, isVegan: false },
  { name: "Melanie Beege", table: "t3", seat: 5, isChild: false, isVeggie: true, isVegan: false },
  { name: "Milo", table: "t3", seat: 6, isChild: true, isVeggie: false, isVegan: false },
  { name: "Christian Beege", table: "t3", seat: 7, isChild: false, isVeggie: false, isVegan: true },
  { name: "Thomas Trautner", table: "t3", seat: 8, isChild: false, isVeggie: false, isVegan: false },
  { name: "Marina Hlinka", table: "t3", seat: 9, isChild: false, isVeggie: false, isVegan: false },
];

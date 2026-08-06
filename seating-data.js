// Auto-generated seating data. Seat assignments are RANDOM for now and will be
// cleaned up by hand later. Table colors double as the "find your table" color
// for the photo session.
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

const GUESTS = [
  { name: "Dagmar Klein", table: "brauttisch", seat: 0, isChild: false, isVeggie: false, isVegan: false },
  { name: "Lisa Oefler", table: "brauttisch", seat: 1, isChild: false, isVeggie: true, isVegan: false },
  { name: "Thomas Klein", table: "brauttisch", seat: 2, isChild: false, isVeggie: false, isVegan: false },
  { name: "Hans-Walter Schaller", table: "brauttisch", seat: 3, isChild: false, isVeggie: false, isVegan: false },
  { name: "Thomas Trautner", table: "brauttisch", seat: 4, isChild: false, isVeggie: false, isVegan: false },
  { name: "Lisa ???????", table: "brauttisch", seat: 5, isChild: false, isVeggie: true, isVegan: false },
  { name: "Nik Waters", table: "brauttisch", seat: 6, isChild: false, isVeggie: false, isVegan: false },
  { name: "Oli Graß", table: "brauttisch", seat: 7, isChild: false, isVeggie: false, isVegan: false },
  { name: "Beate Schaller", table: "brauttisch", seat: 8, isChild: false, isVeggie: false, isVegan: false },
  { name: "Andrea Graß", table: "brauttisch", seat: 9, isChild: false, isVeggie: false, isVegan: false },
  { name: "Walburga Graß", table: "brauttisch", seat: 10, isChild: false, isVeggie: false, isVegan: false },
  { name: "Christopher Schaller-Graß", table: "brauttisch", seat: 11, isChild: false, isVeggie: false, isVegan: false },
  { name: "Veronika Sticht", table: "brauttisch", seat: 12, isChild: false, isVeggie: false, isVegan: false },
  { name: "Luisa Piewak", table: "brauttisch", seat: 13, isChild: false, isVeggie: true, isVegan: false },
  { name: "Patrick Wiche", table: "brauttisch", seat: 14, isChild: false, isVeggie: false, isVegan: false },
  { name: "Moritz Klein", table: "brauttisch", seat: 15, isChild: false, isVeggie: false, isVegan: false },
  { name: "Gertraud Schirmer", table: "t3", seat: 0, isChild: false, isVeggie: false, isVegan: false },
  { name: "Christine Kuhnt", table: "t3", seat: 1, isChild: false, isVeggie: false, isVegan: false },
  { name: "Ailsa Saffar", table: "t3", seat: 2, isChild: false, isVeggie: false, isVegan: false },
  { name: "Melanie Beege", table: "t3", seat: 3, isChild: false, isVeggie: true, isVegan: false },
  { name: "Lara Hofmann", table: "t3", seat: 4, isChild: false, isVeggie: true, isVegan: false },
  { name: "Maxi Schellermann", table: "t3", seat: 5, isChild: false, isVeggie: false, isVegan: false },
  { name: "Christoph Schaller", table: "t3", seat: 6, isChild: false, isVeggie: false, isVegan: false },
  { name: "Natalie", table: "t3", seat: 7, isChild: false, isVeggie: false, isVegan: false },
  { name: "Kindolino Piewak", table: "t3", seat: 8, isChild: true, isVeggie: false, isVegan: false },
  { name: "Barbara Schaller-Graß", table: "t3", seat: 9, isChild: false, isVeggie: false, isVegan: false },
  { name: "Thiemo", table: "t4", seat: 0, isChild: false, isVeggie: false, isVegan: false },
  { name: "Christian Beege", table: "t4", seat: 1, isChild: false, isVeggie: false, isVegan: true },
  { name: "Johannes Beier", table: "t4", seat: 2, isChild: false, isVeggie: false, isVegan: false },
  { name: "Alexandre Girault", table: "t4", seat: 3, isChild: false, isVeggie: false, isVegan: false },
  { name: "Shanice Arendt", table: "t4", seat: 4, isChild: false, isVeggie: true, isVegan: false },
  { name: "Robert Schrepfer", table: "t4", seat: 5, isChild: false, isVeggie: false, isVegan: false },
  { name: "Sebiastian Reuther", table: "t4", seat: 6, isChild: false, isVeggie: false, isVegan: false },
  { name: "Nicole", table: "t4", seat: 7, isChild: false, isVeggie: false, isVegan: false },
  { name: "Simon Gutfleisch", table: "t5", seat: 0, isChild: false, isVeggie: true, isVegan: false },
  { name: "Robert Chwalka", table: "t5", seat: 1, isChild: false, isVeggie: false, isVegan: false },
  { name: "Bibi Stewart", table: "t5", seat: 2, isChild: false, isVeggie: false, isVegan: false },
  { name: "Charlotte Reuter", table: "t5", seat: 3, isChild: false, isVeggie: false, isVegan: false },
  { name: "Xue Lin", table: "t5", seat: 4, isChild: false, isVeggie: false, isVegan: false },
  { name: "Tassilo Elsberger", table: "t5", seat: 5, isChild: false, isVeggie: true, isVegan: false },
  { name: "Martin Weydenhammer", table: "t5", seat: 6, isChild: false, isVeggie: false, isVegan: false },
  { name: "Stefan Graß", table: "t5", seat: 7, isChild: false, isVeggie: false, isVegan: false },
  { name: "Christina Hofmann", table: "t6", seat: 0, isChild: false, isVeggie: true, isVegan: false },
  { name: "Jonas Zipfel", table: "t6", seat: 1, isChild: false, isVeggie: false, isVegan: false },
  { name: "Maike", table: "t6", seat: 2, isChild: false, isVeggie: false, isVegan: false },
  { name: "Marina Hlinka", table: "t6", seat: 3, isChild: false, isVeggie: false, isVegan: false },
  { name: "Marcel Penno", table: "t6", seat: 4, isChild: false, isVeggie: true, isVegan: false },
  { name: "Gregor Hlinka", table: "t6", seat: 5, isChild: false, isVeggie: false, isVegan: false },
  { name: "Anke Schellermann", table: "t6", seat: 6, isChild: false, isVeggie: false, isVegan: false },
  { name: "Fabian Schellermann", table: "t6", seat: 7, isChild: false, isVeggie: false, isVegan: false },
  { name: "Katharina Waters", table: "t6", seat: 8, isChild: false, isVeggie: false, isVegan: false },
  { name: "Milo", table: "t6", seat: 9, isChild: true, isVeggie: false, isVegan: false },
  { name: "Andi", table: "t7", seat: 0, isChild: false, isVeggie: false, isVegan: false },
  { name: "Felix Haenlein", table: "t7", seat: 1, isChild: false, isVeggie: false, isVegan: false },
  { name: "Lisa Klein", table: "t7", seat: 2, isChild: false, isVeggie: false, isVegan: false },
  { name: "Emma Girault", table: "t7", seat: 3, isChild: true, isVeggie: false, isVegan: false },
  { name: "David Eiber", table: "t7", seat: 4, isChild: false, isVeggie: true, isVegan: false },
  { name: "Elisa", table: "t7", seat: 5, isChild: true, isVeggie: false, isVegan: false },
  { name: "Anna Heißmann", table: "t7", seat: 6, isChild: false, isVeggie: true, isVegan: false },
  { name: "Marco Hofmann", table: "t7", seat: 7, isChild: false, isVeggie: false, isVegan: false },
  { name: "Maikes Mann", table: "t7", seat: 8, isChild: false, isVeggie: false, isVegan: false },
  { name: "Colin Schrepfer", table: "t7", seat: 9, isChild: true, isVeggie: false, isVegan: false },
  { name: "Isabella", table: "t8", seat: 0, isChild: false, isVeggie: true, isVegan: false },
  { name: "Daniela Hofman", table: "t8", seat: 1, isChild: false, isVeggie: false, isVegan: false },
  { name: "Klaus Sticht", table: "t8", seat: 2, isChild: false, isVeggie: false, isVegan: false },
  { name: "Mats Herrmann", table: "t8", seat: 3, isChild: false, isVeggie: false, isVegan: false },
  { name: "Katrin Paulus", table: "t8", seat: 4, isChild: false, isVeggie: false, isVegan: false },
];

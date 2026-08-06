(function () {
  const NS = "http://www.w3.org/2000/svg";
  function el(tag, attrs) {
    const node = document.createElementNS(NS, tag);
    Object.entries(attrs || {}).forEach(([k, v]) => node.setAttribute(k, v));
    return node;
  }

  const KNOWN_COLORS = {
    rot: "#c0392b",
    blau: "#3d6fa8",
    gruen: "#4f7942",
    grün: "#4f7942",
    gelb: "#d4ac17",
    orange: "#e07b39",
    lila: "#7d5ba6",
    violett: "#7d5ba6",
    rosa: "#d98ba0",
    pink: "#d98ba0",
    tuerkis: "#3aa6a0",
    türkis: "#3aa6a0",
    schwarz: "#2b2b2b",
    weiss: "#e9e3da",
    weiß: "#e9e3da",
    grau: "#8a8a86",
    braun: "#6b4a35",
    beige: "#c9b896",
    gold: "#c9a24b",
    silber: "#b9b9b3",
  };

  // Fallback so an unrecognized color word (future data) still gets a
  // distinct, stable color instead of breaking.
  function fallbackHex(name) {
    let hash = 0;
    for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
    return `hsl(${hash % 360}, 55%, 45%)`;
  }

  function colorHex(name) {
    return KNOWN_COLORS[name.toLowerCase()] || fallbackHex(name.toLowerCase());
  }

  function colorLabel(name) {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }

  const tableById = Object.fromEntries(TABLES.map((t) => [t.id, t]));
  const guestsByTable = Object.fromEntries(TABLES.map((t) => [t.id, []]));
  GUESTS.forEach((g) => guestsByTable[g.table].push(g));

  const guestsWithColor = GUESTS.filter((g) => g.colors && g.colors.length > 0);

  // ---------- Color group cards ----------

  function renderColorGroups() {
    const container = document.getElementById("color-groups");
    const groups = {};
    guestsWithColor.forEach((g) => {
      g.colors.forEach((c) => {
        (groups[c] = groups[c] || []).push(g);
      });
    });
    const colorNames = Object.keys(groups).sort((a, b) => a.localeCompare(b, "de"));

    if (colorNames.length === 0) {
      container.innerHTML = '<p class="staff-list-empty">Noch keine Farben zugeordnet.</p>';
      return;
    }

    colorNames.forEach((color) => {
      const guests = groups[color].slice().sort((a, b) => a.name.localeCompare(b.name, "de"));
      const card = document.createElement("div");
      card.className = "staff-card";
      card.innerHTML = `
        <div class="staff-card-header">
          <span class="result-swatch" style="background:${colorHex(color)}"></span>
          <h3>${colorLabel(color)}</h3>
          <span class="staff-card-counts"><span class="staff-card-count">${guests.length}</span></span>
        </div>
        <ul class="staff-list">
          ${guests
            .map((g) => {
              const otherColors = g.colors.filter((c) => c !== color);
              const dots = otherColors
                .map((c) => `<span class="color-dot" style="background:${colorHex(c)}" title="${colorLabel(c)}"></span>`)
                .join("");
              return `<li><span>${g.name}</span>${dots}<span class="staff-seat">${tableById[g.table].label}</span></li>`;
            })
            .join("")}
        </ul>
      `;
      container.appendChild(card);
    });
  }

  // ---------- Pie-sliced seat marker (handles 1..N colors per person) ----------

  function polarPoint(cx, cy, r, angleDeg) {
    const rad = ((angleDeg - 90) * Math.PI) / 180;
    return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
  }

  function pieSlicePath(cx, cy, r, startAngle, endAngle) {
    const start = polarPoint(cx, cy, r, endAngle);
    const end = polarPoint(cx, cy, r, startAngle);
    const largeArc = endAngle - startAngle <= 180 ? 0 : 1;
    return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y} Z`;
  }

  function renderColorSeat(svg, cx, cy, r, colors) {
    if (!colors || colors.length === 0) {
      svg.appendChild(el("circle", { class: "photo-seat-empty", cx, cy, r: 6 }));
      return;
    }
    if (colors.length === 1) {
      svg.appendChild(
        el("circle", { class: "photo-seat-circle", cx, cy, r, fill: colorHex(colors[0]) })
      );
      return;
    }
    const slice = 360 / colors.length;
    colors.forEach((name, i) => {
      svg.appendChild(
        el("path", {
          class: "photo-seat-slice",
          d: pieSlicePath(cx, cy, r, i * slice, (i + 1) * slice),
          fill: colorHex(name),
        })
      );
    });
    svg.appendChild(el("circle", { class: "photo-seat-outline", cx, cy, r }));
  }

  // ---------- Big overview: color dot + count badge per table ----------

  function renderOverview() {
    const svg = document.getElementById("photo-floorplan-svg");

    LANDMARKS.forEach((lm) => {
      svg.appendChild(
        el("rect", { class: "landmark-shape", x: lm.rect.x, y: lm.rect.y, width: lm.rect.w, height: lm.rect.h, rx: 8 })
      );
      const label = el("text", { class: "landmark-label", x: lm.rect.x + lm.rect.w / 2, y: lm.rect.y + lm.rect.h / 2 });
      label.textContent = lm.label;
      svg.appendChild(label);
    });

    TABLES.forEach((t) => {
      t.shapeRects.forEach((r) => {
        svg.appendChild(
          el("rect", { class: "table-shape", x: r.x, y: r.y, width: r.w, height: r.h, rx: 10, fill: t.color })
        );
      });
      const main = t.shapeRects[0];

      const countsByColor = {};
      guestsByTable[t.id].forEach((g) => {
        (g.colors || []).forEach((c) => {
          countsByColor[c] = (countsByColor[c] || 0) + 1;
        });
      });
      const colorNames = Object.keys(countsByColor).sort((a, b) => a.localeCompare(b, "de"));
      const hasBadge = colorNames.length > 0;

      const label = el("text", {
        class: "table-label",
        x: main.x + main.w / 2,
        y: main.y + main.h / 2 + (hasBadge ? -11 : 0),
      });
      label.textContent = t.label;
      svg.appendChild(label);

      if (hasBadge) renderOverviewBadge(svg, main, colorNames, countsByColor);
    });
  }

  function renderOverviewBadge(svg, rect, colorNames, countsByColor) {
    const dotSize = 13;
    const chipGap = 4;
    const groupGap = 10;
    const chipWidths = colorNames.map((c) => dotSize + chipGap + String(countsByColor[c]).length * 8 + 6);
    const totalWidth = chipWidths.reduce((a, b) => a + b, 0) + groupGap * (colorNames.length - 1);

    let cursorX = rect.x + rect.w / 2 - totalWidth / 2;
    const cy = rect.y + rect.h / 2 + 13;

    colorNames.forEach((color, i) => {
      svg.appendChild(
        el("circle", { cx: cursorX + dotSize / 2, cy, r: dotSize / 2, fill: colorHex(color), stroke: "var(--surface)", "stroke-width": 1.5 })
      );
      const countText = el("text", { class: "overview-badge-count", x: cursorX + dotSize + chipGap, y: cy });
      countText.textContent = `×${countsByColor[color]}`;
      svg.appendChild(countText);
      cursorX += chipWidths[i] + groupGap;
    });
  }

  // ---------- Per-table seat diagram ----------

  function renderTableDiagram(svg, table) {
    let minX = Infinity,
      minY = Infinity,
      maxX = -Infinity,
      maxY = -Infinity;
    table.shapeRects.forEach((r) => {
      minX = Math.min(minX, r.x);
      minY = Math.min(minY, r.y);
      maxX = Math.max(maxX, r.x + r.w);
      maxY = Math.max(maxY, r.y + r.h);
    });
    table.seats.forEach((s) => {
      const padX = s.dir === "e" || s.dir === "w" ? 68 : 22;
      const padTop = s.dir === "n" ? 30 : 20;
      const padBottom = s.dir === "s" ? 34 : 20;
      minX = Math.min(minX, s.x - padX);
      maxX = Math.max(maxX, s.x + padX);
      minY = Math.min(minY, s.y - padTop);
      maxY = Math.max(maxY, s.y + padBottom);
    });
    const pad = 6;
    svg.setAttribute("viewBox", `${minX - pad} ${minY - pad} ${maxX - minX + 2 * pad} ${maxY - minY + 2 * pad}`);

    table.shapeRects.forEach((r) => {
      svg.appendChild(
        el("rect", { class: "staff-table-shape", x: r.x, y: r.y, width: r.w, height: r.h, rx: 8, fill: table.color })
      );
    });

    table.seats.forEach((seat, i) => {
      const occupant = guestsByTable[table.id].find((g) => g.seat === i);
      renderColorSeat(svg, seat.x, seat.y, 11, occupant ? occupant.colors : null);
      if (!occupant || !occupant.colors || occupant.colors.length === 0) return;

      let lx = seat.x,
        ly = seat.y,
        anchor = "middle",
        baseline = "middle";
      if (seat.dir === "n") {
        ly -= 17;
        baseline = "auto";
      } else if (seat.dir === "s") {
        ly += 21;
        baseline = "hanging";
      } else if (seat.dir === "e") {
        lx += 17;
        anchor = "start";
      } else if (seat.dir === "w") {
        lx -= 17;
        anchor = "end";
      }
      const label = el("text", {
        class: "staff-seat-label",
        x: lx,
        y: ly,
        "text-anchor": anchor,
        "dominant-baseline": baseline,
      });
      label.textContent = occupant.name.trim().split(/\s+/)[0];
      svg.appendChild(label);
    });
  }

  function renderTableCard(table) {
    const withColor = guestsByTable[table.id].filter((g) => g.colors && g.colors.length > 0);
    const card = document.createElement("div");
    card.className = "staff-card";

    const header = document.createElement("div");
    header.className = "staff-card-header";
    header.innerHTML = `
      <span class="result-swatch" style="background:${table.color}"></span>
      <h3>${table.label}</h3>
    `;
    card.appendChild(header);

    const svg = el("svg", { class: "staff-diagram", role: "img", "aria-label": `Farben am ${table.label}` });
    card.appendChild(svg);
    renderTableDiagram(svg, table);

    const list = document.createElement("ul");
    list.className = "staff-list";
    if (withColor.length === 0) {
      list.innerHTML = '<li class="staff-list-empty">Noch keine Farbe zugeordnet</li>';
    } else {
      withColor
        .slice()
        .sort((a, b) => a.seat - b.seat)
        .forEach((g) => {
          const dots = g.colors
            .map((c) => `<span class="color-dot" style="background:${colorHex(c)}" title="${colorLabel(c)}"></span>`)
            .join("");
          const li = document.createElement("li");
          li.innerHTML = `<span class="guest-highlighted">${g.name}</span>${dots}<span class="staff-seat">Platz ${g.seat + 1}</span>`;
          list.appendChild(li);
        });
    }
    card.appendChild(list);
    return card;
  }

  renderColorGroups();
  renderOverview();
  const photoTablesEl = document.getElementById("photo-tables");
  TABLES.forEach((t) => photoTablesEl.appendChild(renderTableCard(t)));
})();

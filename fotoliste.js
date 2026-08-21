(function () {
  const NS = "http://www.w3.org/2000/svg";
  function el(tag, attrs) {
    const node = document.createElementNS(NS, tag);
    Object.entries(attrs || {}).forEach(([k, v]) => node.setAttribute(k, v));
    return node;
  }

  const guestsByTable = Object.fromEntries(TABLES.map((t) => [t.id, []]));
  GUESTS.forEach((g) => {
    if (g.table) guestsByTable[g.table].push(g);
  });

  // ---------- Table group cards ----------
  // A guest's photo-session group is simply their table, so this list is
  // just the tables that actually have guests, each carrying its own color.

  function renderTableGroups() {
    const container = document.getElementById("color-groups");
    const groupTables = TABLES.filter((t) => guestsByTable[t.id].length > 0);

    if (groupTables.length === 0) {
      container.innerHTML = '<p class="staff-list-empty">Noch keine Gäste zugeordnet.</p>';
      return;
    }

    groupTables.forEach((t) => {
      const guests = guestsByTable[t.id].slice().sort((a, b) => a.name.localeCompare(b.name, "de"));
      const card = document.createElement("div");
      card.className = "staff-card";
      card.innerHTML = `
        <div class="staff-card-header">
          <span class="result-swatch" style="background:${t.color}"></span>
          <h3>Gruppe ${t.label}</h3>
          <span class="staff-card-counts"><span class="staff-card-count">${guests.length}</span></span>
        </div>
        <ul class="staff-list">
          ${guests.map((g) => `<li><span>${g.name}</span></li>`).join("")}
        </ul>
      `;
      container.appendChild(card);
    });
  }

  // ---------- Big overview: table label + guest count ----------

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
      const count = guestsByTable[t.id].length;

      svg.appendChild(
        el("text", {
          class: "table-label",
          x: main.x + main.w / 2,
          y: main.y + main.h / 2 + (count > 0 ? -9 : 0),
          style: `fill: ${t.labelColors.label}`,
        })
      ).textContent = t.label;

      if (count > 0) {
        svg.appendChild(
          el("text", {
            class: "table-sublabel",
            x: main.x + main.w / 2,
            y: main.y + main.h / 2 + 12,
            style: `fill: ${t.labelColors.sublabel}`,
          })
        ).textContent = `${count} Gäste`;
      }
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
      if (occupant) {
        svg.appendChild(el("circle", { class: "photo-seat-circle", cx: seat.x, cy: seat.y, r: 11, fill: table.color }));
      } else {
        svg.appendChild(el("circle", { class: "photo-seat-empty", cx: seat.x, cy: seat.y, r: 6 }));
      }
      if (!occupant) return;

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
    const guests = guestsByTable[table.id];
    const card = document.createElement("div");
    card.className = "staff-card";

    const header = document.createElement("div");
    header.className = "staff-card-header";
    header.innerHTML = `
      <span class="result-swatch" style="background:${table.color}"></span>
      <h3>${table.label}</h3>
    `;
    card.appendChild(header);

    const svg = el("svg", { class: "staff-diagram", role: "img", "aria-label": `Sitzplan ${table.label}` });
    card.appendChild(svg);
    renderTableDiagram(svg, table);

    const list = document.createElement("ul");
    list.className = "staff-list";
    if (guests.length === 0) {
      list.innerHTML = '<li class="staff-list-empty">Noch keine Gäste zugeordnet</li>';
    } else {
      guests
        .slice()
        .sort((a, b) => a.seat - b.seat)
        .forEach((g) => {
          const li = document.createElement("li");
          li.innerHTML = `<span class="guest-highlighted">${g.name}</span><span class="staff-seat">Platz ${g.seat + 1}</span>`;
          list.appendChild(li);
        });
    }
    card.appendChild(list);
    return card;
  }

  renderTableGroups();
  renderOverview();
  const photoTablesEl = document.getElementById("photo-tables");
  TABLES.forEach((t) => photoTablesEl.appendChild(renderTableCard(t)));
})();

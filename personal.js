(function () {
  const summaryEl = document.getElementById("staff-summary");
  const tablesEl = document.getElementById("staff-tables");

  const NS = "http://www.w3.org/2000/svg";
  function el(tag, attrs) {
    const node = document.createElementNS(NS, tag);
    Object.entries(attrs || {}).forEach(([k, v]) => node.setAttribute(k, v));
    return node;
  }

  const guestsByTable = Object.fromEntries(TABLES.map((t) => [t.id, []]));
  GUESTS.forEach((g) => guestsByTable[g.table].push(g));

  function dietClass(g) {
    if (g.isVegan) return "vegan";
    if (g.isVeggie) return "veggie";
    return null;
  }

  function dietLabel(cls) {
    return cls === "vegan" ? "Vegan" : "Vegetarisch";
  }

  function dietIcon(cls) {
    return cls === "vegan" ? "🌱" : "🧀";
  }

  function renderOverview() {
    const svg = document.getElementById("staff-floorplan-svg");

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
      const label = el("text", { class: "table-label", x: main.x + main.w / 2, y: main.y + main.h / 2 });
      label.textContent = t.label;
      svg.appendChild(label);

      t.seats.forEach((seat, i) => {
        const occupant = guestsByTable[t.id].find((g) => g.seat === i);
        const cls = occupant ? dietClass(occupant) : null;
        if (!cls) return;
        svg.appendChild(el("circle", { class: "overview-diet-backdrop", cx: seat.x, cy: seat.y, r: 15 }));
        const marker = el("text", { class: "overview-diet-marker", x: seat.x, y: seat.y });
        marker.textContent = cls === "vegan" ? "🌱" : "🧀";
        svg.appendChild(marker);
      });
    });
  }

  function renderSummary() {
    const totalVegan = GUESTS.filter((g) => g.isVegan).length;
    const totalVeggie = GUESTS.filter((g) => g.isVeggie).length;
    summaryEl.innerHTML = `
      <div class="staff-stat"><strong>${GUESTS.length}</strong><span>Gäste gesamt</span></div>
      <div class="staff-stat staff-stat-vegan"><strong>${totalVegan}</strong><span>Vegan</span></div>
      <div class="staff-stat staff-stat-veggie"><strong>${totalVeggie}</strong><span>Vegetarisch</span></div>
    `;
  }

  function renderDiagram(svg, table, specialGuests) {
    const specialBySeat = Object.fromEntries(specialGuests.map((g) => [g.seat, g]));
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
      const occupant = specialBySeat[i];
      const cls = occupant ? dietClass(occupant) : null;
      svg.appendChild(
        el("circle", {
          class: "staff-seat-circle" + (cls ? ` staff-seat-${cls}` : ""),
          cx: seat.x,
          cy: seat.y,
          r: cls ? 12 : 6,
        })
      );
      if (cls) {
        const icon = el("text", { class: "staff-seat-icon", x: seat.x, y: seat.y });
        icon.textContent = dietIcon(cls);
        svg.appendChild(icon);
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
    const special = guests.filter((g) => dietClass(g));
    const veganCount = special.filter((g) => g.isVegan).length;
    const veggieCount = special.filter((g) => g.isVeggie).length;

    const card = document.createElement("div");
    card.className = "staff-card";

    const header = document.createElement("div");
    header.className = "staff-card-header";
    header.innerHTML = `
      <span class="result-swatch" style="background:${table.color}"></span>
      <h3>${table.label}</h3>
      <span class="staff-card-counts">
        <span class="staff-card-count staff-card-count-vegan">🌱 ${veganCount}</span>
        <span class="staff-card-count staff-card-count-veggie">🧀 ${veggieCount}</span>
      </span>
    `;
    card.appendChild(header);

    const svg = el("svg", { class: "staff-diagram", role: "img", "aria-label": `Sitzplan ${table.label}` });
    card.appendChild(svg);
    renderDiagram(svg, table, special);

    const list = document.createElement("ul");
    list.className = "staff-list";
    if (special.length === 0) {
      list.innerHTML = '<li class="staff-list-empty">Keine besonderen Ernährungswünsche</li>';
    } else {
      special
        .slice()
        .sort((a, b) => a.seat - b.seat)
        .forEach((g) => {
          const cls = dietClass(g);
          const li = document.createElement("li");
          li.innerHTML = `<span class="guest-highlighted">${g.name}</span><span class="diet-badge diet-badge-${cls}">${dietIcon(
            cls
          )} ${dietLabel(cls)}</span><span class="staff-seat">Platz ${g.seat + 1}</span>`;
          list.appendChild(li);
        });
    }
    card.appendChild(list);
    return card;
  }

  renderSummary();
  renderOverview();
  TABLES.forEach((t) => tablesEl.appendChild(renderTableCard(t)));
})();

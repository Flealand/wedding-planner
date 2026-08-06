(function () {
  const svg = document.getElementById("floorplan-svg");
  const seatSvg = document.getElementById("seat-diagram-svg");
  const searchInput = document.getElementById("guest-search");
  const resultsEl = document.getElementById("search-results");
  const detailEl = document.getElementById("table-detail");
  const detailSwatch = document.getElementById("detail-swatch");
  const detailTitle = document.getElementById("detail-title");
  const detailCap = document.getElementById("detail-cap");
  const detailGuests = document.getElementById("detail-guests");
  const directoryToggle = document.getElementById("directory-toggle");
  const directoryEl = document.getElementById("directory");

  const NS = "http://www.w3.org/2000/svg";
  const tableById = Object.fromEntries(TABLES.map((t) => [t.id, t]));
  const guestsByTable = Object.fromEntries(TABLES.map((t) => [t.id, []]));
  GUESTS.forEach((g) => guestsByTable[g.table].push(g));

  function el(tag, attrs) {
    const node = document.createElementNS(NS, tag);
    Object.entries(attrs || {}).forEach(([k, v]) => node.setAttribute(k, v));
    return node;
  }

  function normalize(str) {
    return str
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/ß/g, "ss");
  }

  function firstName(name) {
    return name.trim().split(/\s+/)[0];
  }

  // ---------- Floor plan overview ----------

  function buildFloorplan() {
    LANDMARKS.forEach((lm) => {
      svg.appendChild(
        el("rect", { class: "landmark-shape", x: lm.rect.x, y: lm.rect.y, width: lm.rect.w, height: lm.rect.h, rx: 8 })
      );
      svg.appendChild(
        el("text", { class: "landmark-label", x: lm.rect.x + lm.rect.w / 2, y: lm.rect.y + lm.rect.h / 2 })
      ).textContent = lm.label;
    });

    TABLES.forEach((t) => {
      const g = el("g", { "data-table": t.id, tabindex: "0", role: "button", "aria-label": `${t.label} anzeigen` });
      t.shapeRects.forEach((r, i) => {
        g.appendChild(
          el("rect", {
            class: "table-shape",
            x: r.x,
            y: r.y,
            width: r.w,
            height: r.h,
            rx: 10,
            fill: t.color,
            "data-table": t.id,
          })
        );
      });
      const main = t.shapeRects[0];
      g.appendChild(el("text", { class: "table-label", x: main.x + main.w / 2, y: main.y + main.h / 2 - 9 })).textContent =
        t.label;
      g.appendChild(el("text", { class: "table-sublabel", x: main.x + main.w / 2, y: main.y + main.h / 2 + 12 })).textContent =
        `${guestsByTable[t.id].length}/${t.cap} Plätze`;
      g.addEventListener("click", () => showTableDetail(t.id, {}));
      g.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          showTableDetail(t.id, {});
        }
      });
      svg.appendChild(g);
    });
  }

  function clearHighlights() {
    svg.querySelectorAll(".table-shape.highlighted").forEach((n) => n.classList.remove("highlighted"));
  }

  function highlightTable(tableId) {
    clearHighlights();
    svg.querySelectorAll(`.table-shape[data-table="${tableId}"]`).forEach((n) => n.classList.add("highlighted"));
  }

  // ---------- Per-table seat diagram ----------

  function renderSeatDiagram(table, highlightSeatIndex) {
    seatSvg.innerHTML = "";
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
      // Leave enough room for the name label, which extends further out from
      // the dot than the dot itself in whichever direction it faces.
      const padX = s.dir === "e" || s.dir === "w" ? 68 : 22;
      const padTop = s.dir === "n" ? 30 : 20;
      const padBottom = s.dir === "s" ? 34 : 20;
      minX = Math.min(minX, s.x - padX);
      maxX = Math.max(maxX, s.x + padX);
      minY = Math.min(minY, s.y - padTop);
      maxY = Math.max(maxY, s.y + padBottom);
    });
    const pad = 6;
    seatSvg.setAttribute("viewBox", `${minX - pad} ${minY - pad} ${maxX - minX + 2 * pad} ${maxY - minY + 2 * pad}`);

    table.shapeRects.forEach((r) => {
      seatSvg.appendChild(
        el("rect", { class: "seat-table-shape", x: r.x, y: r.y, width: r.w, height: r.h, rx: 8, fill: table.color })
      );
    });

    table.seats.forEach((seat, i) => {
      const occupant = guestsByTable[table.id].find((g) => g.seat === i);
      const isHighlighted = i === highlightSeatIndex;
      const circle = el("circle", {
        class: "seat-circle" + (isHighlighted ? " seat-highlighted" : "") + (occupant ? "" : " seat-empty"),
        cx: seat.x,
        cy: seat.y,
        r: 11,
      });
      seatSvg.appendChild(circle);

      let lx = seat.x,
        ly = seat.y,
        anchor = "middle",
        baseline = "middle";
      if (seat.dir === "n") {
        ly -= 16;
        baseline = "auto";
      } else if (seat.dir === "s") {
        ly += 20;
        baseline = "hanging";
      } else if (seat.dir === "e") {
        lx += 16;
        anchor = "start";
      } else if (seat.dir === "w") {
        lx -= 16;
        anchor = "end";
      }
      const label = el("text", {
        class: "seat-label" + (isHighlighted ? " seat-label-highlighted" : ""),
        x: lx,
        y: ly,
        "text-anchor": anchor,
        "dominant-baseline": baseline,
      });
      label.textContent = occupant ? firstName(occupant.name) : "frei";
      seatSvg.appendChild(label);
    });
  }

  // ---------- Table detail panel ----------

  function guestTags(g) {
    const tags = [];
    if (g.isChild) tags.push("Kind");
    if (g.isVegan) tags.push("Vegan");
    else if (g.isVeggie) tags.push("Veggie");
    return tags;
  }

  function showTableDetail(tableId, opts) {
    const t = tableById[tableId];
    const highlightSeatIndex = opts.highlightSeat;
    highlightTable(tableId);
    detailSwatch.style.background = t.color;
    detailTitle.textContent = t.label;
    detailCap.textContent = `${guestsByTable[tableId].length} / ${t.cap} Plätze`;
    renderSeatDiagram(t, highlightSeatIndex);
    detailGuests.innerHTML = "";
    guestsByTable[tableId]
      .slice()
      .sort((a, b) => a.name.localeCompare(b.name, "de"))
      .forEach((g) => {
        const li = document.createElement("li");
        if (highlightSeatIndex !== undefined && g.seat === highlightSeatIndex) li.classList.add("guest-highlighted");
        const tags = guestTags(g);
        li.innerHTML = `<span>${g.name}</span>` + tags.map((tag) => `<span class="tag">${tag}</span>`).join("");
        detailGuests.appendChild(li);
      });
    detailEl.classList.add("visible");
    if (opts.scrollTo !== false) {
      detailEl.scrollIntoView({ behavior: "smooth", block: "nearest" });
    }
  }

  // ---------- Search ----------

  function renderResults(matches, query) {
    resultsEl.innerHTML = "";
    if (!query) return;
    if (matches.length === 0) {
      resultsEl.innerHTML = '<div class="no-results">Kein Gast gefunden – versucht einen anderen Namen.</div>';
      return;
    }
    matches.slice(0, 8).forEach((g) => {
      const t = tableById[g.table];
      const card = document.createElement("div");
      card.className = "search-result-card";
      card.tabIndex = 0;
      const tags = guestTags(g);
      card.innerHTML = `
        <span class="result-swatch" style="background:${t.color}"></span>
        <span class="result-info">
          <span class="result-name">${g.name}</span>
          <span class="result-table">${t.label}</span>
        </span>
        <span class="result-tags">${tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</span>
      `;
      const activate = () => {
        showTableDetail(g.table, { highlightSeat: g.seat });
      };
      card.addEventListener("click", activate);
      card.addEventListener("keydown", (e) => {
        if (e.key === "Enter") activate();
      });
      resultsEl.appendChild(card);
    });
  }

  searchInput.addEventListener("input", () => {
    const query = normalize(searchInput.value.trim());
    if (!query) {
      renderResults([], "");
      clearHighlights();
      return;
    }
    const matches = GUESTS.filter((g) => normalize(g.name).includes(query));
    renderResults(matches, query);
    if (matches.length === 1) {
      showTableDetail(matches[0].table, { highlightSeat: matches[0].seat, scrollTo: false });
    }
  });

  // ---------- Full directory ----------

  function buildDirectory() {
    TABLES.forEach((t) => {
      const section = document.createElement("div");
      section.className = "directory-table";
      const guests = guestsByTable[t.id].slice().sort((a, b) => a.name.localeCompare(b.name, "de"));
      section.innerHTML = `
        <h3><span class="result-swatch" style="background:${t.color};width:18px;height:18px"></span>${t.label} <span class="cap" style="font-size:0.75rem;color:var(--text-muted)">(${guests.length}/${t.cap})</span></h3>
        <ul class="table-guest-list">
          ${guests
            .map((g) => {
              const tags = guestTags(g);
              return `<li><span>${g.name}</span>${tags.map((tag) => `<span class="tag">${tag}</span>`).join("")}</li>`;
            })
            .join("")}
        </ul>
      `;
      directoryEl.appendChild(section);
    });
  }

  directoryToggle.addEventListener("click", () => {
    const nowVisible = directoryEl.classList.toggle("visible");
    directoryToggle.textContent = nowVisible ? "Gästeliste ausblenden" : "Ganze Gästeliste nach Tisch anzeigen";
  });

  buildFloorplan();
  buildDirectory();
})();

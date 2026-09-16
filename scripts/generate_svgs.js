import fs from 'fs';
import path from 'path';

const STROKE = '#0f172a';
const STROKE_WIDTH = 2.5;
const FONT_FAMILY = 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
const FONT_SIZE = 20;
const SUB_FONT_SIZE = 14;
const SUP_FONT_SIZE = 13;

function header(width, height) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}" fill="none">
  <defs>
    <style>
      .atom { font-family: ${FONT_FAMILY}; font-size: ${FONT_SIZE}px; font-weight: 600; fill: ${STROKE}; text-anchor: middle; dominant-baseline: central; }
      .atom-sub { font-size: ${SUB_FONT_SIZE}px; font-weight: 500; }
      .atom-sup { font-size: ${SUP_FONT_SIZE}px; font-weight: bold; fill: #dc2626; }
      .bond { stroke: ${STROKE}; stroke-width: ${STROKE_WIDTH}px; stroke-linecap: round; stroke-linejoin: round; }
    </style>
  </defs>`;
}

function footer() {
  return `</svg>\n`;
}

// 1. Formic Acid (CID 284)
function getFormicAcid() {
  const w = 260, h = 170;
  return header(w, h) + `
  <!-- C center -->
  <text x="130" y="115" class="atom">C</text>
  <!-- H left -->
  <text x="60" y="115" class="atom">H</text>
  <!-- OH right -->
  <text x="200" y="115" class="atom">OH</text>
  <!-- O top -->
  <text x="130" y="40" class="atom">O</text>

  <!-- H - C bond -->
  <line x1="78" y1="115" x2="114" y2="115" class="bond" />
  <!-- C - OH bond -->
  <line x1="146" y1="115" x2="180" y2="115" class="bond" />
  <!-- C = O double bond -->
  <line x1="125" y1="98" x2="125" y2="57" class="bond" />
  <line x1="135" y1="98" x2="135" y2="57" class="bond" />
` + footer();
}

// Formate Anion
function getFormateAnion() {
  const w = 260, h = 170;
  return header(w, h) + `
  <text x="130" y="115" class="atom">C</text>
  <text x="60" y="115" class="atom">H</text>
  <text x="200" y="115" class="atom">O<tspan class="atom-sup" dy="-7">⁻</tspan></text>
  <text x="130" y="40" class="atom">O</text>

  <line x1="78" y1="115" x2="114" y2="115" class="bond" />
  <line x1="146" y1="115" x2="182" y2="115" class="bond" />
  <line x1="125" y1="98" x2="125" y2="57" class="bond" />
  <line x1="135" y1="98" x2="135" y2="57" class="bond" />
` + footer();
}

// 2. Acetic Acid (CID 176)
function getAceticAcid() {
  const w = 290, h = 170;
  return header(w, h) + `
  <text x="150" y="115" class="atom">C</text>
  <text x="65" y="115" class="atom">CH<tspan class="atom-sub" dy="5">3</tspan></text>
  <text x="230" y="115" class="atom">OH</text>
  <text x="150" y="40" class="atom">O</text>

  <!-- CH3 - C bond -->
  <line x1="98" y1="115" x2="134" y2="115" class="bond" />
  <!-- C - OH bond -->
  <line x1="166" y1="115" x2="210" y2="115" class="bond" />
  <!-- C = O double bond -->
  <line x1="145" y1="98" x2="145" y2="57" class="bond" />
  <line x1="155" y1="98" x2="155" y2="57" class="bond" />
` + footer();
}

// Acetate Anion
function getAcetateAnion() {
  const w = 290, h = 170;
  return header(w, h) + `
  <text x="150" y="115" class="atom">C</text>
  <text x="65" y="115" class="atom">CH<tspan class="atom-sub" dy="5">3</tspan></text>
  <text x="230" y="115" class="atom">O<tspan class="atom-sup" dy="-7">⁻</tspan></text>
  <text x="150" y="40" class="atom">O</text>

  <line x1="98" y1="115" x2="134" y2="115" class="bond" />
  <line x1="166" y1="115" x2="212" y2="115" class="bond" />
  <line x1="145" y1="98" x2="145" y2="57" class="bond" />
  <line x1="155" y1="98" x2="155" y2="57" class="bond" />
` + footer();
}

// 3. Lactic Acid (CID 612)
function getLacticAcid() {
  const w = 360, h = 170;
  return header(w, h) + `
  <text x="55" y="115" class="atom">CH<tspan class="atom-sub" dy="5">3</tspan></text>
  <text x="145" y="115" class="atom">CH</text>
  <text x="145" y="40" class="atom">OH</text>
  <text x="235" y="115" class="atom">C</text>
  <text x="235" y="40" class="atom">O</text>
  <text x="310" y="115" class="atom">OH</text>

  <!-- CH3 - CH bond -->
  <line x1="88" y1="115" x2="126" y2="115" class="bond" />
  <!-- CH - OH vertical bond -->
  <line x1="145" y1="98" x2="145" y2="57" class="bond" />
  <!-- CH - C bond -->
  <line x1="166" y1="115" x2="219" y2="115" class="bond" />
  <!-- C = O double bond -->
  <line x1="230" y1="98" x2="230" y2="57" class="bond" />
  <line x1="240" y1="98" x2="240" y2="57" class="bond" />
  <!-- C - OH bond -->
  <line x1="251" y1="115" x2="290" y2="115" class="bond" />
` + footer();
}

// Lactate Anion
function getLactateAnion() {
  const w = 360, h = 170;
  return header(w, h) + `
  <text x="55" y="115" class="atom">CH<tspan class="atom-sub" dy="5">3</tspan></text>
  <text x="145" y="115" class="atom">CH</text>
  <text x="145" y="40" class="atom">OH</text>
  <text x="235" y="115" class="atom">C</text>
  <text x="235" y="40" class="atom">O</text>
  <text x="310" y="115" class="atom">O<tspan class="atom-sup" dy="-7">⁻</tspan></text>

  <line x1="88" y1="115" x2="126" y2="115" class="bond" />
  <line x1="145" y1="98" x2="145" y2="57" class="bond" />
  <line x1="166" y1="115" x2="219" y2="115" class="bond" />
  <line x1="230" y1="98" x2="230" y2="57" class="bond" />
  <line x1="240" y1="98" x2="240" y2="57" class="bond" />
  <line x1="251" y1="115" x2="292" y2="115" class="bond" />
` + footer();
}

// Helper for Benzene ring: returns SVG path elements
function renderBenzeneRing(cx, cy, r) {
  // Vertices for hexagon with horizontal bonds at top/bottom or points at sides:
  // Points at angle: 0, 60, 120, 180, 240, 300
  const pts = [];
  for (let i = 0; i < 6; i++) {
    const rad = (i * 60) * Math.PI / 180;
    pts.push({
      x: cx + r * Math.cos(rad),
      y: cy + r * Math.sin(rad)
    });
  }

  // Hexagon path
  const hex = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)} ` +
    pts.slice(1).map(p => `L ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ') + ' Z';

  // Three alternating double bonds inside (inset by 6px)
  const innerR = r - 7;
  const inPts = [];
  for (let i = 0; i < 6; i++) {
    const rad = (i * 60) * Math.PI / 180;
    inPts.push({
      x: cx + innerR * Math.cos(rad),
      y: cy + innerR * Math.sin(rad)
    });
  }

  return `
  <!-- Benzene ring hexagon -->
  <path d="${hex}" class="bond" fill="none" />
  <!-- Inner double bonds: 0-1, 2-3, 4-5 -->
  <line x1="${inPts[0].x.toFixed(1)}" y1="${inPts[0].y.toFixed(1)}" x2="${inPts[1].x.toFixed(1)}" y2="${inPts[1].y.toFixed(1)}" class="bond" />
  <line x1="${inPts[2].x.toFixed(1)}" y1="${inPts[2].y.toFixed(1)}" x2="${inPts[3].x.toFixed(1)}" y2="${inPts[3].y.toFixed(1)}" class="bond" />
  <line x1="${inPts[4].x.toFixed(1)}" y1="${inPts[4].y.toFixed(1)}" x2="${inPts[5].x.toFixed(1)}" y2="${inPts[5].y.toFixed(1)}" class="bond" />
  `;
}

// 4. Benzoic Acid (CID 243)
function getBenzoicAcid() {
  const w = 320, h = 180;
  const cx = 85, cy = 95, r = 42;
  // Vertex 0 is at (cx + r, cy) = (127, 95).
  return header(w, h) +
    renderBenzeneRing(cx, cy, r) + `
  <!-- Carboxyl group attached at vertex 0 (right) -->
  <text x="195" y="95" class="atom">C</text>
  <text x="195" y="32" class="atom">O</text>
  <text x="270" y="95" class="atom">OH</text>

  <!-- Ring to C bond -->
  <line x1="127" y1="95" x2="179" y2="95" class="bond" />
  <!-- C = O double bond -->
  <line x1="190" y1="78" x2="190" y2="48" class="bond" />
  <line x1="200" y1="78" x2="200" y2="48" class="bond" />
  <!-- C - OH bond -->
  <line x1="211" y1="95" x2="250" y2="95" class="bond" />
` + footer();
}

// Benzoate Anion
function getBenzoateAnion() {
  const w = 320, h = 180;
  const cx = 85, cy = 95, r = 42;
  return header(w, h) +
    renderBenzeneRing(cx, cy, r) + `
  <text x="195" y="95" class="atom">C</text>
  <text x="195" y="32" class="atom">O</text>
  <text x="270" y="95" class="atom">O<tspan class="atom-sup" dy="-7">⁻</tspan></text>

  <line x1="127" y1="95" x2="179" y2="95" class="bond" />
  <line x1="190" y1="78" x2="190" y2="48" class="bond" />
  <line x1="200" y1="78" x2="200" y2="48" class="bond" />
  <line x1="211" y1="95" x2="252" y2="95" class="bond" />
` + footer();
}

// 5. Salicylic Acid (CID 338) - 1,2-OH + COOH (ortho)
function getSalicylicAcid() {
  const w = 330, h = 230;
  const cx = 85, cy = 115, r = 44;
  // Vertex 5 is at angle 300 deg: cx + r*cos(-60) = 85 + 22 = 107, cy - r*sin(60) = 115 - 38.1 = 76.9
  // Vertex 0 is at angle 0 deg: (129, 115)
  // Vertex 1 is at angle 60 deg: cx + r*cos(60) = 107, cy + r*sin(60) = 115 + 38.1 = 153.1
  // Position 1 (-COOH) at Vertex 5 / top-right
  // Position 2 (-OH) at Vertex 0 / right
  return header(w, h) +
    renderBenzeneRing(cx, cy, r) + `
  <!-- Position 1 (C=O, OH) at top right -->
  <text x="195" y="58" class="atom">C</text>
  <text x="195" y="15" class="atom">O</text>
  <text x="270" y="58" class="atom">OH</text>

  <!-- Bond from vertex 5 (107, 77) to C (183, 58) -->
  <line x1="107" y1="77" x2="180" y2="60" class="bond" />
  <!-- C = O double bond -->
  <line x1="190" y1="42" x2="190" y2="28" class="bond" />
  <line x1="200" y1="42" x2="200" y2="28" class="bond" />
  <!-- C - OH bond -->
  <line x1="211" y1="58" x2="250" y2="58" class="bond" />

  <!-- Position 2: ortho -OH at vertex 0 (129, 115) -->
  <line x1="129" y1="115" x2="175" y2="120" class="bond" />
  <text x="198" y="122" class="atom">OH</text>
` + footer();
}

// Salicylate Anion
function getSalicylateAnion() {
  const w = 330, h = 230;
  const cx = 85, cy = 115, r = 44;
  return header(w, h) +
    renderBenzeneRing(cx, cy, r) + `
  <!-- Position 1: -COO⁻ -->
  <text x="195" y="58" class="atom">C</text>
  <text x="195" y="15" class="atom">O</text>
  <text x="270" y="58" class="atom">O<tspan class="atom-sup" dy="-7">⁻</tspan></text>

  <line x1="107" y1="77" x2="180" y2="60" class="bond" />
  <line x1="190" y1="42" x2="190" y2="28" class="bond" />
  <line x1="200" y1="42" x2="200" y2="28" class="bond" />
  <line x1="211" y1="58" x2="252" y2="58" class="bond" />

  <!-- Position 2: ortho -OH -->
  <line x1="129" y1="115" x2="175" y2="120" class="bond" />
  <text x="198" y="122" class="atom">OH</text>
` + footer();
}

// 6. Phthalic Acid (CID 1017) - Benzene-1,2-dicarboxylic acid
function getPhthalicAcid() {
  const w = 330, h = 250;
  const cx = 80, cy = 125, r = 44;
  // Vertex 5 (top-right: 102, 87) -> C1(=O)OH
  // Vertex 1 (bottom-right: 102, 163) -> C2(=O)OH
  return header(w, h) +
    renderBenzeneRing(cx, cy, r) + `
  <!-- COOH #1 (top-right) -->
  <text x="180" y="65" class="atom">C</text>
  <text x="180" y="20" class="atom">O</text>
  <text x="250" y="65" class="atom">OH</text>
  <line x1="102" y1="87" x2="164" y2="70" class="bond" />
  <line x1="175" y1="48" x2="175" y2="33" class="bond" />
  <line x1="185" y1="48" x2="185" y2="33" class="bond" />
  <line x1="196" y1="65" x2="230" y2="65" class="bond" />

  <!-- COOH #2 (bottom-right, ortho 1,2) -->
  <text x="180" y="185" class="atom">C</text>
  <text x="180" y="230" class="atom">O</text>
  <text x="250" y="185" class="atom">OH</text>
  <line x1="102" y1="163" x2="164" y2="180" class="bond" />
  <line x1="175" y1="202" x2="175" y2="217" class="bond" />
  <line x1="185" y1="202" x2="185" y2="217" class="bond" />
  <line x1="196" y1="185" x2="230" y2="185" class="bond" />
` + footer();
}

// 7. Terephthalic Acid (CID 7489) - Benzene-1,4-dicarboxylic acid
function getTerephthalicAcid() {
  const w = 460, h = 180;
  const cx = 230, cy = 95, r = 42;
  // Vertex 3 (left: cx - r = 188, 95) -> -COOH left
  // Vertex 0 (right: cx + r = 272, 95) -> -COOH right
  return header(w, h) +
    renderBenzeneRing(cx, cy, r) + `
  <!-- Left COOH (Position 4) -->
  <text x="50" y="95" class="atom">HO</text>
  <text x="120" y="95" class="atom">C</text>
  <text x="120" y="35" class="atom">O</text>

  <line x1="72" y1="95" x2="104" y2="95" class="bond" />
  <line x1="136" y1="95" x2="188" y2="95" class="bond" />
  <line x1="115" y1="78" x2="115" y2="50" class="bond" />
  <line x1="125" y1="78" x2="125" y2="50" class="bond" />

  <!-- Right COOH (Position 1, opposite 1,4) -->
  <text x="340" y="95" class="atom">C</text>
  <text x="340" y="35" class="atom">O</text>
  <text x="410" y="95" class="atom">OH</text>

  <line x1="272" y1="95" x2="324" y2="95" class="bond" />
  <line x1="356" y1="95" x2="390" y2="95" class="bond" />
  <line x1="335" y1="78" x2="335" y2="50" class="bond" />
  <line x1="345" y1="78" x2="345" y2="50" class="bond" />
` + footer();
}

// 8. Oxalic Acid (CID 971) - HO-C(=O)-C(=O)-OH
function getOxalicAcid() {
  const w = 320, h = 170;
  return header(w, h) + `
  <text x="50" y="115" class="atom">HO</text>
  <text x="120" y="115" class="atom">C</text>
  <text x="120" y="40" class="atom">O</text>

  <text x="200" y="115" class="atom">C</text>
  <text x="200" y="40" class="atom">O</text>
  <text x="270" y="115" class="atom">OH</text>

  <!-- Left HO-C -->
  <line x1="72" y1="115" x2="104" y2="115" class="bond" />
  <!-- Left C=O -->
  <line x1="115" y1="98" x2="115" y2="57" class="bond" />
  <line x1="125" y1="98" x2="125" y2="57" class="bond" />

  <!-- C - C central bond -->
  <line x1="136" y1="115" x2="184" y2="115" class="bond" />

  <!-- Right C=O -->
  <line x1="195" y1="98" x2="195" y2="57" class="bond" />
  <line x1="205" y1="98" x2="205" y2="57" class="bond" />
  <!-- Right C-OH -->
  <line x1="216" y1="115" x2="250" y2="115" class="bond" />
` + footer();
}

// Oxalate Anion (⁻O-C(=O)-C(=O)-O⁻)
function getOxalateAnion() {
  const w = 320, h = 170;
  return header(w, h) + `
  <text x="50" y="115" class="atom"><tspan class="atom-sup" dy="-7">⁻</tspan>O</text>
  <text x="120" y="115" class="atom">C</text>
  <text x="120" y="40" class="atom">O</text>

  <text x="200" y="115" class="atom">C</text>
  <text x="200" y="40" class="atom">O</text>
  <text x="270" y="115" class="atom">O<tspan class="atom-sup" dy="-7">⁻</tspan></text>

  <line x1="68" y1="115" x2="104" y2="115" class="bond" />
  <line x1="115" y1="98" x2="115" y2="57" class="bond" />
  <line x1="125" y1="98" x2="125" y2="57" class="bond" />

  <line x1="136" y1="115" x2="184" y2="115" class="bond" />

  <line x1="195" y1="98" x2="195" y2="57" class="bond" />
  <line x1="205" y1="98" x2="205" y2="57" class="bond" />
  <line x1="216" y1="115" x2="252" y2="115" class="bond" />
` + footer();
}

// 9. Malonic Acid (CID 867) - 1 CH2
function getMalonicAcid() {
  const w = 390, h = 170;
  return header(w, h) + `
  <text x="50" y="115" class="atom">HO</text>
  <text x="120" y="115" class="atom">C</text>
  <text x="120" y="40" class="atom">O</text>

  <text x="195" y="115" class="atom">CH<tspan class="atom-sub" dy="5">2</tspan></text>

  <text x="270" y="115" class="atom">C</text>
  <text x="270" y="40" class="atom">O</text>
  <text x="340" y="115" class="atom">OH</text>

  <!-- Bonds -->
  <line x1="72" y1="115" x2="104" y2="115" class="bond" />
  <line x1="115" y1="98" x2="115" y2="57" class="bond" />
  <line x1="125" y1="98" x2="125" y2="57" class="bond" />

  <line x1="136" y1="115" x2="168" y2="115" class="bond" />
  <line x1="222" y1="115" x2="254" y2="115" class="bond" />

  <line x1="265" y1="98" x2="265" y2="57" class="bond" />
  <line x1="275" y1="98" x2="275" y2="57" class="bond" />
  <line x1="286" y1="115" x2="320" y2="115" class="bond" />
` + footer();
}

// 10. Succinic Acid (CID 1110) - 2 CH2
function getSuccinicAcid() {
  const w = 460, h = 170;
  return header(w, h) + `
  <text x="50" y="115" class="atom">HO</text>
  <text x="115" y="115" class="atom">C</text>
  <text x="115" y="40" class="atom">O</text>

  <text x="185" y="115" class="atom">CH<tspan class="atom-sub" dy="5">2</tspan></text>
  <text x="275" y="115" class="atom">CH<tspan class="atom-sub" dy="5">2</tspan></text>

  <text x="345" y="115" class="atom">C</text>
  <text x="345" y="40" class="atom">O</text>
  <text x="410" y="115" class="atom">OH</text>

  <line x1="72" y1="115" x2="99" y2="115" class="bond" />
  <line x1="110" y1="98" x2="110" y2="57" class="bond" />
  <line x1="120" y1="98" x2="120" y2="57" class="bond" />

  <line x1="131" y1="115" x2="158" y2="115" class="bond" />
  <line x1="212" y1="115" x2="248" y2="115" class="bond" />
  <line x1="302" y1="115" x2="329" y2="115" class="bond" />

  <line x1="340" y1="98" x2="340" y2="57" class="bond" />
  <line x1="350" y1="98" x2="350" y2="57" class="bond" />
  <line x1="361" y1="115" x2="390" y2="115" class="bond" />
` + footer();
}

// 11. Glutaric Acid (CID 743) - 3 CH2
function getGlutaricAcid() {
  const w = 530, h = 170;
  return header(w, h) + `
  <text x="45" y="115" class="atom">HO</text>
  <text x="105" y="115" class="atom">C</text>
  <text x="105" y="40" class="atom">O</text>

  <text x="175" y="115" class="atom">CH<tspan class="atom-sub" dy="5">2</tspan></text>
  <text x="265" y="115" class="atom">CH<tspan class="atom-sub" dy="5">2</tspan></text>
  <text x="355" y="115" class="atom">CH<tspan class="atom-sub" dy="5">2</tspan></text>

  <text x="425" y="115" class="atom">C</text>
  <text x="425" y="40" class="atom">O</text>
  <text x="485" y="115" class="atom">OH</text>

  <line x1="67" y1="115" x2="89" y2="115" class="bond" />
  <line x1="100" y1="98" x2="100" y2="57" class="bond" />
  <line x1="110" y1="98" x2="110" y2="57" class="bond" />

  <line x1="121" y1="115" x2="148" y2="115" class="bond" />
  <line x1="202" y1="115" x2="238" y2="115" class="bond" />
  <line x1="292" y1="115" x2="328" y2="115" class="bond" />
  <line x1="382" y1="115" x2="409" y2="115" class="bond" />

  <line x1="420" y1="98" x2="420" y2="57" class="bond" />
  <line x1="430" y1="98" x2="430" y2="57" class="bond" />
  <line x1="441" y1="115" x2="465" y2="115" class="bond" />
` + footer();
}

// 12. Adipic Acid (CID 196) - 4 CH2
function getAdipicAcid() {
  const w = 620, h = 170;
  return header(w, h) + `
  <text x="45" y="115" class="atom">HO</text>
  <text x="105" y="115" class="atom">C</text>
  <text x="105" y="40" class="atom">O</text>

  <text x="175" y="115" class="atom">CH<tspan class="atom-sub" dy="5">2</tspan></text>
  <text x="260" y="115" class="atom">CH<tspan class="atom-sub" dy="5">2</tspan></text>
  <text x="345" y="115" class="atom">CH<tspan class="atom-sub" dy="5">2</tspan></text>
  <text x="430" y="115" class="atom">CH<tspan class="atom-sub" dy="5">2</tspan></text>

  <text x="500" y="115" class="atom">C</text>
  <text x="500" y="40" class="atom">O</text>
  <text x="565" y="115" class="atom">OH</text>

  <line x1="67" y1="115" x2="89" y2="115" class="bond" />
  <line x1="100" y1="98" x2="100" y2="57" class="bond" />
  <line x1="110" y1="98" x2="110" y2="57" class="bond" />

  <line x1="121" y1="115" x2="148" y2="115" class="bond" />
  <line x1="202" y1="115" x2="233" y2="115" class="bond" />
  <line x1="287" y1="115" x2="318" y2="115" class="bond" />
  <line x1="372" y1="115" x2="403" y2="115" class="bond" />
  <line x1="457" y1="115" x2="484" y2="115" class="bond" />

  <line x1="495" y1="98" x2="495" y2="57" class="bond" />
  <line x1="505" y1="98" x2="505" y2="57" class="bond" />
  <line x1="516" y1="115" x2="545" y2="115" class="bond" />
` + footer();
}

// Generate all files
const acids = {
  'formic.svg': getFormicAcid(),
  'acetic.svg': getAceticAcid(),
  'lactic.svg': getLacticAcid(),
  'benzoic.svg': getBenzoicAcid(),
  'salicylic.svg': getSalicylicAcid(),
  'phthalic.svg': getPhthalicAcid(),
  'terephthalic.svg': getTerephthalicAcid(),
  'oxalic.svg': getOxalicAcid(),
  'malonic.svg': getMalonicAcid(),
  'succinic.svg': getSuccinicAcid(),
  'glutaric.svg': getGlutaricAcid(),
  'adipic.svg': getAdipicAcid(),
};

const anions = {
  'formate.svg': getFormateAnion(),
  'acetate.svg': getAcetateAnion(),
  'lactate.svg': getLactateAnion(),
  'benzoate.svg': getBenzoateAnion(),
  'salicylate.svg': getSalicylateAnion(),
  'oxalate.svg': getOxalateAnion(),
};

const acidsDir = path.resolve('public/molecules/acids');
const anionsDir = path.resolve('public/molecules/anions');

Object.entries(acids).forEach(([name, content]) => {
  fs.writeFileSync(path.join(acidsDir, name), content.trim());
  console.log(`Saved acid: ${name}`);
});

Object.entries(anions).forEach(([name, content]) => {
  fs.writeFileSync(path.join(anionsDir, name), content.trim());
  console.log(`Saved anion: ${name}`);
});

console.log('All 18 chemical structures generated successfully!');

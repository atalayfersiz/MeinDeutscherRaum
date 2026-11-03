import fs from "fs";
import path from "path";
import matter from "gray-matter";

const DATA_DIR = path.resolve("./data");
const NOTES_DIR = path.join(DATA_DIR, "notes");
const RAW_DIR = path.join(DATA_DIR, "raw");
const EXERCISES_FILE = path.join(DATA_DIR, "exercises", "exercises.json");
const GENERATED_DIR = path.join(DATA_DIR, "generated");
const PUBLIC_DATA_DIR = path.resolve("./public/data");

console.log("⚡ Starting MeinDeutscherRaum data sync & parser...");

// Ensure output directories
if (!fs.existsSync(GENERATED_DIR)) fs.mkdirSync(GENERATED_DIR, { recursive: true });
if (!fs.existsSync(PUBLIC_DATA_DIR)) fs.mkdirSync(PUBLIC_DATA_DIR, { recursive: true });

const vocabularyList = [];
const connectorsList = [];
const textNotes = [];
const graphNodes = [];
const graphEdges = [];

const nodeMap = new Map();

function addGraphNode(node) {
  if (!nodeMap.has(node.id)) {
    nodeMap.set(node.id, node);
    graphNodes.push(node);
  } else {
    // merge properties
    const existing = nodeMap.get(node.id);
    Object.assign(existing, node);
  }
}

function addGraphEdge(edge) {
  const edgeId = `${edge.source}->${edge.target}:${edge.relation}`;
  if (!graphEdges.some(e => e.id === edgeId)) {
    graphEdges.push({ id: edgeId, ...edge });
  }
}

// 1. Base grammar nodes
addGraphNode({ id: "case-akk", label: "Akkusativ (Wen? Was?)", type: "case", category: "Grammatik", color: "#3b82f6" });
addGraphNode({ id: "case-dat", label: "Dativ (Wem? Wo?)", type: "case", category: "Grammatik", color: "#8b5cf6" });
addGraphNode({ id: "prep-auf", label: "auf", type: "preposition", category: "Präposition", color: "#f59e0b" });
addGraphNode({ id: "prep-ueber", label: "über", type: "preposition", category: "Präposition", color: "#f59e0b" });
addGraphNode({ id: "prep-an", label: "an", type: "preposition", category: "Präposition", color: "#f59e0b" });
addGraphNode({ id: "prep-fuer", label: "für", type: "preposition", category: "Präposition", color: "#f59e0b" });
addGraphNode({ id: "prep-um", label: "um", type: "preposition", category: "Präposition", color: "#f59e0b" });
addGraphNode({ id: "prep-mit", label: "mit", type: "preposition", category: "Präposition", color: "#f59e0b" });
addGraphNode({ id: "prep-von", label: "von", type: "preposition", category: "Präposition", color: "#f59e0b" });
addGraphNode({ id: "prep-zu", label: "zu", type: "preposition", category: "Präposition", color: "#f59e0b" });
addGraphNode({ id: "prep-nach", label: "nach", type: "preposition", category: "Präposition", color: "#f59e0b" });

// 2. Parse Markdown notes
if (fs.existsSync(NOTES_DIR)) {
  const noteFiles = fs.readdirSync(NOTES_DIR).filter(f => f.endsWith(".md"));
  for (const file of noteFiles) {
    const filePath = path.join(NOTES_DIR, file);
    const content = fs.readFileSync(filePath, "utf-8");
    const { data: frontmatter, content: markdownBody } = matter(content);

    textNotes.push({
      id: path.basename(file, ".md"),
      title: frontmatter.title || file,
      level: frontmatter.level || "B1",
      category: frontmatter.category || "Allgemein",
      updated: frontmatter.updated || new Date().toISOString().split("T")[0],
      content: markdownBody,
      rawFile: file
    });

    // Parse tables if present: | Verb | Präposition | Kasus | Bedeutung (TR) | Meaning (EN) | Beispielsatz |
    const lines = markdownBody.split("\n");
    for (const line of lines) {
      if (line.startsWith("|") && !line.includes("---") && !line.toLowerCase().includes("verb |")) {
        const parts = line.split("|").map(s => s.trim()).filter(Boolean);
        if (parts.length >= 6) {
          const [verb, prep, kasus, meaningTr, meaningEn, example] = parts;
          const verbClean = verb.replace(/`/g, "");
          const verbId = `verb-${verbClean.toLowerCase().replace(/\s+/g, "-")}`;
          const prepId = `prep-${prep.toLowerCase()}`;
          const caseId = `case-${kasus.toLowerCase().startsWith("akk") ? "akk" : "dat"}`;

          // Add to vocabulary
          vocabularyList.push({
            id: verbId,
            german: verbClean,
            type: "verb",
            preposition: prep,
            governedCase: kasus,
            meaningTr,
            meaningEn,
            example,
            level: frontmatter.level || "B1",
            conjugation: {
              prasens3rd: verbClean.startsWith("sich ") ? `er/sie ${verbClean.replace("sich ", "")}t sich` : `er/sie ${verbClean}t`,
              perfekt: `hat ${verbClean}t`
            }
          });

          // Add to graph
          addGraphNode({
            id: verbId,
            label: verbClean,
            type: "verb",
            level: frontmatter.level || "B1",
            meaningTr,
            meaningEn,
            example,
            prep,
            kasus
          });

          if (prep) {
            addGraphNode({ id: prepId, label: prep, type: "preposition" });
            addGraphEdge({
              source: verbId,
              target: prepId,
              relation: "takes_preposition",
              label: `+ ${prep}`
            });
            addGraphEdge({
              source: prepId,
              target: caseId,
              relation: "governs_case",
              label: `+ ${kasus}`
            });
          }
        }
      }
    }
  }
}

// 3. Parse Connectors from Note 02 or generate structured connectors
const predefinedConnectors = [
  // Gruppe 1: Position 0 (ADUSO)
  {
    id: "conn-aber",
    name: "aber",
    group: "position_0",
    groupTitleTr: "Pozisyon 0 (ADUSO)",
    groupTitleEn: "Position 0 (ADUSO)",
    formula: "Hauptsatz + aber + Subjekt + Verb + ...",
    meaningTr: "ama, fakat",
    meaningEn: "but, however",
    example: "Ich wollte kommen, aber ich hatte leider keine Zeit.",
    level: "A1-B1",
    notesTr: "Cümledeki özne ve fiil sırası değişmez (Pozisyon 0).",
    notesEn: "Does not shift word order. Occupies slot 0."
  },
  {
    id: "conn-denn",
    name: "denn",
    group: "position_0",
    groupTitleTr: "Pozisyon 0 (ADUSO)",
    groupTitleEn: "Position 0 (ADUSO)",
    formula: "Hauptsatz + denn + Subjekt + Verb + ...",
    meaningTr: "çünkü",
    meaningEn: "because, for",
    example: "Er lernt Deutsch, denn er möchte in Berlin arbeiten.",
    level: "A2-B1",
    notesTr: "Pozisyon 0; 'weil' gibi fiili sona atmaz!",
    notesEn: "Position 0; does NOT send verb to end unlike 'weil'!"
  },
  {
    id: "conn-und",
    name: "und",
    group: "position_0",
    groupTitleTr: "Pozisyon 0 (ADUSO)",
    groupTitleEn: "Position 0 (ADUSO)",
    formula: "Hauptsatz + und + Subjekt + Verb + ...",
    meaningTr: "ve",
    meaningEn: "and",
    example: "Wir kochen zusammen und wir hören klassische Musik.",
    level: "A1",
    notesTr: "İki bağımsız ana cümleyi veya öğeyi bağlar.",
    notesEn: "Connects two independent main clauses or elements."
  },
  {
    id: "conn-sondern",
    name: "sondern",
    group: "position_0",
    groupTitleTr: "Pozisyon 0 (ADUSO)",
    groupTitleEn: "Position 0 (ADUSO)",
    formula: "nicht/kein... + , sondern + Subjekt + Verb + ...",
    meaningTr: "bilakis, aksine",
    meaningEn: "but rather, on the contrary",
    example: "Er trinkt keinen Kaffee, sondern er bevorzugt grünen Tee.",
    level: "A2-B1",
    notesTr: "Sadece ilk cümlede bir olumsuzluk ('nicht' / 'kein') olduğunda kullanılır.",
    notesEn: "Only used after a negative statement ('nicht' / 'kein')."
  },
  {
    id: "conn-oder",
    name: "oder",
    group: "position_0",
    groupTitleTr: "Pozisyon 0 (ADUSO)",
    groupTitleEn: "Position 0 (ADUSO)",
    formula: "Hauptsatz + oder + Subjekt + Verb + ...",
    meaningTr: "veya, ya da",
    meaningEn: "or",
    example: "Gehen wir heute ins Kino oder bleiben wir zu Hause?",
    level: "A1",
    notesTr: "Seçenek sunarken kullanılır. Pozisyon 0.",
    notesEn: "Presents alternatives. Position 0."
  },

  // Gruppe 2: Nebensatz (Fiil sonda)
  {
    id: "conn-weil",
    name: "weil",
    group: "nebensatz",
    groupTitleTr: "Nebensatz (Fiil Sonda)",
    groupTitleEn: "Subordinate (Verb at End)",
    formula: "..., weil + Subjekt + ... + VERB (Ende)",
    meaningTr: "çünkü, -dığı için",
    meaningEn: "because, since",
    example: "Ich gehe früh schlafen, weil ich morgen eine wichtige Prüfung habe.",
    level: "A2-B1",
    notesTr: "Yan cümle (Nebensatz) başlatır, çekimli fiil en sondadır.",
    notesEn: "Subordinating conjunction; conjugated verb is placed at the end."
  },
  {
    id: "conn-dass",
    name: "dass",
    group: "nebensatz",
    groupTitleTr: "Nebensatz (Fiil Sonda)",
    groupTitleEn: "Subordinate (Verb at End)",
    formula: "..., dass + Subjekt + ... + VERB (Ende)",
    meaningTr: "-ki, -diğini",
    meaningEn: "that",
    example: "Ich weiß, dass die deutsche Grammatik sehr präzise ist.",
    level: "A2-B1",
    notesTr: "Nesne yan cümlesi kurar. Fiil cümlenin en sonundadır.",
    notesEn: "Introduces content clauses. Verb at the end."
  },
  {
    id: "conn-obwohl",
    name: "obwohl",
    group: "nebensatz",
    groupTitleTr: "Nebensatz (Fiil Sonda)",
    groupTitleEn: "Subordinate (Verb at End)",
    formula: "..., obwohl + Subjekt + ... + VERB (Ende)",
    meaningTr: "-e rağmen, karşın",
    meaningEn: "although, even though",
    example: "Er geht spazieren, obwohl es draußen in Strömen regnet.",
    level: "B1",
    notesTr: "Zıtlık bildirir (Konzessiv). Fiil sonda.",
    notesEn: "Expresses concession. Verb at the end."
  },
  {
    id: "conn-wenn",
    name: "wenn",
    group: "nebensatz",
    groupTitleTr: "Nebensatz (Fiil Sonda)",
    groupTitleEn: "Subordinate (Verb at End)",
    formula: "Wenn + Subjekt + ... + Verb, [Verb + Subjekt...]",
    meaningTr: "eğer, zaman bildiren -ince/-dığında",
    meaningEn: "if, whenever, when",
    example: "Wenn ich freie Zeit habe, lese ich gern deutsche Romane.",
    level: "A2-B1",
    notesTr: "Koşul veya tekrarlanan zaman belirtir. Fiil sonda.",
    notesEn: "Conditional or recurring time. Verb at the end."
  },
  {
    id: "conn-damit",
    name: "damit",
    group: "nebensatz",
    groupTitleTr: "Nebensatz (Fiil Sonda)",
    groupTitleEn: "Subordinate (Verb at End)",
    formula: "..., damit + Subjekt + ... + VERB (Ende)",
    meaningTr: "-sin diye, -mesi amacıyla",
    meaningEn: "so that, in order that",
    example: "Er wiederholt täglich Vokabeln, damit er fließend Deutsch sprechen kann.",
    level: "B1",
    notesTr: "Amaç bildirir (Finalsatz). Özneler farklı olsa bile kullanılır.",
    notesEn: "Expresses purpose (Final clause). Used even with differing subjects."
  },

  // Gruppe 3: Adverbiale Konnektoren (Pos 1)
  {
    id: "conn-deshalb",
    name: "deshalb / darum / daher",
    group: "position_1",
    groupTitleTr: "Pozisyon 1 (Fiil Hemen Sonra)",
    groupTitleEn: "Position 1 (Verb Immediately Next)",
    formula: "Hauptsatz. Deshalb + VERB + Subjekt + ...",
    meaningTr: "bu yüzden, bu nedenle",
    meaningEn: "therefore, that's why",
    example: "Es hat stark geregnet, deshalb bin ich zu Hause geblieben.",
    level: "A2-B1",
    notesTr: "Pozisyon 1'dedir; çekimli fiil hemen ardından 2. pozisyonda gelir.",
    notesEn: "Position 1; conjugated verb immediately follows in position 2."
  },
  {
    id: "conn-trotzdem",
    name: "trotzdem",
    group: "position_1",
    groupTitleTr: "Pozisyon 1 (Fiil Hemen Sonra)",
    groupTitleEn: "Position 1 (Verb Immediately Next)",
    formula: "Hauptsatz. Trotzdem + VERB + Subjekt + ...",
    meaningTr: "buna rağmen, yine de",
    meaningEn: "nevertheless, anyway",
    example: "Es war eiskalt, trotzdem trug er keine dicke Winterjacke.",
    level: "B1",
    notesTr: "Pozisyon 1'dedir; fiil hemen bağlaçtan sonra gelir.",
    notesEn: "Position 1; verb comes right after the connector."
  },
  {
    id: "conn-sonst",
    name: "sonst",
    group: "position_1",
    groupTitleTr: "Pozisyon 1 (Fiil Hemen Sonra)",
    groupTitleEn: "Position 1 (Verb Immediately Next)",
    formula: "Imperativ/Aussage. Sonst + VERB + Subjekt + ...",
    meaningTr: "yoksa, aksi halde",
    meaningEn: "otherwise, or else",
    example: "Beeil dich bitte, sonst verpassen wir den letzten Zug!",
    level: "A2-B1",
    notesTr: "Pozisyon 1; fiil hemen sonra gelir.",
    notesEn: "Position 1; verb follows immediately."
  },
  {
    id: "conn-ausserdem",
    name: "außerdem",
    group: "position_1",
    groupTitleTr: "Pozisyon 1 (Fiil Hemen Sonra)",
    groupTitleEn: "Position 1 (Verb Immediately Next)",
    formula: "Hauptsatz. Außerdem + VERB + Subjekt + ...",
    meaningTr: "ayrıca, bundan başka",
    meaningEn: "furthermore, moreover",
    example: "Die Wohnung ist modern, außerdem liegt sie sehr zentral.",
    level: "B1",
    notesTr: "Ek bilgi ekler. Pozisyon 1.",
    notesEn: "Adds complementary info. Position 1."
  },

  // Gruppe 4: Zweiteilige Konnektoren
  {
    id: "conn-nicht-nur-sondern-auch",
    name: "nicht nur ... sondern auch",
    group: "zweiteilig",
    groupTitleTr: "İkili Bağlaçlar (Zweiteilig)",
    groupTitleEn: "Two-Part Connectors",
    formula: "nicht nur [X], sondern auch [Y]",
    meaningTr: "sadece ... değil, aynı zamanda ...",
    meaningEn: "not only ... but also",
    example: "Er spricht nicht nur fließend Deutsch, sondern auch Spanisch.",
    level: "B1-B2",
    notesTr: "İki olumlu durumu güçlendirerek bağlar.",
    notesEn: "Emphasizes two positive additive conditions."
  },
  {
    id: "conn-entweder-oder",
    name: "entweder ... oder",
    group: "zweiteilig",
    groupTitleTr: "İkili Bağlaçlar (Zweiteilig)",
    groupTitleEn: "Two-Part Connectors",
    formula: "Entweder [X] oder [Y]",
    meaningTr: "ya ... ya da",
    meaningEn: "either ... or",
    example: "Du musst dich entscheiden: Entweder du kommst mit oder du bleibst hier.",
    level: "A2-B1",
    notesTr: "Alternatif seçim sunar.",
    notesEn: "Presents alternative choices."
  },
  {
    id: "conn-sowohl-als-auch",
    name: "sowohl ... als auch",
    group: "zweiteilig",
    groupTitleTr: "İkili Bağlaçlar (Zweiteilig)",
    groupTitleEn: "Two-Part Connectors",
    formula: "sowohl [X] als auch [Y]",
    meaningTr: "hem ... hem de",
    meaningEn: "both ... and",
    example: "Sie mag sowohl das Theater als auch klassische Konzerte.",
    level: "B1",
    notesTr: "İki öğeyi eşdeğer kabul ederek bağlar.",
    notesEn: "Connects two elements equally."
  },
  {
    id: "conn-zwar-aber",
    name: "zwar ... aber",
    group: "zweiteilig",
    groupTitleTr: "İkili Bağlaçlar (Zweiteilig)",
    groupTitleEn: "Two-Part Connectors",
    formula: "zwar [X], aber [Y]",
    meaningTr: "gerçi ... ama",
    meaningEn: "indeed ... but",
    example: "Die Wohnung ist zwar relativ klein, aber sehr gemütlich.",
    level: "B1",
    notesTr: "İlk kısımdaki sınırlamayı ikinci kısımdaki olumlulukla dengeler.",
    notesEn: "Balances concession in part 1 with a contrast in part 2."
  }
];

connectorsList.push(...predefinedConnectors);

// Add connectors to graph
for (const conn of predefinedConnectors) {
  addGraphNode({
    id: conn.id,
    label: conn.name,
    type: "connector",
    category: conn.groupTitleTr,
    level: conn.level,
    meaningTr: conn.meaningTr,
    meaningEn: conn.meaningEn,
    formula: conn.formula,
    example: conn.example
  });
}

// 4. Parse raw files from /data/raw
if (fs.existsSync(RAW_DIR)) {
  const rawFiles = fs.readdirSync(RAW_DIR);
  for (const file of rawFiles) {
    const rawPath = path.join(RAW_DIR, file);
    const stat = fs.statSync(rawPath);
    if (stat.isFile() && (file.endsWith(".txt") || file.endsWith(".md"))) {
      const text = fs.readFileSync(rawPath, "utf-8");
      // Extract nouns: "- die Bewerbung, -en (başvuru / application)"
      const nounRegex = /^-\s+(der|die|das)\s+([A-ZÄÖÜ][a-zäöüßA-Z-]+)(?:,\s*([^(\n]+))?\s*\(([^/)]+)\s*\/\s*([^)]+)\)/gm;
      let match;
      while ((match = nounRegex.exec(text)) !== null) {
        const article = match[1].toLowerCase();
        const word = match[2];
        const pluralEnding = (match[3] || "").trim();
        const meaningTr = match[4].trim();
        const meaningEn = match[5].trim();
        const id = `noun-${word.toLowerCase()}`;

        vocabularyList.push({
          id,
          german: word,
          article,
          plural: pluralEnding ? `${word}${pluralEnding}` : undefined,
          type: "substantiv",
          meaningTr,
          meaningEn,
          level: "B1"
        });

        addGraphNode({
          id,
          label: `${article} ${word}`,
          type: "noun",
          article,
          meaningTr,
          meaningEn
        });
      }

      // Extract verbs: "- vorbereiten auf + Akk (bir şeye hazırlanmak / to prepare for): Er bereitet sich auf..."
      const verbRegex = /^-\s+([a-zäöüßA-Z\s]+?)\s+(?:auf|an|für|um|mit|von|zu|nach)?\s*(?:\+\s*(Akk|Dat))?\s*\(([^/)]+)\s*\/\s*([^)]+)\)(?::\s*([^\n]+))?/gm;
      while ((match = verbRegex.exec(text)) !== null) {
        const verbName = match[1].trim();
        if (verbName.length < 3) continue;
        const governedCase = match[2] || undefined;
        const meaningTr = match[3].trim();
        const meaningEn = match[4].trim();
        const example = (match[5] || "").trim();
        const id = `verb-${verbName.toLowerCase().replace(/\s+/g, "-")}`;

        if (!vocabularyList.some(v => v.id === id)) {
          vocabularyList.push({
            id,
            german: verbName,
            type: "verb",
            governedCase,
            meaningTr,
            meaningEn,
            example,
            level: "B1"
          });

          addGraphNode({
            id,
            label: verbName,
            type: "verb",
            meaningTr,
            meaningEn,
            example
          });
        }
      }
    }
  }
}

// 5. Add Root Derivation links in graph
const rootDerivations = [
  { root: "verb-warten", derivatives: ["verb-erwarten", "verb-abwarten"], meanings: ["ummak, beklemek / to expect", "bekleyip görmek / to wait and see"] },
  { root: "verb-sprechen", derivatives: ["verb-besprechen", "verb-versprechen"], meanings: ["müzakere etmek / to discuss", "söz vermek / to promise"] },
  { root: "verb-denken", derivatives: ["verb-nachdenken", "verb-ausdenken"], meanings: ["üzerinde düşünmek / to reflect", "uydurmak / to invent"] }
];

for (const group of rootDerivations) {
  if (nodeMap.has(group.root)) {
    group.derivatives.forEach((dId, idx) => {
      const cleanName = dId.replace("verb-", "");
      addGraphNode({
        id: dId,
        label: cleanName,
        type: "verb",
        level: "B1",
        meaningTr: group.meanings[idx].split("/")[0].trim(),
        meaningEn: group.meanings[idx].split("/")[1]?.trim() || "",
        category: "Stammverb-Ableitung"
      });
      addGraphEdge({
        source: group.root,
        target: dId,
        relation: "root_derivation",
        label: "Kök türevi"
      });
    });
  }
}

// 6. Read exercises
let exercises = [];
if (fs.existsSync(EXERCISES_FILE)) {
  exercises = JSON.parse(fs.readFileSync(EXERCISES_FILE, "utf-8"));
}

// 7. Compile Database
const database = {
  metadata: {
    lastSynced: new Date().toISOString(),
    totalVocabulary: vocabularyList.length,
    totalConnectors: connectorsList.length,
    totalNotes: textNotes.length,
    totalGraphNodes: graphNodes.length,
    totalGraphEdges: graphEdges.length,
    totalExercises: exercises.length
  },
  vocabulary: vocabularyList,
  connectors: connectorsList,
  notes: textNotes,
  exercises,
  graph: {
    nodes: graphNodes,
    edges: graphEdges
  }
};

// Write output
const outPath1 = path.join(GENERATED_DIR, "db.json");
const outPath2 = path.join(PUBLIC_DATA_DIR, "db.json");

fs.writeFileSync(outPath1, JSON.stringify(database, null, 2), "utf-8");
fs.writeFileSync(outPath2, JSON.stringify(database, null, 2), "utf-8");

console.log(`✅ Data synced successfully!`);
console.log(`   - Vocabulary: ${vocabularyList.length} items`);
console.log(`   - Connectors: ${connectorsList.length} items`);
console.log(`   - Notes: ${textNotes.length} documents`);
console.log(`   - Graph: ${graphNodes.length} nodes, ${graphEdges.length} edges`);
console.log(`   - Exercises: ${exercises.length} interactive exercises`);
console.log(`   -> Written to ${outPath1} and ${outPath2}`);

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
    Object.assign(nodeMap.get(node.id), node);
  }
}

function addGraphEdge(edge) {
  const edgeId = `${edge.source}->${edge.target}:${edge.relation}`;
  if (!graphEdges.some(e => e.id === edgeId)) {
    graphEdges.push({ id: edgeId, ...edge });
  }
}

// 1. Parse Markdown Notes
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

    const lines = markdownBody.split("\n");
    for (const line of lines) {
      if (line.startsWith("|") && !line.includes("---")) {
        const parts = line.split("|").map(s => s.trim()).filter(Boolean);
        const headerTest = parts.join(" ").toLowerCase();
        if (headerTest.includes("modalverb |") || headerTest.includes("verb |") || headerTest.includes("substantiv |") || headerTest.includes("wort |")) {
          continue;
        }

        // Format 1: Verb + Präposition table: | Verb | Präposition | Kasus | Bedeutung (TR) | Meaning (EN) | Beispielsatz |
        if (parts.length >= 6 && (parts[2].toLowerCase().includes("akk") || parts[2].toLowerCase().includes("dat"))) {
          const [verb, prep, kasus, meaningTr, meaningEn, example] = parts;
          const verbClean = verb.replace(/`/g, "");
          const verbId = `verb-${verbClean.toLowerCase().replace(/\s+/g, "-")}`;

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
        }

        // Format 2: Substantiv table: | Substantiv | Plural | Bedeutung (EN) | Anlam (TR) | Beispielsatz |
        else if (parts.length >= 5 && (parts[0].startsWith("der ") || parts[0].startsWith("die ") || parts[0].startsWith("das "))) {
          const [nounWithArt, plural, meaningEn, meaningTr, example] = parts;
          const artMatch = nounWithArt.match(/^(der|die|das)\s+(.+)$/i);
          if (artMatch) {
            const article = artMatch[1].toLowerCase();
            const word = artMatch[2].trim();
            const id = `noun-${word.toLowerCase().replace(/\s+/g, "-")}`;

            vocabularyList.push({
              id,
              german: word,
              article,
              plural: plural.replace(/^die\s+/i, ""),
              type: "substantiv",
              meaningTr,
              meaningEn,
              example,
              level: frontmatter.level || "B1"
            });
          }
        }

        // Format 3: Wort / Nuancen: | Wort | Wortart | Bedeutung (EN) | Anlam (TR) | Kontext |
        else if (parts.length >= 5 && (parts[1].toLowerCase().includes("verb") || parts[1].toLowerCase().includes("substantiv") || parts[1].toLowerCase().includes("adjektiv"))) {
          const [word, pos, meaningEn, meaningTr, context] = parts;
          let article = undefined;
          let cleanWord = word;
          if (word.startsWith("der ") || word.startsWith("die ") || word.startsWith("das ")) {
            article = word.slice(0, 3).toLowerCase();
            cleanWord = word.slice(4).trim();
          }
          const id = `word-${cleanWord.toLowerCase().replace(/\s+/g, "-")}`;
          if (!vocabularyList.some(v => v.id === id)) {
            vocabularyList.push({
              id,
              german: cleanWord,
              article,
              type: pos.toLowerCase().includes("verb") ? "verb" : pos.toLowerCase().includes("substantiv") ? "substantiv" : "adjektiv",
              meaningTr,
              meaningEn,
              example: context,
              level: frontmatter.level || "B1"
            });
          }
        }
      }
    }
  }
}

// 2. Add Predefined Rich Connectors
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
  {
    id: "conn-da",
    name: "da",
    group: "nebensatz",
    groupTitleTr: "Nebensatz (Fiil Sonda)",
    groupTitleEn: "Subordinate (Verb at End)",
    formula: "Da + Subjekt + ... + Verb, [Verb + Subjekt...]",
    meaningTr: "mademki, -dığı için",
    meaningEn: "since, as, because",
    example: "Da er krank ist, kann er heute leider nicht zur Arbeit kommen.",
    level: "B1",
    notesTr: "Sebep önceden biliniyorsa cümle genellikle 'da' ile başlar. Fiil sonda.",
    notesEn: "Often starts sentence when cause is already known. Verb at end."
  },
  {
    id: "conn-waehrend",
    name: "während",
    group: "nebensatz",
    groupTitleTr: "Nebensatz (Fiil Sonda)",
    groupTitleEn: "Subordinate (Verb at End)",
    formula: "..., während + Subjekt + ... + VERB (Ende)",
    meaningTr: "-iken, esnasında",
    meaningEn: "while, whereas",
    example: "Während sie kocht, hört sie einen deutschen Podcast.",
    level: "B1",
    notesTr: "Eşzamanlılık bildirir. Fiil cümlenin en sonundadır.",
    notesEn: "Expresses simultaneous actions. Verb at end."
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
  {
    id: "conn-danach",
    name: "danach",
    group: "position_1",
    groupTitleTr: "Pozisyon 1 (Fiil Hemen Sonra)",
    groupTitleEn: "Position 1 (Verb Immediately Next)",
    formula: "Hauptsatz. Danach + VERB + Subjekt + ...",
    meaningTr: "ondan sonra, ardından",
    meaningEn: "afterwards, then",
    example: "Wir aßen gemütlich zu Abend, danach gingen wir im Park spazieren.",
    level: "A2",
    notesTr: "Zaman sırası bildirir. Pozisyon 1.",
    notesEn: "Chronological sequence. Position 1."
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

// 3. Add Rich High-Frequency German Vocabulary (A1-B2)
const extraCuratedVocab = [
  // High value words & idioms
  { id: "cur-1", german: "Feierabend", article: "der", plural: "Feierabende", type: "substantiv", meaningEn: "end of the working day", meaningTr: "iş çıkışı / mesai bitimi", level: "A2", example: "Schönen Feierabend! Bis morgen im Büro." },
  { id: "cur-2", german: "Sehnsucht", article: "die", plural: "Sehnsüchte", type: "substantiv", meaningEn: "deep longing / yearning", meaningTr: "hasret, derin özlem", level: "B1", example: "Sie hat große Sehnsucht nach ihrer Heimatstadt." },
  { id: "cur-3", german: "Fernweh", article: "das", type: "substantiv", meaningEn: "wanderlust / craving for travel", meaningTr: "uzak diyarlara gitme arzusu", level: "B1", example: "Im grauen Winter bekomme ich oft starkes Fernweh." },
  { id: "cur-4", german: "Gemütlichkeit", article: "die", type: "substantiv", meaningEn: "coziness, snugness", meaningTr: "rahatlık, sıcacık samimi ortam", level: "B1", example: "Wir schätzen die Gemütlichkeit unseres Wohnzimmers." },
  { id: "cur-5", german: "Verabredung", article: "die", plural: "Verabredungen", type: "substantiv", meaningEn: "appointment / date with friends", meaningTr: "arkadaşla buluşma / randevu", level: "A2", example: "Ich habe heute Abend eine Verabredung mit Freunden." },
  { id: "cur-6", german: "Aufenthaltserlaubnis", article: "die", plural: "Aufenthaltserlaubnisse", type: "substantiv", meaningEn: "residence permit", meaningTr: "oturum izni", level: "B1", example: "Die Aufenthaltserlaubnis muss rechtzeitig verlängert werden." },
  { id: "cur-7", german: "Labyrinth", article: "das", plural: "Labyrinthe", type: "substantiv", meaningEn: "maze / labyrinth", meaningTr: "labirent", level: "B1", example: "Die deutsche Bürokratie schien am Anfang wie ein Labyrinth." },
  { id: "cur-8", german: "Herausforderung", article: "die", plural: "Herausforderungen", type: "substantiv", meaningEn: "challenge", meaningTr: "meydan okuma, zorluk", level: "B1", example: "Eine neue Sprache zu lernen ist eine spannende Herausforderung." },
  { id: "cur-9", german: "Beständigkeit", article: "die", type: "substantiv", meaningEn: "consistency, persistence", meaningTr: "istikrar, kararlılık", level: "B1", example: "Erfolg beim Deutschlernen braucht tägliche Beständigkeit." },
  { id: "cur-10", german: "Unterschied", article: "der", plural: "Unterschiede", type: "substantiv", meaningEn: "difference", meaningTr: "fark, ayrım", level: "A2", example: "Was ist der Unterschied zwischen diesen beiden Wörtern?" },
  { id: "cur-11", german: "Überraschung", article: "die", plural: "Überraschungen", type: "substantiv", meaningEn: "surprise", meaningTr: "sürpriz", level: "A2", example: "Die Feier war eine gelungene Überraschung für ihn." },
  { id: "cur-12", german: "Bedingung", article: "die", plural: "Bedingungen", type: "substantiv", meaningEn: "condition, term", meaningTr: "şart, koşul", level: "B1", example: "Unter dieser Bedingung kann ich den Vertrag unterschreiben." },
  { id: "cur-13", german: "Lärm", article: "der", type: "substantiv", meaningEn: "noise, clamor", meaningTr: "gürültü", level: "A2", example: "Der nächtliche Lärm der Großstadt stört meinen Schlaf." },
  { id: "cur-14", german: "Erfahrung", article: "die", plural: "Erfahrungen", type: "substantiv", meaningEn: "experience", meaningTr: "deneyim, tecrübe", level: "B1", example: "Er hat bereits mehrjährige Erfahrung im Ingenieurwesen." },
  { id: "cur-15", german: "Vorstellungsgespräch", article: "das", plural: "Vorstellungsgespräche", type: "substantiv", meaningEn: "job interview", meaningTr: "iş mülakatı", level: "B1", example: "Morgen um 10 Uhr habe ich ein wichtiges Vorstellungsgespräch." },

  // Verbs with Prepositions (additional)
  { id: "cur-v1", german: "achten auf", preposition: "auf", governedCase: "Akk", type: "verb", meaningEn: "to pay attention to", meaningTr: "dikkat etmek", level: "B1", example: "Bitte achten Sie auf die Durchsagen am Bahnsteig." },
  { id: "cur-v2", german: "ankommen auf", preposition: "auf", governedCase: "Akk", type: "verb", meaningEn: "to depend on", meaningTr: "bağlı olmak", level: "B1", example: "Es kommt auf das Wetter am Wochenende an." },
  { id: "cur-v3", german: "bitten um", preposition: "um", governedCase: "Akk", type: "verb", meaningEn: "to ask for", meaningTr: "rica etmek, dilemek", level: "A2", example: "Darf ich Sie um einen kurzen Gefallen bitten?" },
  { id: "cur-v4", german: "zweifeln an", preposition: "an", governedCase: "Dat", type: "verb", meaningEn: "to doubt", meaningTr: "şüphe duymak", level: "B1", example: "Ich zweifle nicht an deinen Fähigkeiten." },
  { id: "cur-v5", german: "leiden an", preposition: "an", governedCase: "Dat", type: "verb", meaningEn: "to suffer from (disease)", meaningTr: "muzdarip olmak (hastalık)", level: "B1", example: "Viele Menschen leiden an saisonalen Allergien." },
  { id: "cur-v6", german: "passen zu", preposition: "zu", governedCase: "Dat", type: "verb", meaningEn: "to match / go well with", meaningTr: "yakışmak, uymak", level: "A2", example: "Das blaue Hemd passt perfekt zu deiner Hose." },
  { id: "cur-v7", german: "verzichten auf", preposition: "auf", governedCase: "Akk", type: "verb", meaningEn: "to do without / forfeit", meaningTr: "feragat etmek, vazgeçmek", level: "B1", example: "Er kann morgens nicht auf seinen Kaffee verzichten." },
  { id: "cur-v8", german: "sich gewöhnen an", preposition: "an", governedCase: "Akk", type: "verb", meaningEn: "to get used to", meaningTr: "alışmak", level: "B1", example: "Ich habe mich schnell an das kalte Wetter gewöhnt." },

  // Modal Verbs as study cards
  { id: "cur-m1", german: "müssen", type: "verb", meaningEn: "must / to have to", meaningTr: "zorunda olmak", level: "A1", example: "Ich muss heute pünktlich im Büro sein." },
  { id: "cur-m2", german: "können", type: "verb", meaningEn: "can / to be able to", meaningTr: "-ebilmek, yeteneği olmak", level: "A1", example: "Er kann fließend Deutsch und Englisch sprechen." },
  { id: "cur-m3", german: "dürfen", type: "verb", meaningEn: "may / to be allowed to", meaningTr: "izni olmak", level: "A1", example: "Hier darf man leider nicht parken." },
  { id: "cur-m4", german: "wollen", type: "verb", meaningEn: "to want to", meaningTr: "istemek, niyeti olmak", level: "A1", example: "Wir wollen im Sommer ans Meer fahren." },
  { id: "cur-m5", german: "sollen", type: "verb", meaningEn: "should / to be supposed to", meaningTr: "-meli, tavsiye edilmek", level: "A2", example: "Du sollst täglich mindestens zwei Liter Wasser trinken." },
  { id: "cur-m6", german: "möchten", type: "verb", meaningEn: "would like to", meaningTr: "istemek (kibarca)", level: "A1", example: "Ich möchte bitte einen schwarzen Kaffee ohne Zucker." }
];

for (const item of extraCuratedVocab) {
  if (!vocabularyList.some(v => v.id === item.id || v.german.toLowerCase() === item.german.toLowerCase())) {
    vocabularyList.push(item);
  }
}

// 4. Read Exercises
let exercises = [];
if (fs.existsSync(EXERCISES_FILE)) {
  exercises = JSON.parse(fs.readFileSync(EXERCISES_FILE, "utf-8"));
}

// Add extra modalverb and zeitangaben exercises
const extraExercises = [
  {
    id: "ex-modal-1",
    type: "cloze",
    category: "Modalverben",
    level: "A2",
    promptTr: "Cümleye uygun modal fiili seçin.",
    promptEn: "Choose the correct modal verb for this context.",
    sentenceParts: ["Der Arzt sagt, ich ", " mich schonen und keinen Sport machen."],
    options: ["soll", "will", "darf", "mag"],
    correctAnswer: "soll",
    explanationTr: "Doktorun veya bir başkasının tavsiyesi aktarılırken 'sollen' (ich soll) kullanılır.",
    explanationEn: "When conveying medical advice or recommendation from someone else, 'sollen' (ich soll) is used."
  },
  {
    id: "ex-modal-2",
    type: "sentence_builder",
    category: "Modalverb Satzstellung",
    level: "A2",
    promptTr: "Kelimeleri doğru modal fiil kuralına (Modalverb Pos 2, Infinitiv am Ende) göre dizin.",
    promptEn: "Arrange words according to modal verb syntax (Modalverb Pos 2, Infinitive at the end).",
    words: ["Ich", "muss", "am", "Montag", "früh", "aufstehen"],
    correctOrder: ["Ich", "muss", "am", "Montag", "früh", "aufstehen"],
    targetMeaningTr: "Pazartesi günü erken kalkmak zorundayım.",
    targetMeaningEn: "I have to get up early on Monday.",
    explanationTr: "Kural: Çekimli modal fiil 2. pozisyondadır ('muss'), asıl fiil ise yalın halde (Infinitiv) cümlenin en sonuna gider ('aufstehen').",
    explanationEn: "Rule: Conjugated modal verb is in position 2 ('muss'), while main verb in infinitive is placed at the very end ('aufstehen')."
  },
  {
    id: "ex-time-1",
    type: "cloze",
    category: "Zeitangaben (im / am / um)",
    level: "A1-A2",
    promptTr: "Doğru zaman edatını seçin.",
    promptEn: "Select the correct temporal preposition.",
    sentenceParts: ["Wir treffen uns ", " Dienstag um 15 Uhr."],
    options: ["am", "im", "um", "in"],
    correctAnswer: "am",
    explanationTr: "Haftanın günleri için 'am' (an + dem) kullanılır: am Dienstag, am Montag...",
    explanationEn: "For days of the week, 'am' (an + dem) is used: am Dienstag, am Montag..."
  },
  {
    id: "ex-time-2",
    type: "cloze",
    category: "Zeitangaben (im / am / um)",
    level: "A1-A2",
    promptTr: "Mevsimler ve aylar için doğru edatı seçin.",
    promptEn: "Select the correct preposition for seasons and months.",
    sentenceParts: ["Ich habe ", " Juli zwei Wochen Urlaub."],
    options: ["im", "am", "um", "an"],
    correctAnswer: "im",
    explanationTr: "Aylar ve mevsimler için 'im' (in + dem) kullanılır: im Juli, im Sommer...",
    explanationEn: "For months and seasons, 'im' (in + dem) is used: im Juli, im Sommer..."
  }
];

for (const ex of extraExercises) {
  if (!exercises.some(e => e.id === ex.id)) {
    exercises.push(ex);
  }
}

// 5. Compile Database
const database = {
  metadata: {
    lastSynced: new Date().toISOString(),
    totalVocabulary: vocabularyList.length,
    totalConnectors: connectorsList.length,
    totalNotes: textNotes.length,
    totalExercises: exercises.length
  },
  vocabulary: vocabularyList,
  connectors: connectorsList,
  notes: textNotes,
  exercises
};

const outPath1 = path.join(GENERATED_DIR, "db.json");
const outPath2 = path.join(PUBLIC_DATA_DIR, "db.json");

fs.writeFileSync(outPath1, JSON.stringify(database, null, 2), "utf-8");
fs.writeFileSync(outPath2, JSON.stringify(database, null, 2), "utf-8");

console.log(`✅ Data synced successfully!`);
console.log(`   - Vocabulary: ${vocabularyList.length} items`);
console.log(`   - Connectors: ${connectorsList.length} items`);
console.log(`   - Notes: ${textNotes.length} documents`);
console.log(`   - Exercises: ${exercises.length} interactive exercises`);
console.log(`   -> Written to ${outPath1} and ${outPath2}`);

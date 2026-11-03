"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { GraphNode, GraphEdge } from "@/types";
import { useLanguage } from "@/lib/language-context";
import { 
  Search, 
  ZoomIn, 
  ZoomOut, 
  Maximize2, 
  Filter, 
  X, 
  ExternalLink,
  BookOpen,
  ArrowRight
} from "lucide-react";

interface KnowledgeGraphProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
  onSelectWord?: (word: string) => void;
}

export function KnowledgeGraph({ nodes, edges, onSelectWord }: KnowledgeGraphProps) {
  const { lang, t } = useLanguage();
  const [search, setSearch] = useState("");
  const [selectedFilter, setSelectedFilter] = useState<string>("all");
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);

  // Canvas zoom & pan state
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  // Compute graph layout coordinates deterministically
  const positionedNodes = useMemo(() => {
    // Group nodes by category / type
    const width = 1200;
    const height = 800;
    const centerX = width / 2;
    const centerY = height / 2;

    const caseNodes = nodes.filter((n) => n.type === "case");
    const prepNodes = nodes.filter((n) => n.type === "preposition");
    const verbNodes = nodes.filter((n) => n.type === "verb");
    const connNodes = nodes.filter((n) => n.type === "connector");
    const nounNodes = nodes.filter((n) => n.type === "noun");

    const map = new Map<string, { x: number; y: number }>();

    // Central core: Cases (Akkusativ left-center, Dativ right-center)
    caseNodes.forEach((node, idx) => {
      const angle = (idx / Math.max(1, caseNodes.length)) * Math.PI * 2;
      map.set(node.id, {
        x: centerX + Math.cos(angle) * 120,
        y: centerY + Math.sin(angle) * 100
      });
    });

    // Inner ring: Prepositions
    prepNodes.forEach((node, idx) => {
      const angle = (idx / Math.max(1, prepNodes.length)) * Math.PI * 2;
      const radius = 260 + (idx % 2 === 0 ? 30 : -30);
      map.set(node.id, {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius
      });
    });

    // Middle ring: Verbs (clustered near prepositions or roots)
    verbNodes.forEach((node, idx) => {
      const angle = (idx / Math.max(1, verbNodes.length)) * Math.PI * 2;
      const radius = 420 + (idx % 3) * 35;
      map.set(node.id, {
        x: centerX + Math.cos(angle) * radius,
        y: centerY + Math.sin(angle) * radius
      });
    });

    // Outer cluster: Connectors (top / bottom zones)
    connNodes.forEach((node, idx) => {
      const col = idx % 5;
      const row = Math.floor(idx / 5);
      map.set(node.id, {
        x: 100 + col * 240,
        y: row === 0 ? 80 : height - 80 - (row - 1) * 70
      });
    });

    // Nouns cluster
    nounNodes.forEach((node, idx) => {
      const angle = ((idx + 2) / Math.max(1, nounNodes.length)) * Math.PI * 2;
      map.set(node.id, {
        x: centerX + Math.cos(angle) * 520,
        y: centerY + Math.sin(angle) * 320
      });
    });

    return nodes.map((node) => {
      const coords = map.get(node.id) || { x: centerX, y: centerY };
      return {
        ...node,
        x: coords.x,
        y: coords.y
      };
    });
  }, [nodes]);

  // Filter nodes according to search & filter
  const filteredNodes = useMemo(() => {
    return positionedNodes.filter((node) => {
      const matchesSearch =
        search === "" ||
        node.label.toLowerCase().includes(search.toLowerCase()) ||
        (node.meaningTr && node.meaningTr.toLowerCase().includes(search.toLowerCase())) ||
        (node.meaningEn && node.meaningEn.toLowerCase().includes(search.toLowerCase()));

      if (!matchesSearch) return false;

      if (selectedFilter === "all") return true;
      if (selectedFilter === "verbs") return node.type === "verb";
      if (selectedFilter === "preps") return node.type === "preposition" || node.type === "case";
      if (selectedFilter === "connectors") return node.type === "connector";
      return true;
    });
  }, [positionedNodes, search, selectedFilter]);

  const activeNodeIds = useMemo(() => new Set(filteredNodes.map((n) => n.id)), [filteredNodes]);

  const visibleEdges = useMemo(() => {
    return edges.filter(
      (edge) => activeNodeIds.has(edge.source) && activeNodeIds.has(edge.target)
    );
  }, [edges, activeNodeIds]);

  // Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    dragStart.current = { x: e.clientX - pan.x, y: e.clientY - pan.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setPan({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  // Touch handlers for mobile
  const touchStart = useRef({ x: 0, y: 0 });
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      touchStart.current = {
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y
      };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setPan({
        x: e.touches[0].clientX - touchStart.current.x,
        y: e.touches[0].clientY - touchStart.current.y
      });
    }
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  // Connected nodes for the inspector drawer
  const connectedDetails = useMemo(() => {
    if (!selectedNode) return [];
    const directEdgeTargets = edges
      .filter((e) => e.source === selectedNode.id)
      .map((e) => ({ targetId: e.target, relation: e.relation, label: e.label }));
    const directEdgeSources = edges
      .filter((e) => e.target === selectedNode.id)
      .map((e) => ({ targetId: e.source, relation: e.relation, label: e.label }));

    const all = [...directEdgeTargets, ...directEdgeSources];
    return all.map((item) => {
      const node = positionedNodes.find((n) => n.id === item.targetId);
      return { node, ...item };
    }).filter((item) => item.node !== undefined);
  }, [selectedNode, edges, positionedNodes]);

  return (
    <div className="relative w-full h-[calc(100vh-130px)] flex flex-col bg-[#FDFCFA] dark:bg-[#111110] border border-[#E7E4DD] dark:border-[#22211E] overflow-hidden select-none">
      
      {/* Control Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3 bg-white/90 dark:bg-[#181816]/90 border-b border-[#E7E4DD] dark:border-[#22211E] backdrop-blur-sm z-10">
        
        {/* Search */}
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("Fiil, edat veya bağlaç ara...", "Search verb, preposition or connector...")}
            className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FAF9F5] dark:bg-[#20201D] border border-[#DDD8CE] dark:border-[#33322D] focus:border-neutral-900 dark:focus:border-neutral-100 outline-none text-neutral-900 dark:text-neutral-100 placeholder:text-neutral-400 font-mono"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-700"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1 overflow-x-auto text-xs font-mono">
          {[
            { id: "all", labelTr: "Tümü", labelEn: "All" },
            { id: "verbs", labelTr: "Fiiller & Kalıplar", labelEn: "Verbs & Patterns" },
            { id: "preps", labelTr: "Edatlar & İsim Halleri", labelEn: "Prepositions & Cases" },
            { id: "connectors", labelTr: "Bağlaçlar", labelEn: "Connectors" }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setSelectedFilter(f.id)}
              className={`px-2.5 py-1 border transition-colors whitespace-nowrap ${
                selectedFilter === f.id
                  ? "bg-neutral-900 text-white dark:bg-neutral-100 dark:text-neutral-900 border-neutral-900 dark:border-neutral-100 font-medium"
                  : "bg-white dark:bg-[#1A1A18] text-neutral-600 dark:text-neutral-400 border-[#DDD8CE] dark:border-[#33322D] hover:border-neutral-400"
              }`}
            >
              {lang === "tr" ? f.labelTr : f.labelEn}
            </button>
          ))}
        </div>

        {/* Zoom & View Controls */}
        <div className="flex items-center gap-1 border border-[#DDD8CE] dark:border-[#33322D] bg-white dark:bg-[#1A1A18] p-0.5">
          <button
            onClick={() => setZoom((z) => Math.min(2.5, z + 0.15))}
            className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
            title={t("Yakınlaştır", "Zoom In")}
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoom((z) => Math.max(0.4, z - 0.15))}
            className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
            title={t("Uzaklaştır", "Zoom Out")}
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={resetView}
            className="p-1 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
            title={t("Görünümü Sıfırla", "Reset View")}
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* SVG Canvas */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        className="flex-1 w-full h-full cursor-grab active:cursor-grabbing overflow-hidden relative"
      >
        <svg
          className="w-full h-full"
          viewBox="0 0 1200 800"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: "center center",
            transition: isDragging ? "none" : "transform 0.15s ease-out"
          }}
        >
          <defs>
            {/* Grid Pattern */}
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-[#EFECE6] dark:text-[#1B1B18]"
              />
            </pattern>
            {/* Arrow Marker */}
            <marker
              id="arrow"
              viewBox="0 0 10 10"
              refX="18"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 8 5 L 0 9 z" fill="#A8A29E" />
            </marker>
          </defs>

          {/* Background grid */}
          <rect width="2000" height="2000" x="-400" y="-400" fill="url(#grid)" />

          {/* Edges */}
          <g className="edges">
            {visibleEdges.map((edge) => {
              const src = positionedNodes.find((n) => n.id === edge.source);
              const tgt = positionedNodes.find((n) => n.id === edge.target);
              if (!src || !tgt) return null;

              const isHighlighted =
                selectedNode && (selectedNode.id === src.id || selectedNode.id === tgt.id);

              return (
                <g key={edge.id}>
                  <line
                    x1={src.x}
                    y1={src.y}
                    x2={tgt.x}
                    y2={tgt.y}
                    stroke={isHighlighted ? "#2563EB" : "#D4CEC3"}
                    strokeWidth={isHighlighted ? 2.5 : 1.2}
                    strokeDasharray={edge.relation === "root_derivation" ? "4 4" : "none"}
                    markerEnd="url(#arrow)"
                    className="dark:stroke-[#3A3833] transition-colors"
                  />
                  {edge.label && (
                    <text
                      x={(src.x + tgt.x) / 2}
                      y={(src.y + tgt.y) / 2 - 4}
                      fill="#78716C"
                      fontSize="9"
                      textAnchor="middle"
                      fontFamily="monospace"
                      className="select-none bg-white pointer-events-none"
                    >
                      {edge.label}
                    </text>
                  )}
                </g>
              );
            })}
          </g>

          {/* Nodes */}
          <g className="nodes">
            {filteredNodes.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              
              // Determine node style based on type
              let bg = "#FFFFFF";
              let stroke = "#292524";
              let textFill = "#1C1917";
              let radius = 22;

              if (node.type === "case") {
                bg = "#EFF6FF";
                stroke = "#2563EB";
                textFill = "#1E40AF";
                radius = 28;
              } else if (node.type === "preposition") {
                bg = "#FEF3C7";
                stroke = "#D97706";
                textFill = "#92400E";
                radius = 20;
              } else if (node.type === "connector") {
                bg = "#F5F3FF";
                stroke = "#7C3AED";
                textFill = "#5B21B6";
                radius = 24;
              }

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedNode(node);
                  }}
                  className="cursor-pointer group"
                >
                  {/* Subtle selection ring */}
                  {isSelected && (
                    <circle
                      r={radius + 8}
                      fill="none"
                      stroke="#2563EB"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                  )}

                  {/* Main Node Body */}
                  {node.type === "connector" ? (
                    <rect
                      x={-radius * 1.5}
                      y={-radius * 0.8}
                      width={radius * 3}
                      height={radius * 1.6}
                      rx="4"
                      fill={bg}
                      stroke={stroke}
                      strokeWidth={isSelected ? 2.5 : 1.2}
                      className="transition-all duration-150 drop-shadow-sm group-hover:scale-105"
                    />
                  ) : (
                    <circle
                      r={radius}
                      fill={bg}
                      stroke={stroke}
                      strokeWidth={isSelected ? 2.5 : 1.2}
                      className="transition-all duration-150 drop-shadow-sm group-hover:scale-105"
                    />
                  )}

                  {/* Label */}
                  <text
                    y={node.type === "connector" ? 4 : 4}
                    textAnchor="middle"
                    fill={textFill}
                    fontSize={node.type === "case" ? "10" : "11"}
                    fontWeight={isSelected ? "bold" : "600"}
                    fontFamily="sans-serif"
                    className="select-none pointer-events-none tracking-tight"
                  >
                    {node.label.length > 18 ? node.label.slice(0, 16) + "…" : node.label}
                  </text>

                  {/* Mini tag or case indicator */}
                  {node.kasus && (
                    <text
                      y={radius + 12}
                      textAnchor="middle"
                      fill="#78716C"
                      fontSize="9"
                      fontFamily="monospace"
                      className="pointer-events-none"
                    >
                      +{node.prep} ({node.kasus})
                    </text>
                  )}
                </g>
              );
            })}
          </g>
        </svg>

        {/* Minimalist Legend Overlay */}
        <div className="absolute bottom-3 left-3 bg-white/95 dark:bg-[#181816]/95 border border-[#DDD8CE] dark:border-[#33322D] p-2.5 text-[11px] font-mono flex flex-col gap-1.5 shadow-sm">
          <div className="font-semibold uppercase tracking-wider text-[10px] text-neutral-500 mb-0.5">
            {t("Lejant (Legend)", "Legend")}
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full border border-blue-600 bg-blue-50" />
            <span className="text-neutral-700 dark:text-neutral-300">{t("Kasus (İsmin Hali)", "Case (Akk/Dat)")}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full border border-amber-600 bg-amber-50" />
            <span className="text-neutral-700 dark:text-neutral-300">{t("Präposition (Edat)", "Preposition")}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full border border-neutral-900 bg-white" />
            <span className="text-neutral-700 dark:text-neutral-300">{t("Verb (Fiil Kalıbı)", "Verb & Pattern")}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 border border-purple-600 bg-purple-50" />
            <span className="text-neutral-700 dark:text-neutral-300">{t("Konnektor (Bağlaç)", "Connector")}</span>
          </div>
        </div>
      </div>

      {/* Slide-out Node Inspector (Dieter Rams Clean Card) */}
      {selectedNode && (
        <div className="absolute top-0 right-0 w-full sm:w-96 h-full bg-[#FAF9F5] dark:bg-[#181816] border-l border-[#E2DDD3] dark:border-[#2A2926] shadow-xl z-20 flex flex-col p-6 overflow-y-auto animate-in slide-in-from-right duration-200">
          <div className="flex items-start justify-between pb-4 border-b border-[#E7E4DD] dark:border-[#2B2A26]">
            <div>
              <span className="inline-block px-2 py-0.5 text-[10px] font-mono uppercase tracking-widest bg-neutral-200 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 mb-1">
                {selectedNode.type} {selectedNode.level && `• ${selectedNode.level}`}
              </span>
              <h2 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50 font-sans">
                {selectedNode.label}
              </h2>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="p-1 text-neutral-400 hover:text-neutral-900 dark:hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="py-4 space-y-5 flex-1">
            {/* Meaning in Turkish & English */}
            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1">
                {t("Anlamı", "Meaning")}
              </div>
              <div className="space-y-1 bg-white dark:bg-[#20201D] p-3 border border-[#E7E4DD] dark:border-[#2C2B27]">
                <div className="text-sm font-medium text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                  <span className="text-[10px] font-mono px-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-500">TR</span>
                  <span>{selectedNode.meaningTr || t("Belirtilmemiş", "Not specified")}</span>
                </div>
                <div className="text-sm font-medium text-neutral-600 dark:text-neutral-400 flex items-center gap-2">
                  <span className="text-[10px] font-mono px-1 bg-neutral-100 dark:bg-neutral-800 text-neutral-500">EN</span>
                  <span>{selectedNode.meaningEn || t("Not specified", "Not specified")}</span>
                </div>
              </div>
            </div>

            {/* Grammar / Case formula */}
            {(selectedNode.prep || selectedNode.formula || selectedNode.kasus) && (
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1">
                  {t("Gramer Kuralı & Kalıp", "Grammar Rule & Formula")}
                </div>
                <div className="p-3 bg-neutral-100 dark:bg-[#232320] border border-[#DDD8CE] dark:border-[#35342F] font-mono text-xs text-neutral-900 dark:text-neutral-100">
                  {selectedNode.formula ? (
                    <div>{selectedNode.formula}</div>
                  ) : (
                    <div className="flex items-center gap-2 font-semibold">
                      <span>+ {selectedNode.prep}</span>
                      <span className="text-blue-600 dark:text-blue-400">({selectedNode.kasus})</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Example sentence */}
            {selectedNode.example && (
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-1">
                  {t("Örnek Cümle (Notlardan)", "Example Sentence (From Notes)")}
                </div>
                <blockquote className="p-3 bg-white dark:bg-[#20201D] border-l-2 border-neutral-900 dark:border-neutral-100 text-xs italic text-neutral-800 dark:text-neutral-200 leading-relaxed font-sans">
                  "{selectedNode.example}"
                </blockquote>
              </div>
            )}

            {/* Connected Nodes List */}
            {connectedDetails.length > 0 && (
              <div>
                <div className="text-[11px] font-mono uppercase tracking-wider text-neutral-500 mb-2">
                  {t("Bağlantılı Kavramlar & Kökler", "Connected Concepts & Roots")}
                </div>
                <div className="space-y-1.5">
                  {connectedDetails.map((item, idx) => (
                    <button
                      key={idx}
                      onClick={() => setSelectedNode(item.node!)}
                      className="w-full flex items-center justify-between p-2 text-left bg-white dark:bg-[#20201D] border border-[#E7E4DD] dark:border-[#2C2B27] hover:border-neutral-900 dark:hover:border-neutral-100 transition-colors group"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-mono text-neutral-400 group-hover:text-blue-600">
                          {item.label || item.relation}
                        </span>
                        <span className="text-xs font-semibold text-neutral-900 dark:text-neutral-100">
                          {item.node!.label}
                        </span>
                      </div>
                      <ArrowRight className="w-3.5 h-3.5 text-neutral-400 group-hover:translate-x-0.5 transition-transform" />
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

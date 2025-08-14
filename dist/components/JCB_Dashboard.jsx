import React, { useMemo, useState, useRef } from "react";
// anyai-ui-kit には専用のコンポーネントライブラリはないため、標準のReactとスタイリング用のクラス名でUIを構築します。
// Card, TabsなどのUIコンポーネントのimportは削除し、代わりにdivやbuttonに適切なクラスを適用します。
const { motion, AnimatePresence } = window.framer;
const { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } = window.Recharts;

// -------------------------------------------------------------
//  Sofy | JCB Dashboard Demo (JP / TH) - Refactored with AnyAI UI Kit
//  - NEW: Multi-to-multi JCB network model
//  - NEW: Heatmap colors for time-series table
// -------------------------------------------------------------

// --- データ定義 (変更なし) ---
const months = (() => { const now = new Date(); const arr: string[] = []; for (let i = 11; i >= 0; i--) { const d = new Date(now.getFullYear(), now.getMonth() - i, 1); const m = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`; arr.push(m); } return arr; })();
const JTBD = ["漏れ不安の軽減","肌へのやさしさ","におい対策","長時間でも安心","寝返りでも安心","コスパ","薄さ/動きやすさ","多い日対応","持ち運び・廃棄のしやすさ","気分を上げる"] as const;
const CEPS = ["通学/通勤の朝","長時間の外出","会議/試験中","運動/体育","放課後/部活","夜間/就寝前","旅行/帰省","梅雨/蒸れやすい日","制服/白い服","急な開始/予定外","産後/量が増える時期","敏感肌/かぶれやすい","トイレに行けない環境","替え場所が少ない","デート/友人と外出","体育祭/ダンス","長時間着座/塾","長距離移動/飛行機","真夏/汗ばむ","スポーツ観戦/屋外"] as const;
const BENEFITS = ["ズレにくい","横漏れに強い","後ろ漏れに強い","高吸収/安心","ムレにくい","肌にやさしい","かぶれにくい","におい抑制","長時間持続","薄いのに安心","肌触りが良い","通気性","フィット感","動いてもよれにくい","寝返り安心ガード","コスパが良い","取り替えやすい","持ち運びしやすい","ゴミが目立たない","サイズが豊富","夜用の安定感","日中の快適","多い日でも安心","ブランド信頼"] as const;
type Country = "JP" | "TH";

// --- NEW: 多対多の親子関係 ---
const CEP_PARENTS: Record<string, string[]> = { "通学/通勤の朝": ["漏れ不安の軽減", "薄さ/動きやすさ"], "長時間の外出": ["長時間でも安心", "漏れ不安の軽減"], "会議/試験中": ["漏れ不安の軽減", "におい対策"], "運動/体育": ["薄さ/動きやすさ", "肌へのやさしさ"], "放課後/部活": ["薄さ/動きやすさ", "におい対策"], "夜間/就寝前": ["寝返りでも安心", "長時間でも安心", "肌へのやさしさ"], "旅行/帰省": ["長時間でも安心", "持ち運び・廃棄のしやすさ"], "梅雨/蒸れやすい日": ["肌へのやさしさ", "におい対策"], "制服/白い服": ["漏れ不安の軽減", "気分を上げる"], "急な開始/予定外": ["持ち運び・廃棄のしやすさ", "コスパ"], "産後/量が増える時期": ["多い日対応", "肌へのやさしさ"], "敏感肌/かぶれやすい": ["肌へのやさしさ"], "トイレに行けない環境": ["長時間でも安心"], "替え場所が少ない": ["持ち運び・廃棄のしやすさ", "コスパ"], "デート/友人と外出": ["におい対策", "気分を上げる", "薄さ/動きやすさ"], "体育祭/ダンス": ["薄さ/動きやすさ", "漏れ不安の軽減"], "長時間着座/塾": ["長時間でも安心", "肌へのやさしさ"], "長距離移動/飛行機": ["長時間でも安心", "持ち運び・廃棄のしやすさ"], "真夏/汗ばむ": ["肌へのやさしさ", "におい対策"], "スポーツ観戦/屋外": ["薄さ/動きやすさ", "長時間でも安心"] };
const BENEFIT_PARENTS: Record<string, string[]> = { "ズレにくい": ["運動/体育", "体育祭/ダンス"], "横漏れに強い": ["夜間/就寝前", "多い日対応", "制服/白い服"], "後ろ漏れに強い": ["夜間/就寝前", "寝返りでも安心"], "高吸収/安心": ["多い日対応", "長時間でも安心", "産後/量が増える時期"], "ムレにくい": ["梅雨/蒸れやすい日", "真夏/汗ばむ", "肌へのやさしさ"], "肌にやさしい": ["敏感肌/かぶれやすい"], "かぶれにくい": ["敏感肌/かぶれやすい", "肌へのやさしさ"], "におい抑制": ["におい対策", "デート/友人と外出"], "長時間持続": ["長時間でも安心", "長時間の外出", "会議/試験中"], "薄いのに安心": ["薄さ/動きやすさ", "通学/通勤の朝"], "肌触りが良い": ["肌へのやさしさ", "敏感肌/かぶれやすい"], "通気性": ["梅雨/蒸れやすい日", "真夏/汗ばむ"], "フィット感": ["運動/体育", "薄さ/動きやすさ"], "動いてもよれにくい": ["運動/体育", "体育祭/ダンス"], "寝返り安心ガード": ["夜間/就寝前", "寝返りでも安心"], "コスパが良い": ["コスパ"], "取り替えやすい": ["持ち運び・廃棄のしやすさ"], "持ち運びしやすい": ["持ち運び・廃棄のしやすさ", "旅行/帰省"], "ゴミが目立たない": ["持ち運び・廃棄のしやすさ"], "サイズが豊富": ["多い日対応", "旅行/帰省"], "夜用の安定感": ["夜間/就寝前", "寝返りでも安心"], "日中の快適": ["通学/通勤の朝", "長時間の外出"], "多い日でも安心": ["多い日対応", "産後/量が増える時期"], "ブランド信頼": ["長時間でも安心", "コスパ"] };

const i18nEN: Record<string, string> = {"漏れ不安の軽減":"Leak Protection","肌へのやさしさ":"Skin-friendly","におい対策":"Odor Control","長時間でも安心":"All-day Confidence","寝返りでも安心":"Night/Turning Safe","コスパ":"Value for Money","薄さ/動きやすさ":"Thin & Flexible","多い日対応":"Heavy-flow Support","持ち運び・廃棄のしやすさ":"Portable & Easy Disposal","気分を上げる":"Uplifting Mood","通学/通勤の朝":"Morning commute/school","長時間の外出":"Long outing","会議/試験中":"Meeting/Exam","運動/体育":"Sports/PE","放課後/部活":"After school/club","夜間/就寝前":"Night / bedtime","旅行/帰省":"Travel / homecoming","梅雨/蒸れやすい日":"Humid/rainy days","制服/白い服":"Uniform/white clothes","急な開始/予定外":"Unexpected start","産後/量が増える時期":"Postpartum/heavier days","敏感肌/かぶれやすい":"Sensitive skin","トイレに行けない環境":"Hard to visit restroom","替え場所が少ない":"Few changing places","デート/友人と外出":"Date / hangout","体育祭/ダンス":"Sports festival/dance","長時間着座/塾":"Long sitting / cram school","長距離移動/飛行機":"Long flight / travel","真夏/汗ばむ":"Hot summer/sweaty","スポーツ観戦/屋外":"Outdoor / watching sports","ズレにくい":"Stay-in-place","横漏れに強い":"Side-leak guard","後ろ漏れに強い":"Back-leak guard","高吸収/安心":"High absorption","ムレにくい":"Less stuffy","肌にやさしい":"Gentle to skin","かぶれにくい":"Less irritation","におい抑制":"Odor control","長時間持続":"Long lasting","薄いのに安心":"Thin yet secure","肌触りが良い":"Soft touch","通気性":"Breathable","フィット感":"Fit","動いてもよれにくい":"No bunching","寝返り安心ガード":"Rolling-safe guard","コスパが良い":"Good value","取り替えやすい":"Easy to change","持ち運びしやすい":"Easy to carry","ゴミが目立たない":"Discreet trash","サイズが豊富":"Size variety","夜用の安定感":"Night stability","日中の快適":"Day comfort","多い日でも安心":"Safe on heavy days","ブランド信頼":"Brand trust"};
function hash(str: string) { let h = 0; for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0; return h; }
function seeded(seed: number) { let s = seed >>> 0; return () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 1000) / 1000; }; }
type Series = Record<string, number[]>;
type JCBData = { months: string[]; jtbd: Series; cep: Series; benefit: Series };
const baseScale = 200;
function genSeries(names: readonly string[], seedKey: string, base = baseScale, amp = 120, trend = 0) { const out: Series = {}; for (const n of names) { const rnd = seeded(hash(n + seedKey)); const arr: number[] = []; let t = trend * (hash(n) % 5); for (let i = 0; i < months.length; i++) { const season = Math.sin((i / 12) * Math.PI * 2 + (hash(n) % 6) / 6) * amp; const noise = (rnd() - 0.5) * amp * 0.5; arr.push(Math.max(5, Math.round(base + season + noise + t))); t += trend; } out[n] = arr; } return out; }
function scaleSeries(s: Series, scaleMap: Record<string, number>) { const out: Series = {}; Object.keys(s).forEach((k) => { const m = scaleMap[k] ?? 1; out[k] = s[k].map((v) => Math.round(v * m)); }); return out; }
function sum(arr: number[]) { return arr.reduce((a, b) => a + b, 0); }
const biasJP_JTBD: Record<string, number> = {"漏れ不安の軽減":1.25,"肌へのやさしさ":1.15,"長時間でも安心":1.2,"寝返りでも安心":1.25,"コスパ":1.05};
const biasTH_JTBD: Record<string, number> = {"におい対策":1.25,"薄さ/動きやすさ":1.2,"気分を上げる":1.15,"コスパ":1.1};
const biasJP_CEP: Record<string, number> = {"夜間/就寝前":1.3,"通学/通勤の朝":1.2,"長時間の外出":1.15,"制服/白い服":1.2};
const biasTH_CEP: Record<string, number> = {"デート/友人と外出":1.25,"運動/体育":1.2,"真夏/汗ばむ":1.2};
const biasJP_BEN: Record<string, number> = {"後ろ漏れに強い":1.3,"夜用の安定感":1.25,"長時間持続":1.15,"薄いのに安心":1.1};
const biasTH_BEN: Record<string, number> = {"におい抑制":1.25,"薄いのに安心":1.2,"通気性":1.15,"フィット感":1.15};
function getDemoJCB(country: Country): JCBData { const jtbdBase = genSeries(JTBD, "JTBD", 220, 140, 2); const cepBase = genSeries(CEPS, "CEP", 160, 100, 1); const benBase = genSeries(BENEFITS, "BEN", 140, 90, 1); const jtbd = scaleSeries(jtbdBase, country === "JP" ? biasJP_JTBD : biasTH_JTBD); const cep = scaleSeries(cepBase, country === "JP" ? biasJP_CEP : biasTH_CEP); const benefit = scaleSeries(benBase, country === "JP" ? biasJP_BEN : biasTH_BEN); return { months, jtbd, cep, benefit }; }
function totals(series: Series) { const t: Record<string, number> = {}; Object.entries(series).forEach(([k, arr]) => (t[k] = sum(arr))); return t; }
function NumberFmt(n: number) { return n.toLocaleString("ja-JP"); }
function useCountryData(country: Country) { return useMemo(() => getDemoJCB(country), [country]); }
type TimeLevel = "jtbd" | "cep" | "benefit";
function buildChartData(level: TimeLevel, data: JCBData, topN = 8) { const src = level === "jtbd" ? data.jtbd : level === "cep" ? data.cep : data.benefit; const totalsByCat = Object.entries(src).map(([k, arr]) => [k, sum(arr)] as const).sort((a, b) => b[1] - a[1]).slice(0, topN).map(([k]) => k); const rows = data.months.map((m, i) => { const row: any = { month: m }; totalsByCat.forEach((c) => (row[c] = src[c][i])); return row; }); return { rows, categories: totalsByCat }; }
function labelFor(country: Country, text: string) { if (country === "TH") return i18nEN[text] ?? text; return text; }

// --- NEW: ヒートマップ用ヘルパー ---
const red = [220, 38, 38], white = [255, 255, 255], green = [22, 163, 74];
const lerp = (c1: number[], c2: number[], t: number) => c1.map((c, i) => Math.round(c + (c2[i] - c) * t));
function getHeatmapColor(value: number, min: number, max: number, median: number) {
  if (max === min) return `rgb(${white.join(',')})`;
  let t = 0;
  let color;
  if (value >= median) {
    t = max === median ? 1 : (value - median) / (max - median);
    color = lerp(white, green, t);
  } else {
    t = median === min ? 1 : (value - min) / (median - min);
    color = lerp(red, white, t);
  }
  return `rgb(${color.join(',')})`;
}

// ---------------------- UI Components (anyai-ui-kit style) -----------------------

function TimeSeriesPanel({ title, level, country }: { title: string; level: TimeLevel; country: Country }) {
  const data = useCountryData(country);
  const { rows, categories } = useMemo(() => buildChartData(level, data, 8), [data, level]);
  const src = level === "jtbd" ? data.jtbd : level === "cep" ? data.cep : data.benefit;

  const rowStats = useMemo(() => {
    const stats: Record<string, {min: number, max: number, median: number}> = {};
    Object.keys(src).forEach(cat => {
      const values = [...src[cat]].sort((a, b) => a - b);
      stats[cat] = {
        min: values[0],
        max: values[values.length - 1],
        median: values[Math.floor(values.length / 2)]
      };
    });
    return stats;
  }, [src]);

  return (
    <div className="card">
      <div className="card-header"><h3 className="font-medium">{title}</h3></div>
      <div className="card-body">
        <div className="h-72 w-full"><ResponsiveContainer><LineChart data={rows} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}><CartesianGrid strokeDasharray="3 3" stroke="var(--border)" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Legend />{categories.map((c) => (<Line key={c} type="monotone" dataKey={c} strokeWidth={2} dot={false} />))}</LineChart></ResponsiveContainer></div>
        <div className="mt-6 overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead><tr className="text-left text-muted"><th className="p-2">カテゴリ</th>{data.months.map((m) => (<th key={m} className="p-2 whitespace-nowrap">{m}</th>))}<th className="p-2">合計</th></tr></thead>
            <tbody>
              {Object.keys(src).map((cat) => (
                <tr key={cat} className="border-t border-border">
                  <td className="p-2 font-medium">{labelFor(country, cat)}</td>
                  {src[cat].map((v, i) => {
                    const { min, max, median } = rowStats[cat];
                    const bgColor = getHeatmapColor(v, min, max, median);
                    return (<td key={i} className="p-2 tabular-nums text-center" style={{ backgroundColor: bgColor, color: v > median ? 'white' : 'inherit' }}>{NumberFmt(v)}</td>)
                  })}
                  <td className="p-2 font-semibold">{NumberFmt(sum(src[cat]))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

function InteractiveJCBNetwork({ country }: { country: Country }) {
  const data = useCountryData(country);
  const jtTotals = totals(data.jtbd);
  const cepTotals = totals(data.cep);
  const benTotals = totals(data.benefit);

  const width = 1000, height = 680, cx = width / 2, cy = height / 2, r1 = 150, r2 = 280, r3 = 400;

  const jtNodes = (JTBD as unknown as string[]).map((name, i) => ({ level: 1, name, x: cx + r1 * Math.cos((i / JTBD.length) * Math.PI * 2 - Math.PI / 2), y: cy + r1 * Math.sin((i / JTBD.length) * Math.PI * 2 - Math.PI / 2), val: jtTotals[name] }));
  const cepNodes = (CEPS as unknown as string[]).map((name, i) => ({ level: 2, name, x: cx + r2 * Math.cos((i / CEPS.length) * Math.PI * 2 - Math.PI / 2), y: cy + r2 * Math.sin((i / CEPS.length) * Math.PI * 2 - Math.PI / 2), val: cepTotals[name], parents: CEP_PARENTS[name] || [] }));
  const benNodes = (BENEFITS as unknown as string[]).map((name, i) => ({ level: 3, name, x: cx + r3 * Math.cos((i / BENEFITS.length) * Math.PI * 2 - Math.PI / 2), y: cy + r3 * Math.sin((i / BENEFITS.length) * Math.PI * 2 - Math.PI / 2), val: benTotals[name], parents: BENEFIT_PARENTS[name] || [] }));

  const jtByName: Record<string, any> = Object.fromEntries(jtNodes.map((n) => [n.name, n]));
  const cepByName: Record<string, any> = Object.fromEntries(cepNodes.map((n) => [n.name, n]));

  const [activeJt, setActiveJt] = useState<string | null>(null);
  const [activeCep, setActiveCep] = useState<string | null>(null);
  
  const maxJT = Math.max(...Object.values(jtTotals)), maxCEP = Math.max(...Object.values(cepTotals)), maxBEN = Math.max(...Object.values(benTotals));
  const nodeR = (v: number, max: number) => 8 + (v / (max || 1)) * 24;

  return (
    <div className="card">
      <div className="card-header"><h3 className="font-medium">Sofy｜JCB意味ネットワーク（多対多モデル）— {country}</h3></div>
      <div className="card-body">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto bg-white rounded-md" onMouseLeave={() => { setActiveJt(null); setActiveCep(null); }}>
          <circle cx={cx} cy={cy} r={r1} fill="none" stroke="var(--border)" /><circle cx={cx} cy={cy} r={r2} fill="none" stroke="var(--bg-subtle)" /><circle cx={cx} cy={cy} r={r3} fill="none" stroke="var(--bg-subtle)" />
          <g><circle cx={cx} cy={cy} r={48} fill="var(--bg)" stroke="var(--border)" /><text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" className="text-lg font-semibold fill-current text-ink">Sofy</text><text x={cx} y={cy + 22} textAnchor="middle" dominantBaseline="hanging" className="text-xs fill-current text-muted">Brand</text></g>
          
          <AnimatePresence>
            {activeJt && cepNodes.filter(c => c.parents.includes(activeJt)).map((c, idx) => c.parents.filter(p => p === activeJt).map(p => (<motion.line key={`${c.name}-${p}`} x1={jtByName[p].x} y1={jtByName[p].y} x2={c.x} y2={c.y} stroke="var(--primary)" strokeWidth={1} strokeOpacity={0.5} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />)))}
          </AnimatePresence>
          <AnimatePresence>
            {activeCep && benNodes.filter(b => b.parents.includes(activeCep)).map((b, idx) => b.parents.filter(p => p === activeCep).map(p => (<motion.line key={`${b.name}-${p}`} x1={cepByName[p].x} y1={cepByName[p].y} x2={b.x} y2={b.y} stroke="var(--orange)" strokeWidth={1} strokeOpacity={0.5} initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} />)))}
          </AnimatePresence>

          {jtNodes.map((n) => (<g key={n.name} onMouseEnter={() => { setActiveJt(n.name); setActiveCep(null); }} style={{ cursor: "pointer" }}><motion.circle cx={n.x} cy={n.y} r={nodeR(n.val, maxJT)} fill={activeJt === n.name ? "var(--amber)" : "#fee2e2"} stroke="var(--border)" initial={{ scale: 0.9 }} animate={{ scale: activeJt === n.name ? 1.05 : 1 }} /><text x={n.x} y={n.y} textAnchor="middle" dominantBaseline="middle" className="text-xs fill-current text-ink pointer-events-none">{labelFor(country, n.name)}</text></g>))}
          {cepNodes.map((n) => (<motion.g key={n.name} onMouseEnter={() => setActiveCep(n.name)} style={{ cursor: "pointer" }} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: activeJt && n.parents.includes(activeJt) ? 1 : 0.1, scale: 1 }}><circle cx={n.x} cy={n.y} r={nodeR(n.val, maxCEP)} fill={activeCep === n.name ? "var(--cyan)" : "#e0f2fe"} stroke="var(--border)" /><text x={n.x} y={n.y} textAnchor="middle" dominantBaseline="middle" className="text-xs fill-current text-ink pointer-events-none">{labelFor(country, n.name)}</text></motion.g>))}
          {benNodes.map((n) => (<motion.g key={n.name} style={{ cursor: "pointer" }} initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: activeCep && n.parents.includes(activeCep) ? 1 : 0.1, scale: 1 }}><circle cx={n.x} cy={n.y} r={nodeR(n.val, maxBEN)} fill="#ecfccb" stroke="var(--border)" /><text x={n.x} y={n.y} textAnchor="middle" dominantBaseline="middle" className="text-xs fill-current text-ink pointer-events-none">{labelFor(country, n.name)}</text></motion.g>))}
          
          <text x={24} y={24} className="text-sm text-muted">Hover a JtBD → CEPs pop up → Hover a CEP → Benefits</text>
        </svg>
      </div>
    </div>
  );
}

function DiffNetwork() {
  const jp = useCountryData("JP"), th = useCountryData("TH");
  const width = 960, height = 640, cx = width / 2, cy = height / 2, r1 = 140, r2 = 260, r3 = 380;
  const jtTotalsJP = totals(jp.jtbd), cepTotalsJP = totals(jp.cep), benTotalsJP = totals(jp.benefit);
  const jtTotalsTH = totals(th.jtbd), cepTotalsTH = totals(th.cep), benTotalsTH = totals(th.benefit);
  const jtNodes = (JTBD as unknown as string[]).map((name, i) => ({ name, x: cx + r1 * Math.cos((i / JTBD.length) * Math.PI * 2 - Math.PI / 2), y: cy + r1 * Math.sin((i / JTBD.length) * Math.PI * 2 - Math.PI / 2) }));
  const cepNodes = (CEPS as unknown as string[]).map((name, i) => ({ name, x: cx + r2 * Math.cos((i / CEPS.length) * Math.PI * 2 - Math.PI / 2), y: cy + r2 * Math.sin((i / CEPS.length) * Math.PI * 2 - Math.PI / 2) }));
  const benNodes = (BENEFITS as unknown as string[]).map((name, i) => ({ name, x: cx + r3 * Math.cos((i / BENEFITS.length) * Math.PI * 2 - Math.PI / 2), y: cy + r3 * Math.sin((i / BENEFITS.length) * Math.PI * 2 - Math.PI / 2) }));
  const jtBy: Record<string, any> = Object.fromEntries(jtNodes.map((n) => [n.name, n]));
  const cepBy: Record<string, any> = Object.fromEntries(cepNodes.map((n) => [n.name, n]));

  const allEdges = [];
  for (const cep in CEP_PARENTS) { for (const p of CEP_PARENTS[cep]) { const wJP = Math.min(jtTotalsJP[p] || 0, cepTotalsJP[cep] || 0); const wTH = Math.min(jtTotalsTH[p] || 0, cepTotalsTH[cep] || 0); allEdges.push({ from: jtBy[p], to: cepBy[cep], d: wJP - wTH }); } }
  for (const ben in BENEFIT_PARENTS) { for (const p of BENEFIT_PARENTS[ben]) { const wJP = Math.min(cepTotalsJP[p] || 0, benTotalsJP[ben] || 0); const wTH = Math.min(cepTotalsTH[p] || 0, benTotalsTH[ben] || 0); allEdges.push({ from: cepBy[p], to: benNodes.find(b => b.name === ben)!, d: wJP - wTH }); } }
  
  const maxAbs = Math.max(...allEdges.map(e => Math.abs(e.d))) || 1;
  const edgeWidth = (d: number) => 1 + (Math.abs(d) / maxAbs) * 8;
  const edgeColor = (d: number) => (d >= 0 ? "var(--error)" : "var(--primary)");
  const edgeOpacity = (d: number) => 0.25 + (Math.abs(d) / maxAbs) * 0.6;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-auto bg-white rounded-md">
      <circle cx={cx} cy={cy} r={r1} fill="none" stroke="var(--border)" /><circle cx={cx} cy={cy} r={r2} fill="none" stroke="var(--border)" /><circle cx={cx} cy={cy} r={r3} fill="none" stroke="var(--border)" />
      {allEdges.filter(e => e.from && e.to).map((e, i) => (<line key={i} x1={e.from.x} y1={e.from.y} x2={e.to.x} y2={e.to.y} stroke={edgeColor(e.d)} strokeOpacity={edgeOpacity(e.d)} strokeWidth={edgeWidth(e.d)} />))}
      {[...jtNodes, ...cepNodes, ...benNodes].map((n, i) => (<g key={i}><circle cx={n.x} cy={n.y} r={10} fill="var(--bg-subtle)" stroke="var(--border)" /><text x={n.x} y={n.y} textAnchor="middle" dominantBaseline="middle" className="text-xs fill-current text-ink">{n.name}</text></g>))}
      <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" className="text-base font-semibold fill-current text-ink">JtBD</text>
      <g transform={`translate(${width - 250}, ${height - 130})`}><rect width="230" height="110" rx="var(--radius-md)" fill="var(--bg)" stroke="var(--border)" /><g transform="translate(12,10)"><text x="0" y="14" className="text-sm font-semibold fill-current text-ink">色：優位な国 / 太さ：差の大きさ</text><line x1="0" y1="35" x2="40" y2="35" stroke="var(--error)" strokeWidth={6} /><text x="48" y="39" className="text-sm fill-current text-ink">JP ＞ TH</text><line x1="0" y1="65" x2="40" y2="65" stroke="var(--primary)" strokeWidth={6} /><text x="48" y="69" className="text-sm fill-current text-ink">TH ＞ JP</text></g></g>
    </svg>
  );
}

function DiffTable() { /* ... (変更なし) ... */ return null; }
function DiffModelPanel() { return (<div className="card"><div className="card-header"><h3 className="font-medium">JP vs TH 差分モデリング（最終）</h3></div><div className="card-body space-y-6"><DiffNetwork /></div></div>); }

const AppShell = ({ children }: { children: React.ReactNode }) => ( <div className="min-h-screen bg-[var(--bg-subtle)] text-[var(--text)]"> <header className="h-16 border-b border-border bg-white flex items-center px-4 justify-between"> <div className="flex items-center gap-3"> <img src="./anyai-logo.png" alt="AnyAI" className="h-7" /> <span className="text-sm text-muted">JCB Dashboard</span> </div> <div className="flex items-center gap-2"> <button className="btn btn-secondary">Export</button> </div> </header> <div className="flex"> <aside className="hidden lg:block w-64 border-r border-border bg-white p-3"> <nav className="space-y-1"> <a href="#" className="flex items-center gap-2 px-3 h-10 rounded-md bg-gray-50 border-l-4 border-primary text-ink">Dashboard</a> <a href="#" className="flex items-center gap-2 px-3 h-10 rounded-md hover:bg-gray-50">Analytics</a> <a href="#" className="flex items-center gap-2 px-3 h-10 rounded-md hover:bg-gray-50">Settings</a> </nav> </aside> <main className="flex-1 p-6 max-w-container mx-auto">{children}</main> </div> </div> );
const TabButton = ({ children, active, ...props }: { children: React.ReactNode, active: boolean } & React.ButtonHTMLAttributes<HTMLButtonElement>) => ( <button className={`px-3 h-10 rounded-md text-sm font-medium transition ${active ? 'bg-primary text-white shadow-sm' : 'hover:bg-gray-50'}`} {...props} > {children} </button> );

export default function JCBDashboardDemo() {
  const [activeTab, setActiveTab] = useState("JP-NET");
  const tabs = ["JP-JOB", "JP-CEP", "JP-BEN", "JP-NET", "TH-JOB", "TH-CEP", "TH-BEN", "TH-NET", "DIFF"];
  const tabLabels: Record<string, string> = { "JP-JOB": "JP｜時系列(JOB)", "JP-CEP": "JP｜時系列(CEP)", "JP-BEN": "JP｜時系列(Benefit)", "JP-NET": "JP｜意味ネットワーク", "TH-JOB": "TH｜時系列(JOB)", "TH-CEP": "TH｜時系列(CEP)", "TH-BEN": "TH｜時系列(Benefit)", "TH-NET": "TH｜意味ネットワーク", "DIFF": "差分モデル" };

  const CurrentPanel = () => {
    switch (activeTab) {
      case "JP-JOB": return <TimeSeriesPanel title="JOB×時系列（JP）" level="jtbd" country="JP" />;
      case "JP-CEP": return <TimeSeriesPanel title="CEP×時系列（JP）" level="cep" country="JP" />;
      case "JP-BEN": return <TimeSeriesPanel title="Benefit×時系列（JP）" level="benefit" country="JP" />;
      case "JP-NET": return <InteractiveJCBNetwork country="JP" />;
      case "TH-JOB": return <TimeSeriesPanel title="JOB×時系列（TH）" level="jtbd" country="TH" />;
      case "TH-CEP": return <TimeSeriesPanel title="CEP×時系列（TH）" level="cep" country="TH" />;
      case "TH-BEN": return <TimeSeriesPanel title="Benefit×時系列（TH）" level="benefit" country="TH" />;
      case "TH-NET": return <InteractiveJCBNetwork country="TH" />;
      case "DIFF": return <DiffModelPanel />;
      default: return null;
    }
  };

  return (
    <AppShell>
      <div className="space-y-6">
        <div><h1 className="text-2xl font-semibold">Sofy｜JCB（JtBD–CEPs–Benefit）ダッシュボード・デモ</h1><p className="text-muted">意味ネットワークの多対多モデル化、および時系列テーブルのヒートマップ表示に対応。</p></div>
        <div className="flex flex-wrap gap-2">{tabs.map(tab => (<TabButton key={tab} active={activeTab === tab} onClick={() => setActiveTab(tab)}>{tabLabels[tab]}</TabButton>))}</div>
        <div className="mt-4"><AnimatePresence mode="wait"><motion.div key={activeTab} initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: -10, opacity: 0 }} transition={{ duration: 0.2 }}><CurrentPanel /></motion.div></AnimatePresence></div>
      </div>
    </AppShell>
  );
}

"use client";
import { useEffect, useState, useCallback } from "react";
import ThemeToggle from "@/components/ThemeToggle";
import SpecForm from "@/components/SpecForm";

const API = "http://localhost:8000/api";

interface Spec {
  id?: number;
  category1: string; category2: string; country: string; stage: string;
  status: string; ais_number: string; other_number: string; name: string;
  related_number: string; date: string; owner: string; issuer: string;
  expiry_date: string; note1: string; note2: string; evidence: string;
}

interface Categories {
  category1: string[]; category2: string[]; country: string[];
  status: string[]; stage: string[];
}

const COLUMNS: { key: keyof Spec; label: string; width?: string }[] = [
  { key: "category1", label: "구분(1단계)", width: "w-24" },
  { key: "category2", label: "구분(2단계)", width: "w-20" },
  { key: "country", label: "국가", width: "w-14" },
  { key: "stage", label: "단계", width: "w-16" },
  { key: "status", label: "상태", width: "w-16" },
  { key: "ais_number", label: "AIS 번호", width: "w-28" },
  { key: "name", label: "명칭" },
  { key: "related_number", label: "관련 번호", width: "w-32" },
  { key: "date", label: "일자", width: "w-24" },
  { key: "owner", label: "소유자", width: "w-28" },
  { key: "issuer", label: "발급기관", width: "w-32" },
  { key: "expiry_date", label: "만료일", width: "w-24" },
  { key: "evidence", label: "증빙자료", width: "w-24" },
];

export default function Home() {
  const [specs, setSpecs] = useState<Spec[]>([]);
  const [categories, setCategories] = useState<Categories>({ category1: [], category2: [], country: [], status: [], stage: [] });
  const [filters, setFilters] = useState({ category1: "", category2: "", country: "", status: "", search: "" });
  const [showForm, setShowForm] = useState(false);
  const [editSpec, setEditSpec] = useState<Spec | null>(null);
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSpecs = useCallback(async () => {
    const params = new URLSearchParams();
    if (filters.category1) params.set("category1", filters.category1);
    if (filters.category2) params.set("category2", filters.category2);
    if (filters.country) params.set("country", filters.country);
    if (filters.status) params.set("status", filters.status);
    if (filters.search) params.set("search", filters.search);
    try { const res = await fetch(API + "/specs?" + params); setSpecs(await res.json()); }
    catch (e) { console.error("Failed to fetch specs"); }
    finally { setLoading(false); }
  }, [filters]);

  const fetchCategories = async () => {
    try { const res = await fetch(API + "/specs/categories"); setCategories(await res.json()); }
    catch (e) { console.error("Failed to fetch categories"); }
  };

  useEffect(() => { fetchCategories(); }, []);
  useEffect(() => { fetchSpecs(); }, [fetchSpecs]);

  const handleSave = async (spec: Spec) => {
    const method = spec.id ? "PUT" : "POST";
    const url = spec.id ? API + "/specs/" + spec.id : API + "/specs";
    await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(spec) });
    setShowForm(false); setEditSpec(null); fetchSpecs(); fetchCategories();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("정말 삭제하시겠습니까?")) return;
    await fetch(API + "/specs/" + id, { method: "DELETE" }); fetchSpecs(); fetchCategories();
  };

  const statusColor = (s: string) => {
    if (s === "유효") return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200";
    if (s === "만료") return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200";
    if (s === "해당없음") return "bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-300";
    return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200";
  };

  const categoryColor = (c: string) => {
    if (c === "수상") return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200";
    if (c === "인증/자격") return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200";
    if (c === "지식재산권") return "bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200";
    return "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200";
  };

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h1 className="text-2xl font-bold">AISpera Spec 관리</h1>
        <div className="flex gap-2">
          <button onClick={() => { setEditSpec(null); setShowForm(true); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">+ 새 항목</button>
          <ThemeToggle />
        </div>
      </div>
      <div className="flex flex-wrap gap-3 mb-6 p-4 bg-white dark:bg-gray-800 rounded-xl shadow">
        <select value={filters.category1} onChange={(e) => setFilters((f) => ({ ...f, category1: e.target.value }))} className="px-3 py-2 rounded-lg border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none">
          <option value="">전체 (1단계)</option>
          {categories.category1.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filters.category2} onChange={(e) => setFilters((f) => ({ ...f, category2: e.target.value }))} className="px-3 py-2 rounded-lg border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none">
          <option value="">전체 (2단계)</option>
          {categories.category2.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filters.country} onChange={(e) => setFilters((f) => ({ ...f, country: e.target.value }))} className="px-3 py-2 rounded-lg border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none">
          <option value="">전체 (국가)</option>
          {categories.country.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={filters.status} onChange={(e) => setFilters((f) => ({ ...f, status: e.target.value }))} className="px-3 py-2 rounded-lg border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none">
          <option value="">전체 (상태)</option>
          {categories.status.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <input type="text" placeholder="검색 (명칭, 번호, 소유자, 발급기관)" value={filters.search} onChange={(e) => setFilters((f) => ({ ...f, search: e.target.value }))} className="flex-1 min-w-[200px] px-3 py-2 rounded-lg border dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:outline-none" />
      </div>
      <div className="mb-4 text-sm text-gray-500 dark:text-gray-400">총 {specs.length}건</div>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow overflow-x-auto">
        {loading ? (<div className="p-8 text-center text-gray-500">로딩 중...</div>) : specs.length === 0 ? (<div className="p-8 text-center text-gray-500">데이터가 없습니다</div>) : (
          <table className="w-full text-sm">
            <thead><tr className="border-b dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
              {COLUMNS.map(({ key, label, width }) => (<th key={key} className={"px-3 py-3 text-left font-semibold text-gray-600 dark:text-gray-300 " + (width || "")}>{label}</th>))}
              <th className="px-3 py-3 text-center w-24">관리</th>
            </tr></thead>
            <tbody>
              {specs.map((spec) => (
                <tr key={spec.id} className="border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors" onClick={() => setExpandedId(expandedId === spec.id ? null : (spec.id ?? null))}>
                  {COLUMNS.map(({ key }) => (
                    <td key={key} className="px-3 py-2.5">
                      {key === "category1" ? (<span className={"px-2 py-0.5 rounded-full text-xs font-medium " + categoryColor(spec[key] || "")}>{spec[key]}</span>)
                      : key === "status" ? (<span className={"px-2 py-0.5 rounded-full text-xs font-medium " + statusColor(spec[key] || "")}>{spec[key]}</span>)
                      : (<span className="truncate block max-w-xs" title={spec[key] as string || ""}>{spec[key] as string}</span>)}
                    </td>
                  ))}
                  <td className="px-3 py-2.5 text-center">
                    <button onClick={(e) => { e.stopPropagation(); setEditSpec(spec); setShowForm(true); }} className="text-blue-600 hover:text-blue-800 dark:text-blue-400 mr-2">수정</button>
                    <button onClick={(e) => { e.stopPropagation(); handleDelete(spec.id!); }} className="text-red-600 hover:text-red-800 dark:text-red-400">삭제</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      {expandedId && specs.find(s => s.id === expandedId) && (() => {
        const spec = specs.find(s => s.id === expandedId)!;
        return (
          <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-xl shadow">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <h3 className="md:col-span-2 font-bold text-lg mb-2">{spec.name}</h3>
              {spec.other_number && <div><span className="font-medium text-gray-500 dark:text-gray-400">타사 관리번호:</span> {spec.other_number}</div>}
              {spec.note1 && <div className="md:col-span-2"><span className="font-medium text-gray-500 dark:text-gray-400">비고1:</span> <span className="whitespace-pre-wrap">{spec.note1}</span></div>}
              {spec.note2 && <div className="md:col-span-2"><span className="font-medium text-gray-500 dark:text-gray-400">비고2:</span> <span className="whitespace-pre-wrap">{spec.note2}</span></div>}
            </div>
          </div>
        );
      })()}
      {showForm && (<SpecForm spec={editSpec} onSave={handleSave} onClose={() => { setShowForm(false); setEditSpec(null); }} />)}
    </div>
  );
}

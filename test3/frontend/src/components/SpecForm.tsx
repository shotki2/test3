"use client";
import { useState } from "react";

interface Spec {
  id?: number;
  category1: string; category2: string; country: string; stage: string;
  status: string; ais_number: string; other_number: string; name: string;
  related_number: string; date: string; owner: string; issuer: string;
  expiry_date: string; note1: string; note2: string; evidence: string;
}

interface Props {
  spec: Spec | null;
  onSave: (spec: Spec) => void;
  onClose: () => void;
}

const FIELDS: { key: keyof Spec; label: string; type?: string }[] = [
  { key: "category1", label: "구분(1단계)" },
  { key: "category2", label: "구분(2단계)" },
  { key: "country", label: "국가" },
  { key: "stage", label: "단계" },
  { key: "status", label: "상태" },
  { key: "ais_number", label: "AIS 관리번호" },
  { key: "other_number", label: "타사 관리번호" },
  { key: "name", label: "명칭" },
  { key: "related_number", label: "관련 번호" },
  { key: "date", label: "일자" },
  { key: "owner", label: "소유자" },
  { key: "issuer", label: "발급기관" },
  { key: "expiry_date", label: "만료일" },
  { key: "note1", label: "비고1", type: "textarea" },
  { key: "note2", label: "비고2", type: "textarea" },
  { key: "evidence", label: "증빙자료" },
];

const EMPTY: Spec = {
  category1: "", category2: "", country: "", stage: "", status: "",
  ais_number: "", other_number: "", name: "", related_number: "",
  date: "", owner: "", issuer: "", expiry_date: "", note1: "", note2: "", evidence: "",
};

export default function SpecForm({ spec, onSave, onClose }: Props) {
  const [form, setForm] = useState<Spec>(spec || EMPTY);

  const handleChange = (key: keyof Spec, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-6">
        <h2 className="text-xl font-bold mb-4">
          {spec?.id ? "항목 수정" : "새 항목 추가"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {FIELDS.map(({ key, label, type }) => (
              <div key={key} className={type === "textarea" ? "md:col-span-2" : ""}>
                <label className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
                  {label}
                </label>
                {type === "textarea" ? (
                  <textarea
                    value={(form[key] as string) || ""}
                    onChange={(e) => handleChange(key, e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                ) : (
                  <input
                    type="text"
                    value={(form[key] as string) || ""}
                    onChange={(e) => handleChange(key, e.target.value)}
                    className="w-full px-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-700 dark:border-gray-600 focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              취소
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
            >
              저장
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

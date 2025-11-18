"use client";

import { useState } from "react";
// 使用簡單的 SVG 圖示替代 react-icons
const SearchIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
);

const CloseIcon = () => (
  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
);
import { searchCodes } from "@/lib/api/codes";
import type { SearchCodesResponse } from "@/lib/types/codes";

interface SearchDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onResultSelect?: (type: "major" | "mid" | "sub", id: number) => void;
}

/**
 * 查詢對話框元件
 * 
 * 符合規格：3.5 查詢與列印
 * - 關鍵字搜尋（代號/名稱/說明）
 * - 篩選條件（大分類代號）
 * - 顯示查詢結果並高亮符合條件
 */
export default function SearchDialog({
  isOpen,
  onClose,
  onResultSelect,
}: SearchDialogProps) {
  const [keyword, setKeyword] = useState("");
  const [majorCatNoFilter, setMajorCatNoFilter] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchCodesResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!keyword.trim()) {
      setError("請輸入關鍵字");
      return;
    }

    try {
      setIsSearching(true);
      setError(null);
      const response = await searchCodes({
        keyword: keyword.trim(),
        majorCatNo: majorCatNoFilter || undefined,
      });
      setResults(response);
    } catch (err) {
      console.error("查詢失敗:", err);
      setError("查詢失敗，請稍後再試");
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-4xl w-full mx-4 p-6 max-h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            查詢代碼
          </h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
          >
            <CloseIcon />
          </button>
        </div>

        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              關鍵字（代號/名稱/說明）
            </label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="輸入關鍵字..."
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="w-32">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              大分類代號
            </label>
            <input
              type="text"
              value={majorCatNoFilter}
              onChange={(e) => setMajorCatNoFilter(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="選填"
              maxLength={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={handleSearch}
              disabled={isSearching}
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
            <SearchIcon />
            {isSearching ? "查詢中..." : "查詢"}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-md">
            {error}
          </div>
        )}

        <div className="flex-1 overflow-auto">
          {results && (
            <div className="space-y-4">
              {results.data && results.data.length > 0 ? (
                <>
                  {results.data
                    .filter((r) => r.type === "major")
                    .map((r) => (
                      <div
                        key={r.major?.majorCatId}
                        className="p-2 bg-gray-50 dark:bg-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                        onClick={() => {
                          if (r.major) {
                            onResultSelect?.("major", r.major.majorCatId);
                            onClose();
                          }
                        }}
                      >
                        <div className="font-medium text-gray-900 dark:text-white">
                          {r.major?.majorCatNo} - {r.major?.majorCatName}
                        </div>
                      </div>
                    ))}
                  {results.data
                    .filter((r) => r.type === "mid")
                    .map((r) => (
                      <div
                        key={r.mid?.midCatId}
                        className="p-2 bg-gray-50 dark:bg-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                        onClick={() => {
                          if (r.mid) {
                            onResultSelect?.("mid", r.mid.midCatId);
                            onClose();
                          }
                        }}
                      >
                        <div className="font-medium text-gray-900 dark:text-white">
                          {r.mid?.majorCatNo} / {r.mid?.midCatCode} - {r.mid?.codeDesc}
                        </div>
                      </div>
                    ))}
                  {results.data
                    .filter((r) => r.type === "sub")
                    .map((r) => (
                      <div
                        key={r.sub?.id}
                        className="p-2 bg-gray-50 dark:bg-gray-700 rounded hover:bg-gray-100 dark:hover:bg-gray-600 cursor-pointer"
                        onClick={() => {
                          if (r.sub) {
                            onResultSelect?.("sub", r.sub.id);
                            onClose();
                          }
                        }}
                      >
                        <div className="font-medium text-gray-900 dark:text-white">
                          {r.sub?.majorCatNo} / {r.sub?.midCatCode} / {r.sub?.subcatCode} -{" "}
                          {r.sub?.codeDesc}
                        </div>
                      </div>
                    ))}
                </>
              ) : (
                <div className="text-center text-gray-500 dark:text-gray-400 py-8">
                  查無結果
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


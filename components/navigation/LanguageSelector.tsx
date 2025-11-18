"use client";

import { useState, useEffect, useRef } from "react";

type Language = "zh-TW" | "en";

/**
 * 語系選擇器
 * 
 * 符合規格：2.1 全域 UI 框架
 * - 語系選擇：正體中文 / English
 */
export default function LanguageSelector() {
  const [currentLang, setCurrentLang] = useState<Language>("zh-TW");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // 點擊外部關閉下拉選單
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const languages: { code: Language; label: string }[] = [
    { code: "zh-TW", label: "正體中文" },
    { code: "en", label: "English" },
  ];

  const handleSelectLanguage = (lang: Language) => {
    setCurrentLang(lang);
    setIsOpen(false);
    // TODO: 實作語系切換邏輯
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="
          flex items-center gap-2
          px-3 py-2
          rounded-button
          bg-white dark:bg-gray-800
          border border-gray-200 dark:border-gray-700
          text-sm font-medium
          text-gray-700 dark:text-gray-200
          hover:bg-gray-50 dark:hover:bg-gray-700
          focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2
          transition-colors duration-200
        "
        aria-label="選擇語系"
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span>{languages.find((l) => l.code === currentLang)?.label}</span>
        <svg
          className={`w-4 h-4 transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <div className="
          absolute top-full right-0 mt-2
          w-40
          bg-white dark:bg-gray-800
          border border-gray-200 dark:border-gray-700
          rounded-lg
          shadow-lg
          overflow-hidden
          z-50
        ">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleSelectLanguage(lang.code)}
              className={`
                w-full
                px-4 py-2
                text-left
                text-sm
                flex items-center gap-2
                transition-colors duration-200
                ${
                  currentLang === lang.code
                    ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                }
              `}
            >
              <span>{lang.label}</span>
              {currentLang === lang.code && (
                <svg
                  className="w-4 h-4 ml-auto"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}


"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { getFilteredMenus } from "@/lib/services/menuService";
import type { MainMenu, MenuItem } from "@/types/menu";

/**
 * 主選單元件（直向展開下拉選單）
 * 
 * 符合規格：2.1 全域 UI 框架、2.5 主選單與模組導覽
 * - 使用「直向展開下拉選單」方式進行設計
 * - 根據登入者角色權限，僅顯示可使用選項
 * - 支援三層選單展開
 */
export default function MainMenu() {
  const [menus, setMenus] = useState<MainMenu[]>([]);
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [openItemIds, setOpenItemIds] = useState<Set<string>>(new Set());
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  // 載入過濾後的主選單
  useEffect(() => {
    const filteredMenus = getFilteredMenus();
    setMenus(filteredMenus);
  }, []);

  // 點擊外部關閉選單
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null);
        setOpenItemIds(new Set());
      }
    };

    if (openMenuId) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [openMenuId]);

  const handleMenuClick = (menuId: string) => {
    if (openMenuId === menuId) {
      setOpenMenuId(null);
      setOpenItemIds(new Set());
    } else {
      setOpenMenuId(menuId);
      setOpenItemIds(new Set());
    }
  };
  // 路由變更時自動收合下拉
  useEffect(() => {
    if (openMenuId) {
      setOpenMenuId(null);
      setOpenItemIds(new Set());
    }
    // eslint-disable-next-line react/no-unknown-property
  }, [pathname]);

  const toggleItemOpen = (itemId: string) => {
    setOpenItemIds((prev) => {
      const next = new Set(prev);
      if (next.has(itemId)) next.delete(itemId);
      else next.add(itemId);
      return next;
    });
  };

  const renderMenuItem = (item: MenuItem, level: number = 0) => {
    const hasChildren = item.children && item.children.length > 0;
    const isOpen = openItemIds.has(item.id);
    const isActive = item.path === pathname;

    const paddingClass = level === 0 ? "" : level === 1 ? "ml-4" : "ml-8";

    if (hasChildren) {
      return (
        <div key={item.id} className={`relative ${paddingClass}`}>
          <button
            onClick={() => toggleItemOpen(item.id)}
            className={`
              w-full
              px-4 py-2
              text-left
              text-sm font-medium
              rounded-button
              transition-colors duration-200
              flex items-center justify-between
              ${isOpen ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300" : "text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-primary-900/20"}
            `}
          >
            <span>{item.label}</span>
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
            <div className="mt-1 space-y-1">
              {item.children!.map((child) => renderMenuItem(child, level + 1))}
            </div>
          )}
        </div>
      );
    }

    if (item.path) {
      return (
        <Link
          key={item.id}
          href={item.path}
          className={`
            block
            px-4 py-2
            text-sm
            rounded-button
            transition-colors duration-200
            ${paddingClass}
            ${isActive ? "bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 font-medium" : "text-gray-700 dark:text-gray-200 hover:bg-primary-50 dark:hover:bg-primary-900/20 hover:text-primary-700"}
          `}
          onClick={() => {
            setOpenMenuId(null);
            setOpenItemIds(new Set());
          }}
        >
          {item.label}
        </Link>
      );
    }

    return null;
  };

  if (menus.length === 0) {
    return null;
  }

  return (
    <div className="flex items-center gap-2" ref={menuRef}>
      {menus.map((menu) => {
        const isOpen = openMenuId === menu.id;
        return (
          <div key={menu.id} className="relative">
            <button
              onClick={() => handleMenuClick(menu.id)}
              className={`
                px-4 py-2
                text-sm font-medium
                rounded-button
                transition-colors duration-200
                flex items-center gap-2
                ${
                  isOpen
                    ? "bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300"
                    : "text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700"
                }
              `}
              aria-expanded={isOpen}
              aria-haspopup="true"
            >
              <span>{menu.label}</span>
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

            {/* 下拉選單 */}
            {isOpen && (
              <div className="
                absolute
                top-full
                left-0
                mt-2
                w-72
                bg-white dark:bg-gray-800
                border border-gray-200 dark:border-gray-700
                rounded-lg
                shadow-lg
                z-50
                max-h-[80vh]
                overflow-y-auto
              ">
                <div className="p-2 space-y-1">
                  {menu.items.map((item) => renderMenuItem(item))}
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}


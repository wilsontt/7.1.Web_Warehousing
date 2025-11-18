import { MAIN_MENUS, type MainMenu, type MenuItem } from "@/types/menu";
import { getUserInfo } from "@/lib/api/auth";
import type { UserInfo } from "@/types/auth";

/**
 * 檢查使用者是否有權限存取選單項目
 */
function hasPermission(
  item: MenuItem | MainMenu,
  userInfo: UserInfo | null
): boolean {
  if (!userInfo) {
    return false;
  }

  // 檢查角色權限
  if (item.requiredRoles && item.requiredRoles.length > 0) {
    const hasRequiredRole = item.requiredRoles.some((role) =>
      userInfo.roles.includes(role)
    );
    if (!hasRequiredRole) {
      return false;
    }
  }

  // 檢查功能權限
  if (item.requiredPermissions && item.requiredPermissions.length > 0) {
    const hasRequiredPermission = item.requiredPermissions.some(
      (permission) => userInfo.permissions.includes(permission)
    );
    if (!hasRequiredPermission) {
      return false;
    }
  }

  return true;
}

/**
 * 過濾選單項目（遞迴）
 */
function filterMenuItems(
  items: MenuItem[],
  userInfo: UserInfo | null
): MenuItem[] {
  return items
    .filter((item) => hasPermission(item, userInfo))
    .map((item) => {
      if (item.children && item.children.length > 0) {
        return {
          ...item,
          children: filterMenuItems(item.children, userInfo),
        };
      }
      return item;
    })
    .filter((item) => {
      // 如果有子項目，至少要有一個子項目有權限才顯示
      if (item.children && item.children.length > 0) {
        return item.children.length > 0;
      }
      return true;
    });
}

/**
 * 取得過濾後的主選單（根據使用者權限）
 * 
 * 符合規格：2.5 主選單與模組導覽
 * - 根據登入者角色權限，僅顯示可使用選項
 */
export function getFilteredMenus(): MainMenu[] {
  const userInfo = getUserInfo();

  return MAIN_MENUS.filter((menu) => hasPermission(menu, userInfo)).map(
    (menu) => ({
      ...menu,
      items: filterMenuItems(menu.items, userInfo),
    })
  );
}

/**
 * 取得所有主選單（不過濾權限，用於管理）
 */
export function getAllMenus(): MainMenu[] {
  return MAIN_MENUS;
}

/**
 * 根據路徑尋找選單項目
 */
export function findMenuItemByPath(
  path: string,
  menus: MainMenu[] = MAIN_MENUS
): MenuItem | null {
  for (const menu of menus) {
    for (const item of menu.items) {
      const found = findItemRecursive(item, path);
      if (found) {
        return found;
      }
    }
  }
  return null;
}

function findItemRecursive(item: MenuItem, path: string): MenuItem | null {
  if (item.path === path) {
    return item;
  }

  if (item.children) {
    for (const child of item.children) {
      const found = findItemRecursive(child, path);
      if (found) {
        return found;
      }
    }
  }

  return null;
}


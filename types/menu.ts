/**
 * 主選單資料結構
 * 
 * 符合規格：2.5 主選單與模組導覽
 */

export interface MenuItem {
  id: string;
  label: string;
  labelEn?: string;
  path?: string;
  icon?: string;
  children?: MenuItem[];
  requiredPermissions?: string[]; // 需要的權限
  requiredRoles?: string[]; // 需要的角色
}

export interface MainMenu {
  id: string;
  label: string;
  labelEn: string;
  icon?: string;
  items: MenuItem[];
  requiredPermissions?: string[];
  requiredRoles?: string[];
}

/**
 * 八大主選單
 */
export const MAIN_MENUS: MainMenu[] = [
  {
    id: "basic-operations",
    label: "基本作業",
    labelEn: "Basic Operations",
    items: [
      {
        id: "code-operations",
        label: "代碼作業",
        children: [
          {
            id: "basic-code-maintenance",
            label: "基本代碼維護",
            path: "/basic-operations/code/basic",
          },
          {
            id: "box-item-code-maintenance",
            label: "箱、件代碼維護",
            path: "/basic-operations/code/box-item",
          },
        ],
      },
      {
        id: "employee-data-maintenance",
        label: "員工資料維護",
        path: "/basic-operations/employee",
      },
      {
        id: "customer-data-maintenance",
        label: "客戶資料維護",
        children: [
          {
            id: "customer-basic-data-maintenance",
            label: "客戶基本資料維護",
            path: "/basic-operations/customer/basic",
          },
          {
            id: "customer-group-maintenance",
            label: "客戶群維護",
            path: "/basic-operations/customer/group",
          },
        ],
      },
      {
        id: "warehouse-vehicle-maintenance",
        label: "倉庫、車輛維護",
        children: [
          {
            id: "warehouse-maintenance",
            label: "倉庫維護",
            path: "/basic-operations/warehouse",
          },
          {
            id: "vehicle-maintenance",
            label: "車輛維護",
            path: "/basic-operations/vehicle",
          },
          {
            id: "delivery-area-maintenance",
            label: "收送區域維護",
            path: "/basic-operations/delivery-area",
          },
        ],
      },
      {
        id: "box-data-maintenance",
        label: "箱子資料維護",
        path: "/basic-operations/box",
      },
      {
        id: "basic-charge-operations",
        label: "基本收費作業",
        path: "/basic-operations/charge",
      },
    ],
  },
  {
    id: "routine-operations",
    label: "例行作業",
    labelEn: "Routine Operations",
    items: [
      {
        id: "customer-work-notice",
        label: "客戶工作通知單",
        path: "/routine-operations/customer-work-notice",
      },
      {
        id: "warehouse-work-order",
        label: "倉儲工作單",
        path: "/routine-operations/work-order",
      },
      {
        id: "warehouse-operations",
        label: "倉儲作業",
        children: [
          {
            id: "work-order-dispatch",
            label: "工作單派車作業",
            path: "/routine-operations/dispatch",
          },
          {
            id: "work-order-report",
            label: "工作單上下架/稽核報表",
            path: "/routine-operations/report",
          },
          {
            id: "work-order",
            label: "工作單",
            children: [
              {
                id: "shelf-operation",
                label: "上下架輸入",
                path: "/routine-operations/work-order/shelf",
              },
              {
                id: "audit-input",
                label: "稽核輸入",
                path: "/routine-operations/work-order/audit",
              },
            ],
          },
          {
            id: "outbound-transport",
            label: "出倉車輛運輸單",
            path: "/routine-operations/transport",
          },
        ],
      },
      {
        id: "exchange-operations",
        label: "交換作業",
        children: [
          {
            id: "esun-exchange",
            label: "玉山資料交換作業",
            path: "/routine-operations/exchange/esun",
          },
          {
            id: "ctbc-exchange",
            label: "中信資料交換作業",
            path: "/routine-operations/exchange/ctbc",
          },
        ],
      },
    ],
  },
  {
    id: "inventory-operations",
    label: "庫存作業",
    labelEn: "Inventory Operations",
    items: [
      {
        id: "box-item-inventory-query",
        label: "箱子/物件 即時庫存查詢",
        path: "/inventory-operations/query",
      },
      {
        id: "warehouse-report-barcode",
        label: "倉儲報表及條碼作業",
        children: [
          {
            id: "warehouse-report",
            label: "倉儲報表作業",
            children: [
              {
                id: "warehouse-work-report",
                label: "倉儲工作報表",
                path: "/inventory-operations/report/work",
              },
              {
                id: "box-item-inventory-report",
                label: "箱件即時庫存報表",
                path: "/inventory-operations/report/inventory",
              },
              {
                id: "warehouse-customer-monthly-report",
                label: "倉儲客戶月報統計表",
                path: "/inventory-operations/report/customer-monthly",
              },
              {
                id: "work-order-box-item-statistics",
                label: "工作單箱件統計表",
                path: "/inventory-operations/report/work-order-statistics",
              },
              {
                id: "box-item-daily-monthly-report",
                label: "箱件每日進出月報表",
                path: "/inventory-operations/report/daily-monthly",
              },
              {
                id: "object-box-item-list",
                label: "物件箱物件清單",
                path: "/inventory-operations/report/object-list",
              },
              {
                id: "outbound-transport-report",
                label: "出倉車輛運輸單",
                path: "/inventory-operations/report/transport",
              },
            ],
          },
          {
            id: "barcode-operations",
            label: "條碼作業",
            children: [
              {
                id: "box-custom-barcode",
                label: "箱子自訂條碼列印",
                path: "/inventory-operations/barcode/box",
              },
              {
                id: "item-custom-barcode",
                label: "物件自訂條碼列印",
                path: "/inventory-operations/barcode/item",
              },
              {
                id: "storage-location-barcode",
                label: "儲位條碼列印",
                path: "/inventory-operations/barcode/storage",
              },
              {
                id: "sealed-box-barcode",
                label: "封箱條碼列印",
                path: "/inventory-operations/barcode/sealed",
              },
              {
                id: "shin-kong-special-barcode",
                label: "新光特規條碼列印",
                path: "/inventory-operations/barcode/shin-kong",
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "customer-operations",
    label: "客戶作業",
    labelEn: "Customer Operations",
    items: [
      {
        id: "customer-work-notice",
        label: "客戶工作通知單",
        path: "/customer-operations/work-notice",
      },
      {
        id: "work-notice-audit",
        label: "工作通知單審核作業",
        path: "/customer-operations/work-notice-audit",
      },
      {
        id: "box-item-inventory-query",
        label: "箱子/物件 即時庫存查詢",
        path: "/customer-operations/inventory-query",
      },
      {
        id: "box-item-report-download",
        label: "箱子/物件 倉儲報表下載",
        path: "/customer-operations/report-download",
      },
    ],
  },
  {
    id: "relocation-operations",
    label: "移儲作業",
    labelEn: "Relocation Operations",
    items: [
      {
        id: "relocation-out",
        label: "移出作業",
        children: [
          {
            id: "relocation-out-order",
            label: "移出單作業",
            path: "/relocation-operations/out/order",
          },
          {
            id: "relocation-out-shelf",
            label: "移出下架作業",
            path: "/relocation-operations/out/shelf",
          },
          {
            id: "relocation-out-audit",
            label: "移出稽核作業",
            path: "/relocation-operations/out/audit",
          },
        ],
      },
      {
        id: "relocation-in",
        label: "移入作業",
        children: [
          {
            id: "relocation-in-order",
            label: "移入單作業",
            path: "/relocation-operations/in/order",
          },
          {
            id: "relocation-in-shelf",
            label: "移入下架作業",
            path: "/relocation-operations/in/shelf",
          },
          {
            id: "relocation-in-audit",
            label: "移入稽核作業",
            path: "/relocation-operations/in/audit",
          },
        ],
      },
    ],
  },
  {
    id: "audit-operations",
    label: "稽核作業",
    labelEn: "Audit Operations",
    items: [
      {
        id: "a003-storage-item-audit",
        label: "表A003 存倉物品抽查記錄表",
        path: "/audit-operations/a003",
      },
      {
        id: "a004-warehouse-form-audit",
        label: "表A004 倉庫表單抽查記錄表",
        path: "/audit-operations/a004",
      },
      {
        id: "a005-document-inbound",
        label: "A005文件進倉記錄表",
        path: "/audit-operations/a005",
      },
      {
        id: "inventory-count",
        label: "盤點作業",
        children: [
          {
            id: "inventory-count-order",
            label: "盤點單作業盤點",
            path: "/audit-operations/inventory-count/order",
          },
          {
            id: "inventory-count-initial",
            label: "初盤作業盤點",
            path: "/audit-operations/inventory-count/initial",
          },
          {
            id: "inventory-count-review",
            label: "複盤作業",
            path: "/audit-operations/inventory-count/review",
          },
        ],
      },
    ],
  },
  {
    id: "warehouse-administrative-operations",
    label: "倉儲管理作業",
    labelEn: "Warehouse Administrative Operations",
    items: [
      {
        id: "work-order-maintenance",
        label: "工作單維護",
        children: [
          {
            id: "work-order-master-maintenance",
            label: "工作單主檔維護",
            path: "/warehouse-admin/work-order/master",
          },
          {
            id: "work-order-detail-maintenance",
            label: "工作單明細維護",
            path: "/warehouse-admin/work-order/detail",
          },
        ],
      },
      {
        id: "relocation-order-maintenance",
        label: "移儲單維護",
        children: [
          {
            id: "relocation-out-order-maintenance",
            label: "移出單維護",
            path: "/warehouse-admin/relocation/out",
          },
          {
            id: "relocation-in-order-maintenance",
            label: "移入單維護",
            path: "/warehouse-admin/relocation/in",
          },
        ],
      },
      {
        id: "inventory-count-order-maintenance",
        label: "盤點單維護",
        path: "/warehouse-admin/inventory-count",
      },
      {
        id: "document-audit",
        label: "各種單據主管審核",
        children: [
          {
            id: "notice-cancel-audit",
            label: "通知單取消審核",
            path: "/warehouse-admin/audit/notice-cancel",
          },
          {
            id: "relocation-cancel-audit",
            label: "移出/移入單取消審核",
            path: "/warehouse-admin/audit/relocation-cancel",
          },
          {
            id: "inventory-count-cancel-audit",
            label: "盤點單取消審核",
            path: "/warehouse-admin/audit/inventory-count-cancel",
          },
        ],
      },
      {
        id: "box-item-inventory-maintenance",
        label: "箱子/物件 庫存維護",
        path: "/warehouse-admin/inventory-maintenance",
      },
    ],
  },
  {
    id: "system-administration",
    label: "系統管理作業",
    labelEn: "System Administration Operations",
    requiredRoles: ["admin"], // 僅管理員可見
    items: [
      {
        id: "system-admin-account",
        label: "系統管理者帳號設定",
        path: "/system-admin/account",
        requiredRoles: ["admin"],
      },
      {
        id: "system-parameters",
        label: "系統參數設定",
        children: [
          {
            id: "notification-settings",
            label: "通知方式",
            path: "/system-admin/parameters/notification",
          },
          {
            id: "multi-language-maintenance",
            label: "多語系維護",
            path: "/system-admin/parameters/language",
          },
        ],
        requiredRoles: ["admin"],
      },
      {
        id: "customer-user-settings",
        label: "客戶使用者設定",
        path: "/system-admin/customer-user",
        requiredRoles: ["admin"],
      },
      {
        id: "user-role-settings",
        label: "使用者帳號角色設定",
        path: "/system-admin/user-role",
        requiredRoles: ["admin"],
      },
      {
        id: "system-permission-control",
        label: "系統權限控管設定",
        children: [
          {
            id: "group-permission-settings",
            label: "群組權限設定",
            path: "/system-admin/permission/group",
          },
          {
            id: "user-group-settings",
            label: "使用者群組設定",
            path: "/system-admin/permission/user-group",
          },
          {
            id: "function-menu-settings",
            label: "功能選單設定",
            path: "/system-admin/permission/menu",
          },
        ],
        requiredRoles: ["admin"],
      },
      {
        id: "data-exchange-maintenance",
        label: "資料交換作業維護",
        path: "/system-admin/data-exchange",
        requiredRoles: ["admin"],
      },
      {
        id: "email-notification-maintenance",
        label: "郵件通知作業維護",
        path: "/system-admin/email-notification",
        requiredRoles: ["admin"],
      },
      {
        id: "latest-message-notification",
        label: "最新訊息通知",
        path: "/system-admin/message",
        requiredRoles: ["admin"],
      },
      {
        id: "system-status-test",
        label: "系統狀態與測試",
        path: "/system-admin/status-test",
        requiredRoles: ["admin"],
      },
      {
        id: "system-operation-log",
        label: "系統操作紀錄",
        path: "/system-admin/operation-log",
        requiredRoles: ["admin"],
      },
    ],
  },
];


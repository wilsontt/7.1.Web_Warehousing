/**
 * Dashboard Mock 資料
 * 
 * 符合規格：2.4 Dashboard
 */

export interface TaskOverview {
  incompleteOrders: number;
  pendingShipments: number;
  pendingAudits: number;
}

export interface WarehouseInventory {
  totalBoxes: number;
  usageRate: number;
  abnormalCount: number;
}

export interface Notification {
  id: string;
  type: "announcement" | "alert" | "update";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export interface WarehouseInfo {
  id: string;
  name: string;
  capacity: number;
  used: number;
  borrowed: number;
  todayStatus: string;
}

export interface VehicleStatus {
  id: string;
  route: string;
  status: "in-transit" | "delivered" | "returning";
  location: string;
  estimatedArrival: string;
}

export interface Top10Item {
  id: string;
  name: string;
  value: number;
  unit: string;
}

export interface ChartData {
  labels: string[];
  values: number[];
}

export interface DashboardData {
  taskOverview: TaskOverview;
  warehouseInventory: WarehouseInventory;
  notifications: Notification[];
  warehouses: WarehouseInfo[];
  vehicleStatuses: VehicleStatus[];
  top10Overdue: Top10Item[];
  top10Storage: Top10Item[];
  chartData: ChartData;
}

/**
 * 產生 Mock Dashboard 資料
 */
export function generateMockDashboardData(): DashboardData {
  return {
    taskOverview: {
      incompleteOrders: 15,
      pendingShipments: 8,
      pendingAudits: 3,
    },
    warehouseInventory: {
      totalBoxes: 1250,
      usageRate: 78.5,
      abnormalCount: 5,
    },
    notifications: [
      {
        id: "1",
        type: "announcement",
        title: "系統維護通知",
        message: "系統將於本週六進行例行維護，預計停機時間為 02:00-04:00",
        timestamp: new Date().toISOString(),
        read: false,
      },
      {
        id: "2",
        type: "alert",
        title: "異常提醒",
        message: "倉庫 A 發現 2 筆異常資料，請儘速處理",
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        read: false,
      },
      {
        id: "3",
        type: "update",
        title: "系統更新",
        message: "系統已更新至 v2.1.0，新增多項功能優化",
        timestamp: new Date(Date.now() - 86400000).toISOString(),
        read: true,
      },
    ],
    warehouses: [
      {
        id: "WH001",
        name: "倉庫 A",
        capacity: 1000,
        used: 785,
        borrowed: 50,
        todayStatus: "正常",
      },
      {
        id: "WH002",
        name: "倉庫 B",
        capacity: 800,
        used: 620,
        borrowed: 30,
        todayStatus: "正常",
      },
      {
        id: "WH003",
        name: "倉庫 C",
        capacity: 600,
        used: 450,
        borrowed: 20,
        todayStatus: "注意",
      },
    ],
    vehicleStatuses: [
      {
        id: "V001",
        route: "路線 A - 台北市區",
        status: "in-transit",
        location: "信義區",
        estimatedArrival: "14:30",
      },
      {
        id: "V002",
        route: "路線 B - 新北市區",
        status: "delivered",
        location: "板橋區",
        estimatedArrival: "已完成",
      },
      {
        id: "V003",
        route: "路線 C - 桃園市區",
        status: "returning",
        location: "中壢區",
        estimatedArrival: "16:00",
      },
    ],
    top10Overdue: [
      { id: "1", name: "客戶 A", value: 125, unit: "箱" },
      { id: "2", name: "客戶 B", value: 98, unit: "箱" },
      { id: "3", name: "客戶 C", value: 87, unit: "箱" },
      { id: "4", name: "客戶 D", value: 76, unit: "箱" },
      { id: "5", name: "客戶 E", value: 65, unit: "箱" },
      { id: "6", name: "客戶 F", value: 54, unit: "箱" },
      { id: "7", name: "客戶 G", value: 43, unit: "箱" },
      { id: "8", name: "客戶 H", value: 32, unit: "箱" },
      { id: "9", name: "客戶 I", value: 21, unit: "箱" },
      { id: "10", name: "客戶 J", value: 15, unit: "箱" },
    ],
    top10Storage: [
      { id: "1", name: "客戶 A", value: 1250, unit: "箱" },
      { id: "2", name: "客戶 B", value: 980, unit: "箱" },
      { id: "3", name: "客戶 C", value: 870, unit: "箱" },
      { id: "4", name: "客戶 D", value: 760, unit: "箱" },
      { id: "5", name: "客戶 E", value: 650, unit: "箱" },
      { id: "6", name: "客戶 F", value: 540, unit: "箱" },
      { id: "7", name: "客戶 G", value: 430, unit: "箱" },
      { id: "8", name: "客戶 H", value: 320, unit: "箱" },
      { id: "9", name: "客戶 I", value: 210, unit: "箱" },
      { id: "10", name: "客戶 J", value: 150, unit: "箱" },
    ],
    chartData: {
      labels: ["1月", "2月", "3月", "4月", "5月", "6月"],
      values: [120, 150, 180, 200, 220, 250],
    },
  };
}


"use client";

import type { VehicleStatus } from "@/lib/mocks/dashboardMock";

interface VehicleStatusWidgetProps {
  vehicles: VehicleStatus[];
}

/**
 * 車輛派送即時狀況 Widget
 * 
 * 符合規格：2.4 Dashboard
 * - 今日車輛派送路線及收送貨即時狀況
 */
export default function VehicleStatusWidget({
  vehicles,
}: VehicleStatusWidgetProps) {
  const getStatusColor = (status: VehicleStatus["status"]) => {
    switch (status) {
      case "in-transit":
        return "text-blue-600 dark:text-blue-400";
      case "delivered":
        return "text-green-600 dark:text-green-400";
      case "returning":
        return "text-yellow-600 dark:text-yellow-400";
    }
  };

  const getStatusLabel = (status: VehicleStatus["status"]) => {
    switch (status) {
      case "in-transit":
        return "運送中";
      case "delivered":
        return "已送達";
      case "returning":
        return "回程中";
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        車輛派送即時狀況
      </h2>
      <div className="space-y-3">
        {vehicles.map((vehicle) => (
          <div
            key={vehicle.id}
            className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-medium text-gray-900 dark:text-white">
                {vehicle.route}
              </span>
              <span className={`text-sm font-medium ${getStatusColor(vehicle.status)}`}>
                {getStatusLabel(vehicle.status)}
              </span>
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              <p>位置：{vehicle.location}</p>
              <p>預計到達：{vehicle.estimatedArrival}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


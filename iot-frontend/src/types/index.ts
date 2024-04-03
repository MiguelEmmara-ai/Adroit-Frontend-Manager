// TypeScript type definitions can be placed here to ensure type safety throughout the codebase.

interface DynamicMetricData {
  client_name: string;
  client_id: string;
  device_id: string;
  device_key: string;
  [key: string]: string | { timestamp: number; value: string } | undefined;
}

interface SpinnerProps {
  className?: string; // Optional string prop
}

interface HeaderProps {
  fetchDataAndUpdate?: () => Promise<void>;
  searchById?: string;
  setSearchById?: (value: string) => void;
  searchByClientName?: string;
  setSearchByClientName?: (value: string) => void;
  totalDevicesOfflineCount?: number;
  clientsOfflineCount?: number;
}

interface RequestBody {
  to: string
  subject: string
  message: string
  deviceData: DynamicMetricData
}

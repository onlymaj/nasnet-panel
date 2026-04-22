import { mockApi, mockStore, getProtocolOptions } from '@nasnet/mocks';
import { scanner } from './scanner';

export const api = {
  ...mockApi,
  scanner,
};
export const store = mockStore;
export { getProtocolOptions };
export {
  verifyIP,
  testCredentials,
  type VerifyResponse,
  type RouterOSVerifyInfo,
  type RouterSystemInfo,
} from './scanner';
export {
  fetchSystemInfo,
  fetchSystemResources,
  fetchDHCPLeases,
  fetchSystemOverview,
  fetchDynamicOverview,
  fetchInterfaceTraffic,
  fetchInterfaces,
  fetchVPNClients,
  type SystemCredentials,
  type SystemInfoResponse,
  type ResourceInfoResponse,
  type DHCPLeaseResponse,
  type DynamicOverview,
  type InterfaceTrafficResponse,
  type InterfaceResponse,
} from './system';
export { ApiError } from './http';
export { isAbortError } from './abort';
export { BACKEND_URL } from './config';

export type * from '@nasnet/mocks';

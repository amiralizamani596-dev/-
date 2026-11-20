const rawBase = (import.meta.env.VITE_API_BASE_URL || '').trim()

export const APP_CONFIG = {
  /**
   * mock  - current frontend-only behavior (default, safe baseline)
   * api   - connect UI to a real backend
   */
  dataMode: (import.meta.env.VITE_DATA_MODE || 'mock').toLowerCase(),
  /**
   * API base URL used in api mode.
   * Empty string => same-origin requests (works with Vite dev proxy: /api -> backend)
   */
  apiBaseUrl: rawBase.replace(/\/+$/, ''),
}

export const isMockMode = APP_CONFIG.dataMode !== 'api'

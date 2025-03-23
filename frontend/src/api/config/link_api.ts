const HOSTNAME = import.meta.env.VITE_HOSTNAME;
const WEB_LINK = import.meta.env.VITE_WEB_LINK;

export const API_URL = {
  BASE_URL: HOSTNAME,
  CONTENT_TYPE: { 'Content-Type': 'application/json; charset=utf-8' },
  HAND_SHAKE: `/handshake`,
  GET_DASHBOARD: `/${WEB_LINK}/dashboard`,
  GET_DEVICE_STATUS: `/${WEB_LINK}/status`,
  LOGIN: `/login`,
  LOGOUT: `/logout`,
  GET_PRODUCTION: `/${WEB_LINK}/production`,
  POST_PRODUCTION_UPDATE: `/${WEB_LINK}/production/update`,
  POST_PRODUCTION_DELETE: `/${WEB_LINK}/production/delete`,
  GET_PRODUCT_LISTS: `/${WEB_LINK}/productLists`,
  GET_MACHINE_LISTS: `/${WEB_LINK}/machineLists`,
  GET_DETAILS: `/${WEB_LINK}/details`,
};

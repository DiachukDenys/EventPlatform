import axios from 'axios';
import { enqueueSnackbar } from 'notistack';   // або ваш Toast

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  withCredentials: true,
});

/* 👉 відповіді */
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const { status, data } = err.response || {};
    /* кастомні реакції */
    if (status === 401) {
      enqueueSnackbar('Сесія закінчилась. Увійдіть заново.', { variant: 'warning' });
      window.location.href = '/login';
    } else if (status >= 500) {
      enqueueSnackbar(data?.message || 'Помилка сервера', { variant: 'error' });
    } else {
      enqueueSnackbar(data?.message || 'Помилка запиту', { variant: 'error' });
    }
    return Promise.reject(err);
  }
);

export default api;
export { api as axios };
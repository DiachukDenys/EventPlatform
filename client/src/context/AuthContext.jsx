// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeRole, setActiveRole] = useState(null);

  /* -------------------------------------------------- */
  /* helpers                                            */
  /* -------------------------------------------------- */

  /** Завантажує дані поточного користувача із cookie‑токеном */
  const fetchMe = async () => {
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/api/auth/me`,
        { withCredentials: true }
      );
      setUser(data.user);
    } catch {
      setUser(null);
    }
  };

  /** Публічний метод – можна викликати після PATCH‑ів */
  const refreshUser = async () => {
    await fetchMe();
  };

  /* -------------------------------------------------- */
  /* ініціалізація                                      */
  /* -------------------------------------------------- */

  useEffect(() => {
    (async () => {
      await fetchMe();
      setLoading(false);
    })();

    const savedRole = Cookies.get('activeRole');
    if (savedRole) setActiveRole(savedRole);
  }, []);

  /* -------------------------------------------------- */
  /* auth actions                                       */
  /* -------------------------------------------------- */

  const changeRole = (role) => {
    setActiveRole(role);
    Cookies.set('activeRole', role);
  };

  const register = async (payload) => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/register`,
        payload,
        { withCredentials: true }
      );
      setUser(data.user);
      return true;
    } catch { return false; }
  };

  const login = async (payload) => {
    try {
      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/login`,
        payload,
        { withCredentials: true }
      );
      setUser(data.user);
      return true;
    } catch { return false; }
  };

  const logout = async () => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/logout`,
        {},
        { withCredentials: true }
      );
    } catch {/* ignore */}
    setUser(null);
  };

  const uploadPhoto = async (file) => {
    try {
      const formData = new FormData();
      formData.append('photo', file);

      const { data } = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/upload-photo`,
        formData,
        {
          withCredentials: true,
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      setUser((p) => ({ ...p, photo: data.photo }));
    } catch (err) {
      console.error('Помилка при завантаженні фото:', err);
    }
  };

  /* -------------------------------------------------- */
  /* render                                             */
  /* -------------------------------------------------- */

  if (loading) return null; // тут можна вставити спінер

  return (
    <AuthContext.Provider
      value={{
        user,
        register,
        login,
        logout,
        setUser,
        uploadPhoto,
        activeRole,
        changeRole,
        refreshUser,      // ← додаємо у контекст
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

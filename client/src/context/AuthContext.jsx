 import { createContext, useContext, useEffect, useReducer } from "react";
import { getProfile } from "../services/authService";

const AuthContext = createContext();

const initialState = {
  user: null,
  token: localStorage.getItem("token") || null,
  isAuthenticated: !!localStorage.getItem("token"),
  loading: true,
};

const authReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };

    case "LOGIN_SUCCESS":
      localStorage.setItem("token", action.payload.token);
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        loading: false,
      };

    case "LOAD_USER":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        loading: false,
      };

    case "LOGOUT":
      localStorage.removeItem("token");
      return {
        user: null,
        token: null,
        isAuthenticated: false,
        loading: false,
      };

    default:
      return state;
  }
};

export const AuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);



  const loadUser = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      dispatch({ type: "SET_LOADING", payload: false });
      return;
    }

    try {
      const user = await getProfile();
      dispatch({ type: "LOAD_USER", payload: user });
    } catch (error) {
      localStorage.removeItem("token");
      dispatch({ type: "LOGOUT" });
      console.log(error)
    }
  };
    useEffect(() => {
    loadUser();
  }, []);

  return (
    <AuthContext.Provider value={{ state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthContext);
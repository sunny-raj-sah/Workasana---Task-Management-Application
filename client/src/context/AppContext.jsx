 import { createContext, useContext, useReducer } from "react";

const AppContext = createContext();

const initialState = {
  projects: [],
  tasks: [],
  teams: [],
  users: [],
  tags: [],
  loading: false,
};

const appReducer = (state, action) => {
  switch (action.type) {
    case "SET_LOADING":
      return { ...state, loading: action.payload };

    case "SET_PROJECTS":
      return { ...state, projects: action.payload };

    case "ADD_PROJECT":
      return {
        ...state,
        projects: [action.payload, ...state.projects],
      };

    case "REMOVE_PROJECT":
      return {
        ...state,
        projects: state.projects.filter((p) => p._id !== action.payload),
      };

    default:
      return state;
  }
};

export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useApp = () => useContext(AppContext);
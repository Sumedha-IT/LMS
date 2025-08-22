import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import { clearAllCache, cancelAllRequests, getCacheStats } from '../utils/api';

// Action types
const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
  SET_USER_DATA: 'SET_USER_DATA',
  SET_NAVIGATION_STATE: 'SET_NAVIGATION_STATE',
  CLEAR_CACHE: 'CLEAR_CACHE',
  CANCEL_REQUESTS: 'CANCEL_REQUESTS',
  UPDATE_CACHE_STATS: 'UPDATE_CACHE_STATS'
};

// Initial state
const initialState = {
  loading: false,
  error: null,
  userData: null,
  navigationState: {
    currentRoute: null,
    previousRoute: null,
    routeHistory: []
  },
  cacheStats: {
    pendingRequests: 0,
    cachedRequests: 0,
    totalRequests: 0
  }
};

// Reducer function
const appReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    
    case ACTIONS.SET_ERROR:
      return {
        ...state,
        error: action.payload
      };
    
    case ACTIONS.SET_USER_DATA:
      return {
        ...state,
        userData: action.payload
      };
    
    case ACTIONS.SET_NAVIGATION_STATE:
      return {
        ...state,
        navigationState: {
          ...state.navigationState,
          ...action.payload
        }
      };
    
    case ACTIONS.CLEAR_CACHE:
      return {
        ...state,
        cacheStats: {
          pendingRequests: 0,
          cachedRequests: 0,
          totalRequests: 0
        }
      };
    
    case ACTIONS.UPDATE_CACHE_STATS:
      return {
        ...state,
        cacheStats: action.payload
      };
    
    default:
      return state;
  }
};

// Create context
const AppContext = createContext();

// Provider component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Update cache stats periodically
  useEffect(() => {
    const updateCacheStats = () => {
      const stats = getCacheStats();
      dispatch({ type: ACTIONS.UPDATE_CACHE_STATS, payload: stats });
    };

    // Update immediately
    updateCacheStats();

    // Update every 5 seconds
    const interval = setInterval(updateCacheStats, 5000);

    return () => clearInterval(interval);
  }, []);

  // Clear cache function
  const clearCache = useCallback(() => {
    clearAllCache();
    dispatch({ type: ACTIONS.CLEAR_CACHE });
  }, []);

  // Cancel requests function
  const cancelRequests = useCallback(() => {
    cancelAllRequests();
    dispatch({ type: ACTIONS.UPDATE_CACHE_STATS, payload: getCacheStats() });
  }, []);

  // Set loading state
  const setLoading = useCallback((loading) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: loading });
  }, []);

  // Set error state
  const setError = useCallback((error) => {
    dispatch({ type: ACTIONS.SET_ERROR, payload: error });
  }, []);

  // Set user data
  const setUserData = useCallback((userData) => {
    dispatch({ type: ACTIONS.SET_USER_DATA, payload: userData });
  }, []);

  // Update navigation state
  const updateNavigationState = useCallback((navigationState) => {
    dispatch({ type: ACTIONS.SET_NAVIGATION_STATE, payload: navigationState });
  }, []);

  // Context value
  const value = {
    ...state,
    clearCache,
    cancelRequests,
    setLoading,
    setError,
    setUserData,
    updateNavigationState
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};

// Custom hook to use the context
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

// Hook for managing route changes
export const useRouteChange = () => {
  const { navigationState, updateNavigationState } = useAppContext();

  const handleRouteChange = useCallback((newRoute) => {
    // Only update if the route has actually changed
    if (navigationState.currentRoute !== newRoute) {
      updateNavigationState({
        previousRoute: navigationState.currentRoute,
        currentRoute: newRoute,
        routeHistory: [
          ...navigationState.routeHistory.slice(-9), // Keep last 10 routes
          newRoute
        ]
      });
    }
  }, [navigationState.currentRoute, navigationState.routeHistory, updateNavigationState]);

  return {
    currentRoute: navigationState.currentRoute,
    previousRoute: navigationState.previousRoute,
    routeHistory: navigationState.routeHistory,
    handleRouteChange
  };
};

// Hook for managing global loading state
export const useGlobalLoading = () => {
  const { loading, setLoading } = useAppContext();

  const startLoading = useCallback(() => {
    setLoading(true);
  }, [setLoading]);

  const stopLoading = useCallback(() => {
    setLoading(false);
  }, [setLoading]);

  return {
    loading,
    startLoading,
    stopLoading
  };
};

// Hook for managing global error state
export const useGlobalError = () => {
  const { error, setError } = useAppContext();

  const setGlobalError = useCallback((error) => {
    setError(error);
  }, [setError]);

  const clearGlobalError = useCallback(() => {
    setError(null);
  }, [setError]);

  return {
    error,
    setGlobalError,
    clearGlobalError
  };
};

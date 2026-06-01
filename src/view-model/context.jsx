import React, { createContext, useContext } from 'react';

const SlideViewModelContext = createContext(null);

export function SlideViewModelProvider({ value, children }) {
  return (
    <SlideViewModelContext.Provider value={value}>
      {children}
    </SlideViewModelContext.Provider>
  );
}

export function useSlideViewModel() {
  return useContext(SlideViewModelContext);
}

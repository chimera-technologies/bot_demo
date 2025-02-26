import { createContext, useContext, useState,useMemo } from "react";
import PropTypes from "prop-types";
// Create Context
const MenuContext = createContext();

// Context Provider
export const MenuProvider = ({ children }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const contextValue = useMemo(
    () => ({
      isMenuOpen,
      setIsMenuOpen,
    }),
    [isMenuOpen, setIsMenuOpen]
  );

  return (
    <MenuContext.Provider value={contextValue}>{children}</MenuContext.Provider>
  );
};

// Custom Hook for easier usage
export const useMenu = () => useContext(MenuContext);

MenuProvider.propTypes = { children: PropTypes.node.isRequired };

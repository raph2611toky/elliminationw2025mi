import { createContext, useContext, useState } from "react";

const CharacterCustomizationContext = createContext({});

export const CameraModes = {
  FREE: "FREE",
  HEAD: "HEAD",
  TOP: "TOP",
  BOTTOM: "BOTTOM",
};

export const CharacterCustomizationProvider = ({ children }) => {
 
  const [characterMode,
    setCharacterMode] = useState("PRO");
  const [characterGender, setCharacterGender] = useState("male");
  
  return (
    <CharacterCustomizationContext.Provider
      value={{
        
        characterGender, 
        setCharacterGender,
        characterMode,
        setCharacterMode
      }}
    >
      {children}
      
    </CharacterCustomizationContext.Provider>
  );
};

export const useCharacterCustomization = () => {
  return useContext(CharacterCustomizationContext);
};


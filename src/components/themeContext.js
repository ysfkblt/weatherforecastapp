import { createContext } from "react";

// This file is used to create the theme context and export it
// The themeContextWrapper.js file is used to wrap the components in the ThemeContext.Provider

export const themes = {
  dark: "",
  light: "white-content",
};

// Here we are creating the theme context and exporting it so that it can be used in other files to provide the theme to the components
export const ThemeContext = createContext({
  theme: themes.dark, // default value
  changeTheme: () => {},
});

// export default ThemeContext

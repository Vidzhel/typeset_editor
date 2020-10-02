import React from "react";
import { Editor } from "./features/Editor";
import { createGlobalStyle, ThemeProvider } from "styled-components";

const GlobalStyles = createGlobalStyle`
    .container {
      max-width: 100% !important;
      padding: 0;
  }
  
  input[type=checkbox], input[type=radio] {
    display: none;
  }
`;

const theme = {
  breakpoints: {
    sm: "576px",
    md: "768px",
    lg: "992px",
    xl: "1200px",
  },
};

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <Editor />
    </ThemeProvider>
  );
}

export default App;

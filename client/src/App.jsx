import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./responsive.css";
import { BrowserRouter } from "react-router-dom";
import MyContextProvider from "./Context/MyContextProvider.jsx";
import Layout from "./Layout/Layout.jsx";



function App() {
  return (
    <BrowserRouter>
      <MyContextProvider>
        <Layout />
      </MyContextProvider>
    </BrowserRouter>
  );
}

export default App;

import "./index.css";
import App from "./App";
import AuthProvider from "./context/AuthContext";
import * as ReactDOM from "react-dom/client";


// @ts-ignore
ReactDOM.createRoot(document.getElementById("root")).render(
    <AuthProvider>
        <App />
    </AuthProvider>
);

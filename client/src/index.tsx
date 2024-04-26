import "./index.css";
import * as ReactDOM from "react-dom/client";
import App from "./App";
import AuthProvider from "./context/AuthContext";

// @ts-ignore
ReactDOM.createRoot(document.getElementById("root")).render(
    <AuthProvider>
        <App />
    </AuthProvider>,
);

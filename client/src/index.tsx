import React, { createContext } from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import Store from "../src/api/store/store.tsx";

const store = new Store();

export const Context = createContext<{ store: Store }>({ store })

const root = ReactDOM.createRoot(document.getElementById('root')!);
root.render(
    <Context.Provider value={{store}}>
        <App />
    </Context.Provider>
);

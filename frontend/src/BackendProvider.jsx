import { createContext } from "react";

const backendContext = createContext();

function BackendProvider({ children }) {
    const url = "http://localhost:5000";
    // const url="https://chatapp-q0p1.onrender.com";
    return (
        <backendContext.Provider value={url}>
            {children}
        </backendContext.Provider>
    );
}

export default BackendProvider;
export { backendContext };

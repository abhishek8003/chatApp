import { createContext } from "react";

const backendContext=createContext();
function BackendProvider({children}){
    let url="https://chatapp-q0p1.onrender.com";
    <backendContext.Provider value={url}>
        {children}
    </backendContext.Provider>
}
export default BackendProvider;
export {backendContext};
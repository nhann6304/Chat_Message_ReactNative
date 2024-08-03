import { createContext, useState, ReactNode } from "react";

export const GlobalContext = createContext<{
    showCountMessage: number;
    setShowCountMessage: (value: number) => void;
}>({
    showCountMessage: 0,
    setShowCountMessage: () => { },
});

interface GlobalStateProps {
    children: ReactNode;
}

function GlobalState({ children }: GlobalStateProps) {
    const [showCountMessage, setShowCountMessage] = useState<number>(0);

    return (
        <GlobalContext.Provider
            value={{
                showCountMessage,
                setShowCountMessage,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
}

export default GlobalState;

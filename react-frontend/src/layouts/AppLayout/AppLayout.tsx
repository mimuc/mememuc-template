import {ReactNode} from "react";

type AppLayoutProps = {
    children: ReactNode
}

export const AppLayout = ({children}: AppLayoutProps) => {
    return (
        <>
            {children}
        </>
    );
}
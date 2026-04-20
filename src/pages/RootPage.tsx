import { Outlet } from "react-router-dom";

export default function RootPage() {
    return (
        <>
            <main>
                <Outlet />
            </main>
        </>
    );
}

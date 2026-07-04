import { Outlet } from "react-router-dom"
import Navbar from "./Navbar"

Outlet

function LayOut() {
    return (<>
        <Navbar />
        <Outlet />
    </>)
}

export default LayOut
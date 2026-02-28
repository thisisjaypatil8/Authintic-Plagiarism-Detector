import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import PrivateRoute from "../components/PrivateRoute";
import About from "../pages/About";
import Resources from "../pages/Resources";
import Contact from "../pages/Contact";

const router = createBrowserRouter([
    {
        path : "/",
        element : <App/>,
        children : [
            {
                path:"",
                element : <Home/>
            },
            {
                path: "login",
                element: <Login />
            },
            {
                path: "register",
                element: <Register />
            },
            {
                path: "about",
                element: <About />
            },
            {
                path: "resources",
                element: <Resources />
            },
            {
                path: "contact",
                element: <Contact />
            }
        ]
    },
    {
        path: "/dashboard",
        element: (
            <PrivateRoute>
                <Dashboard />
            </PrivateRoute>
        )
    }
])

export default router;
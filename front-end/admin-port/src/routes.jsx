import Error from "./pages/Error";
import Home from "./pages/Home";
import Category from "./pages/Category"
import Login from "./pages/Login";
import Register from "./pages/Register";
import Product from "./pages/Product";
import Search from "./pages/Search";
import PageTemplate from "./components/PageTemplate";
import { Children } from "react";
const routes = [
    {path:"/",
    element:<Login/>
    },
    {path: "page",
        element: <PageTemplate />,
    children:[
        { path: "", element: <Home /> },
        // { path: "login", element: <Login /> },
        // { path: "register", element: <Register /> },
        { path: "category/:id?", element: <Category /> },
        { path: "product/:id?", element: <Product /> },
        { path: "search", element: <Search /> },
        { path: "*", element: <Error /> }
    ]},

];

export default routes;
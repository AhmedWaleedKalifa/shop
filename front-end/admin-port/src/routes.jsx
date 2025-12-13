import Error from "./pages/Error";
import Dashboard from "./pages/Dashboard";
import Category from "./pages/Category"
import Login from "./pages/Login";
import Product from "./pages/Product";
import Search from "./pages/Search";
import PageTemplate from "./components/PageTemplate";
import { Children } from "react";
import Categories from "./pages/Categories";
import Products from "./pages/Products";
import Users from "./pages/Users";
const routes = [
    {path:"/",
    element:<Login/>
    },
    {path: "page",
        element: <PageTemplate />,
    children:[
        { path: "dashboard", element: <Dashboard /> },
        {path:"categories",element:<Categories/>},
        {path:"products",element:<Products/>},
        {path:"users",element:<Users/>},
        { path: "category/:id?", element: <Category /> },
        { path: "product/:id?", element: <Product /> },
        { path: "search", element: <Search /> },
        { path: "*", element: <Error /> }
    ]},

];

export default routes;
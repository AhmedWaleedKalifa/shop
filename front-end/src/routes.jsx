import App from "./App";
import Error from "./pages/Error";
const routes = [
    {path: "/",element: <App />,errorElement: <Error />},
    // { path: "dashboard", element: <Main /> },
    // { path: "compliance/:id?", element: <Compliance /> },
    // { path: "requirements/:id?", element: <Requirements /> },
    // { path: "*", element: <ErrorPage /> }

];

export default routes;
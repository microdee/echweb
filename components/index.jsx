import * as React from 'react';
import * as ReactDOM from 'react-dom/client';

import {
    createBrowserRouter,
    RouterProvider,
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    Outlet,
    useLocation,
    useSearchParams
} from 'react-router-dom';

import App from './App';
import Home from 'echweb-content/js/Home';
import Parameters from 'echweb-content/js/Parameters';
import { RoutedMdArticle } from 'echweb-shared/MdArticle';
import PageNotFound from 'echweb-shared/PageNotFound';

function EntryPoint() {
    let [searchParams, setSearchParams] = useSearchParams();
    let redirectToEncoded = searchParams.get("redirect");
    let location = useLocation();


    document.title = `${Parameters.constants.globalTitle} ${location.pathname}`;

    if(redirectToEncoded) {
        return <Navigate to={decodeURIComponent(redirectToEncoded)} replace />
    } else {
        return (
            <App intro={location.pathname === "/"} >
                <Outlet />
            </App>
        );
    }
};

const router = createBrowserRouter([
    {
        path: "/",
        element: <EntryPoint />,
        children: [
            { index: true, element: <Home /> },
            { path: "c/*", element: <RoutedMdArticle /> },
            { path: "*", element: <PageNotFound /> }
        ]
    }
]);

ReactDOM.createRoot(document.getElementById("root")).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
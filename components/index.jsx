import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App';
import Home from 'echweb-content/js/Home';
import Parameters from 'echweb-content/js/Parameters';
import { RoutedMdArticle } from 'echweb-shared/MdArticle';
import PageNotFound from 'echweb-shared/PageNotFound';
import { navigate, useRoutes } from 'echweb-shared/hookrouter';

function EntryPoint() {
    let route = useRoutes({
        "/": () => <Home />,
        "/c*": () => <RoutedMdArticle />
    });

    let loc = new URL(window.location.href);
    let redirectToEncoded = loc.searchParams.get("redirect");
    
    document.title = `${Parameters.constants.globalTitle} ${window.location.pathname}`;

    if(redirectToEncoded) {
        navigate(decodeURIComponent(redirectToEncoded));
        return <></>
    } else {
        return (
            <App intro={window.location.pathname === "/"} >
                {route || <PageNotFound />}
            </App>
        );
    }
};

ReactDOM.createRoot(document.getElementById("root")).render(
    <EntryPoint />
);
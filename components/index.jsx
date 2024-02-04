import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import App from './App';
import Home from 'echweb-content/js/Home';
import Parameters from 'echweb-content/js/Parameters';
import { RoutedMdArticle } from 'echweb-shared/MdArticle';
import PageNotFound from 'echweb-shared/PageNotFound';
import { navigate, useInterceptor, useRoutes, prepareRoute } from 'echweb-shared/hookrouter';
import { ContentRoutes, ContentRoutesMeta } from 'echweb-content/js/ContentRoutes';

export function getContentRouteMeta(currentPath) {
    const candidate = Object.entries(ContentRoutesMeta).find(e => {
        const [route, meta] = e;
        const [regex, groupNames] = prepareRoute(route);
        console.log(regex);
        return currentPath.match(regex);
    });
    return candidate ? candidate[1] : {};
}

function EntryPoint() {
    let route = useRoutes({
        "/": () => <Home />,
        "/c*": () => <RoutedMdArticle />,
        ...ContentRoutes
    });
    let scrollInterceptor = useInterceptor((current, next) => {
        document.getElementById("root").scrollTo({
            top: 0, left: 0,
            behavior: "instant"
        });
        document.getElementById("glitch-cover").style.setProperty("display", "block");
        setTimeout(() => document.getElementById("glitch-cover").style.setProperty("display", "none"), 160);
        return next;
    });

    let loc = new URL(window.location.href);
    let redirectToEncoded = loc.searchParams.get("redirect");
    
    document.title = `${Parameters.constants.globalTitle} ${window.location.pathname}`;

    let routeMeta = getContentRouteMeta(window.location.pathname);
    let isStandalone = "standalone" in routeMeta;

    if(redirectToEncoded) {
        navigate(decodeURIComponent(redirectToEncoded));
        return <></>
    } else {
        return isStandalone
            ? (
                route || <PageNotFound />
            )
            : (
                <App intro={window.location.pathname === "/"} >
                    {route || <PageNotFound />}
                </App>
            );
    }
};

ReactDOM.createRoot(document.getElementById("root")).render(<>
    <EntryPoint />
</>);
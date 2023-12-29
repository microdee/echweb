import {A, setLinkProps} from './hookrouter/Link';
import useRedirect from './hookrouter/redirect';
import {useQueryParams, setQueryParams, getQueryParams} from "./hookrouter/queryParams";
import {useInterceptor} from './hookrouter/interceptor';
import {useControlledInterceptor} from './hookrouter/controlledInterceptor';
import {useTitle, getTitle} from './hookrouter/title';
import {
	navigate,
	useRoutes,
	setPath,
	getPath,
	getWorkingPath,
	setBasepath,
	getBasepath,
	usePath,
} from './hookrouter/router';

export {
	A,
	setLinkProps,
	useRedirect,
	useTitle,
	getTitle,
	useQueryParams,
	useInterceptor,
	useControlledInterceptor,
	navigate,
	useRoutes,
	setPath,
	getPath,
	getWorkingPath,
	setQueryParams,
	getQueryParams,
	setBasepath,
	getBasepath,
	usePath
};

import { createContext } from 'react';

export const DefaultLazyLoadContext = {
    height: '50vh',
    width: '100%'
};
const LazyLoadContext = createContext(DefaultLazyLoadContext);
export default LazyLoadContext;
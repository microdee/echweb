import { createContext } from 'react';

const PathContext = createContext({
    webPath: '',
    filePath: ''
});
export default PathContext;
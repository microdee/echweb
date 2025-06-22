import React, { useContext } from 'react';
import LazyLoadContext, { DefaultLazyLoadContext } from '../MdLazyLoadContext';
import Utils from '../Utils';

export default function MdLazyLoadContextRegion(props)
{
    let directProps = {...props};
    delete directProps.children;
    return <LazyLoadContext.Provider value={{...DefaultLazyLoadContext, ...directProps}}>
        {props.children}
    </LazyLoadContext.Provider>;
}

Utils.mdExt.llctxregion = MdLazyLoadContextRegion;
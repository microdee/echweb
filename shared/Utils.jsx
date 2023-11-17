import React from 'react';

const Utils = {
    getMainTextOfComponent: (component) => {
        if(typeof(component) === 'string') return component;
        if(typeof(component[0]) === 'string') return component[0];
        return Utils.getMainTextOfComponent(component[0].props.children);
    },
    
    trLinkUri: (uri, path) => {
        if(uri === undefined || uri == "" || uri == null) return uri;
        try {
            return new URL(uri).href
        } catch {
            let base = new URL(path, window.origin);
            return new URL(uri, base.href).href;
        }
    },

    mdExt: {}
}

export default Utils;
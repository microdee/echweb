import React from 'react';

let GhOrigStyle = {
    position: "relative",
    opacity: 0,
    marginTop: 0
}
let GhMiddleStyle = {
    position: "absolute",
    top: 0, left: 0
}

export class Gh1 extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            props,
        } = this;

        let hoverSuffix = props.onlyhover ? "-hover" : "";
        let idattr = props.id ? { id: props.id } : {};

        let hprops = {...props};
        try { delete hprops.glitchtype; } catch (error) { }
        try { delete hprops.onlyhover; } catch (error) { }
        try { delete hprops.id; } catch (error) { }
        

        return (
            <span {...idattr} className={`glitch-${props.glitchtype}${hoverSuffix}`} style={{ position: "relative"}}>
                <h1 {...hprops} style={{...props.style, ...GhOrigStyle}}>
                    {props.children}
                </h1>
            </span>
        )
    }
}

export class Gh2 extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const {
            props,
        } = this;
        
        let hoverSuffix = props.onlyhover ? "-hover" : "";
        let idattr = props.id ? { id: props.id } : {};

        let hprops = {...props};
        try { delete hprops.glitchtype; } catch (error) { }
        try { delete hprops.onlyhover; } catch (error) { }
        try { delete hprops.id; } catch (error) { }

        return (
            <span {...idattr} className={`glitch-${props.glitchtype}${hoverSuffix}`} style={{ position: "relative"}}>
                <h2 {...hprops} style={{...props.style, ...GhOrigStyle}}>
                    {props.children}
                </h2>
            </span>
        )
    }
}
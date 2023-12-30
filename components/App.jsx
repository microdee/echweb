import React from 'react';
import MainMenu from 'echweb-content/js/MainMenu';
import Parameters from 'echweb-content/js/Parameters';
import Logo from 'echweb-content/js/Logo';
import SvgFilters from 'echweb-shared/SvgFilters';
import MainScrollbar from './MainScrollbar';
import { A } from 'echweb-shared/hookrouter';

export default class App extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        const { children, intro } = this.props;
        let hprops = {
            className: "h0",
            id: "mainHead",
            style: {
                marginTop: "0px",
                marginBottom: "-10px"
            }
        }

        if ('glitch' in Parameters.header) {
            hprops.className += " glitch digital big";
        }

        let SelectedHeader = props => <h1 {...hprops}>{props.children}</h1>;
        let allowHeader = ('allowHeaderOnIntro' in Parameters.header) || !intro;

        return <>
            <SvgFilters />
            <div id="appRoot">
                {intro ? <Logo /> : <div style={{display: "none"}} />}
                {allowHeader
                    ? <SelectedHeader>
                        <A href="/">{Parameters.header.name}</A>
                    </SelectedHeader>
                    : <></>
                }
                <MainMenu />
                {children}
                <div id="footer"></div>
                <MainScrollbar />
            </div>
        </>;
    }
}
    
import React from 'react';
import { Link } from 'react-router-dom';
import MainMenu from 'echweb-content/js/MainMenu';
import Parameters from 'echweb-content/js/Parameters';
import Logo from 'echweb-content/js/Logo';
import SvgFilters from 'echweb-shared/SvgFilters';
import MainScrollbar from './MainScrollbar';
import {Gh1, Gh2} from 'echweb-shared/Gh';

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

        let SelectedHeader = props => <h1 {...hprops}>{props.children}</h1>;
        if ('glitch' in Parameters.header) {
            SelectedHeader = props => <Gh1 glitchtype="1" {...hprops}>{props.children}</Gh1>;
        }

        let allowHeader = ('allowHeaderOnIntro' in Parameters.header) || !intro;

        return <>
            <SvgFilters />
            <div id="appRoot">
                {intro ? <Logo /> : <div style={{display: "none"}} />}
                {allowHeader
                    ? <SelectedHeader>
                        <Link to="/">{Parameters.header.name}</Link>
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
    
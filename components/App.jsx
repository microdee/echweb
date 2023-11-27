import React from 'react';
import { Link } from 'react-router-dom';
import MainMenu from 'echweb-content/js/MainMenu';
import Parameters from 'echweb-content/js/Parameters';
import Logo from 'echweb-content/js/Logo';
import SvgFilters from 'echweb-shared/SvgFilters';
import MainScrollbar from './MainScrollbar';

export default class App extends React.Component {
    constructor(props) {
        super(props);
    }
    
    render() {
        const { children, intro } = this.props;

        return <>
            <SvgFilters />
            <div id="appRoot">
                {intro ? <Logo /> : <div style={{display: "none"}} />}
                {intro ? <></> : <h1
                    className="h0"
                    id="mainHead"
                    style={{
                        marginTop: "0px",
                        marginBottom: "-10px"
                    }}
                >
                    <Link to="/">{Parameters.header.name}</Link>
                </h1>}
                <MainMenu />
                {children}
                <div id="footer"></div>
                <MainScrollbar />
            </div>
        </>;
    }
}
    
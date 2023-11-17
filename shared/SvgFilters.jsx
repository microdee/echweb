import React from 'react';

export default class SvgFilters extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            noiseSeed: 0
        }
    }

    componentDidMount() {
        this.interval = setInterval((() => {
            this.setState({
                noiseSeed: this.state.noiseSeed + 1
            });
        }).bind(this), 100);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        return (
            <svg
                version="1.2"
                baseProfile="tiny"
                xmlns="http://www.w3.org/2000/svg"
                overflow="visible"
                style={{
                    display: "none"
                }}
            >
                <filter id="cartoonWiggle" x="0%" y="0%" width="100%" height="100%">
                    <feTurbulence
                        id="turbulence"
                        baseFrequency="0.006 0.006"
                        result="cartoonWiggle.turbulance"
                        numOctaves="1"
                        type="fractalNoise"
                        seed={this.state.noiseSeed}
                    />
                    <feDisplacementMap
                        in="SourceGraphic"
                        in2="cartoonWiggle.turbulance"
                        scale="10"
                        xChannelSelector="R"
                        yChannelSelector="G"
                    />
                </filter>
            </svg>
        )
    }
}
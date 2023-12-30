import React from "react";

export default class CartoonWiggleFilter extends React.Component {
    constructor(props) {
        super(props);
        this.pprops = {
            id: crypto.randomUUID(),
            x: "0%",
            y: "0%",
            baseSeed: 10,
            width: "100%",
            height: "100%",
            freqX: 0.006,
            freqY: 0.006,
            octaves: 1,
            scale: 10,
            ...props
        }
        this.state = {
            noiseSeed: this.pprops.baseSeed
        }
        
        this.fractalId = crypto.randomUUID();
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
            <filter
                id={this.pprops.id}
                x={this.pprops.x}
                y={this.pprops.y}
                width={this.pprops.width}
                height={this.pprops.height}
            >
                <feTurbulence
                    id={this.fractalId}
                    baseFrequency={`${this.pprops.freqX} ${this.pprops.freqY}`}
                    result={`${this.pprops.id}.${this.fractalId}`}
                    numOctaves={this.pprops.octaves}
                    type="fractalNoise"
                    seed={this.state.noiseSeed}
                />
                <feDisplacementMap
                    in="SourceGraphic"
                    in2={`${this.pprops.id}.${this.fractalId}`}
                    scale={this.pprops.scale}
                    xChannelSelector="R"
                    yChannelSelector="G"
                />
            </filter>
        )
    }
}
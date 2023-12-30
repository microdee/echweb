import React from "react";

export default class GlitchFilter extends React.Component {
    constructor(props) {
        super(props);
        this.pprops = {
            id: crypto.randomUUID(),
            baseSeed: 10,
            type: "digital",
            analogSpeed: 13,
            freqX: 0.0003,
            freqY: 0.010,
            octaves: 10,
            scale: 50,
            ...props
        };
        this.state = {
            noiseSeed: this.pprops.baseSeed
        };

        this.turbulance = {
            t1: crypto.randomUUID(),
            t2: crypto.randomUUID(),
            result: crypto.randomUUID(),
            transfer: crypto.randomUUID()
        };
        this.src = {
            id: "SourceGraphic",
            offset: crypto.randomUUID(),
            col: {
                R: crypto.randomUUID(),
                G: crypto.randomUUID(),
                B: crypto.randomUUID(),
            },
            disp: {
                R: crypto.randomUUID(),
                G: crypto.randomUUID(),
                B: crypto.randomUUID(),
            },
        }
        this.composite = crypto.randomUUID();

        this.analogT1 = React.createRef();
        this.analogT2 = React.createRef();
        this.analogComposite = React.createRef();
    }

    componentDidMount() {
        if (this.pprops.type === "digital") {
            this.interval = setInterval((() => {
                if (Math.random() < 0.666) {
                    this.setState({
                        noiseSeed: this.state.noiseSeed + 1
                    });
                }
            }).bind(this), 60);
        }
        else {
            let body = (timestamp => {
                if (this.analogT1?.current && this.analogT2?.current && this.analogComposite?.current) {
                    let prog = timestamp * 0.001 * this.pprops.analogSpeed;
                    let seed = Math.floor(prog) + this.pprops.baseSeed;
                    let blend = prog - Math.floor(prog);
                    this.analogT1.current.setAttribute("seed", seed);
                    this.analogT2.current.setAttribute("seed", seed + 1);
                    this.analogComposite.current.setAttribute("k2", 1-blend);
                    this.analogComposite.current.setAttribute("k3", blend);
                }
                window.requestAnimationFrame(body);
            }).bind(this);
            window.requestAnimationFrame(body);
        }
    }

    componentWillUnmount() {
        if (this.pprops.type === "digital") {
            clearInterval(this.interval);
        }
    }

    render() {
        return (
            <filter
                id={this.pprops.id}
                x="0%"
                y="0%"
                width="100%"
                height="100%"
            >
                {
                    {
                        analog: (<>
                            <feTurbulence
                                ref={this.analogT1}
                                baseFrequency={`${this.pprops.freqX} ${this.pprops.freqY}`}
                                numOctaves={this.pprops.octaves}
                                seed={this.state.noiseSeed}
                                result={this.turbulance.t1}
                            />
                            <feTurbulence
                                ref={this.analogT2}
                                baseFrequency={`${this.pprops.freqX} ${this.pprops.freqY}`}
                                numOctaves={this.pprops.octaves}
                                seed={this.state.noiseSeed}
                                result={this.turbulance.t2}
                            />
                            <feComposite
                                ref={this.analogComposite}
                                operator="arithmetic"
                                in={this.turbulance.t1}
                                in2={this.turbulance.t2}
                                result={this.turbulance.result}
                                k1="0" k2="1" k3="0" k4="0"
                            />
                        </>),
                        digital: (
                            <feTurbulence
                                baseFrequency={`${this.pprops.freqX} ${this.pprops.freqY}`}
                                numOctaves={this.pprops.octaves}
                                seed={this.state.noiseSeed}
                                result={this.turbulance.result}
                            />
                        )
                    }[this.pprops.type]
                }
                <feColorMatrix
                    type="matrix"
                    values="0 0 0 0 0 0 0.5 0 0 0 0 0 0.5 0 0 0 0 0 1 0 "
                    in={this.src.id}
                    result={this.src.col.R}
                />
                <feColorMatrix
                    type="matrix"
                    values="0.5 0 0 0 0 0 0 0 0 0 0 0 0.5 0 0 0 0 0 1 0 "
                    in={this.src.id}
                    result={this.src.col.G}
                />
                <feColorMatrix
                    type="matrix"
                    values="0.5 0 0 0 0 0 0.5 0 0 0 0 0 0 0 0 0 0 0 1 0 "
                    in={this.src.id}
                    result={this.src.col.B}
                />
                {
                    {
                        analog: (
                            <feComponentTransfer in={this.turbulance.result} result={this.turbulance.transfer}>
                                <feFuncR type="table" tableValues="0.5 0.5 1 0 1 " />
                                <feFuncG type="table" tableValues="0.5 0.5 1 0 1 " />
                                <feFuncB type="table" tableValues="0.5 0.5 1 0 1 " />
                                <feFuncA type="discrete" tableValues="0.5 0.5 0.5 " />
                            </feComponentTransfer>
                        ),
                        digital: (
                            <feComponentTransfer in={this.turbulance.result} result={this.turbulance.transfer}>
                                <feFuncR type="discrete" tableValues="0.5 0.5 0.33 1 0 1 " />
                                <feFuncG type="discrete" tableValues="0.5 0.5 0.64 1 0 1 " />
                                <feFuncB type="discrete" tableValues="0.5 0.5 0.33 1 0 1 " />
                                <feFuncA type="discrete" tableValues="0.5 0.5 0.5 " />
                            </feComponentTransfer>
                        )
                    }[this.pprops.type]
                }
                <feDisplacementMap
                    result={this.src.disp.R}
                    in={this.src.col.R}
                    in2={this.turbulance.transfer}
                    scale={-this.pprops.scale}
                    xChannelSelector="R"
                    yChannelSelector="A"
                />
                <feDisplacementMap
                    result={this.src.disp.G}
                    in={this.src.col.G}
                    in2={this.turbulance.transfer}
                    scale={-this.pprops.scale}
                    xChannelSelector="G"
                    yChannelSelector="A"
                />
                <feDisplacementMap
                    result={this.src.disp.B}
                    in={this.src.col.B}
                    in2={this.turbulance.transfer}
                    scale={-this.pprops.scale}
                    xChannelSelector="B"
                    yChannelSelector="A"
                />
                <feComposite
                    operator="arithmetic"
                    in={this.src.disp.R}
                    in2={this.src.disp.G}
                    result={this.composite}
                    k1="0" k2="1" k3="1" k4="0"
                />
                <feComposite
                    operator="arithmetic"
                    in={this.composite}
                    in2={this.src.disp.B}
                    k1="0" k2="1" k3="1" k4="0"
                />
            </filter>
        )
    }
}
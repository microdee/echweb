import React from 'react';
import ParallaxEffect from './parallax';

export default class MdFullParallaxWrap extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            parallax: new ParallaxEffect()
        };
        this.mainDiv = React.createRef();
        this.mainContent = React.createRef();
    }
    
    componentDidMount() {
        this.state.parallax.register(this.mainContent.current, true);
    }

    render() {
        
        let optionals = {};
        if (this.props.parallaxcoeff) {
            optionals = {...optionals, parallaxcoeff: this.props.parallaxcoeff};
        }

        if (this.props.noblur) {
            return (
                <div ref={this.mainDiv} className="mdFull" style={{
                    backgroundColor: "black",
                }}>
                    <div ref={this.mainContent} {...optionals}>
                        {this.props.children}
                    </div>
                </div>
            );
        }
        
        let childrenIn = ("props" in this.props.children)
            ? [ this.props.children ]
            : this.props.children;

        let blurredChildrenArray = childrenIn.map((c, i) => React.cloneElement(c, {...c.props, key: i}));
        return (
            <div ref={this.mainDiv} className="mdFull" style={{
                backgroundColor: "black",
            }}>
                <div style={{
                    position: "absolute",
                    filter: "blur(40px)"
                }}>
                    {blurredChildrenArray}
                </div>
                <div ref={this.mainContent} {...optionals}>
                    {this.props.children}
                </div>
            </div>
        );
    }
}
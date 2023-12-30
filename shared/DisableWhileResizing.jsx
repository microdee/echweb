import React from "react";
import ReactDOM from "react-dom";

export default class DisableWhileResizing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            visible: true
        }
        this.prevTimestamp = 0.0;
        this.prevVisible = true;
        this.visible = true;
        this.counter = 0.0;
        this.frameMs = 0.0;
    }

    handleResize() {
        this.counter = 350;
    }

    componentDidMount() {
        window.addEventListener('resize', this.handleResize.bind(this));

        let animBody = (timestamp => {
            this.frameMs = timestamp - this.prevTimestamp;
            this.prevTimestamp = timestamp;
            
            this.counter -= this.frameMs;
            this.visible = this.counter <= 0;
            if (this.prevVisible !== this.visible) {
                this.setState({visible: this.visible});
            }
            this.prevVisible = this.visible;
            window.requestAnimationFrame(animBody);
        }).bind(this);
        window.requestAnimationFrame(animBody);
    }

    render() {
        return (<>{
            this.state.visible
            ? this.props.children
            : (<h1 className="glitch big digital">resizing</h1>)
        }</>)
    }
}
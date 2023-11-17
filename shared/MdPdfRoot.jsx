import React from "react";
import ReactDOM from "react-dom";
import MdPdf from "./MdPdf";
import DisableWhileResizing from "./DisableWhileResizing";

export default class MdPdfRoot extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            persistentStorage: null
        }
    }

    isFull() {
        return "full" in this.props;
    }

    render() {
        let rootClass="pdfRoot" + (this.isFull() ? " mdFull" : "");
        return (
            <div className={rootClass}>
                <DisableWhileResizing>
                    <MdPdf
                        {...this.props}
                        setPersistent={(d => this.setState({persistentStorage: d})).bind(this)}
                        persistent={this.state.persistentStorage}
                    />
                </DisableWhileResizing>
            </div>
        )
    }
}
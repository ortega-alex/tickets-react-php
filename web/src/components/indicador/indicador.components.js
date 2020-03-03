import React, { Component } from "react";
import { connect } from "react-redux";
import { Icon } from "antd";

class Indicador extends Component {

    constructor(props) {
        super(props);
        this.state = {
            color: ["#56b3ff", "#1890ff", "#1565C0", "#003c8f"],
            select: 0
        };
    }

    componentDidMount() {

    }

    render() {
        const { select, color } = this.state;
        const { indicadores } = this.props;
        return (
            <div>
                <div className="row">
                    <div className="col-md-4">
                        <div className="grid-colum"
                            style={{ background: (select == 0) ? color[select] : '' }}
                            onClick={() => this.handleSelect(0)}
                        >
                            <div className="icon">
                                <Icon type="unlock" style={{ color: (select == 0) ? 'white' : '' }} />
                            </div>
                            <div className="text">
                                Tickets Abiertos
                                <p id="number" style={{ color: (select == 0) ? 'white' : '' }}>
                                    {(indicadores && indicadores["abiertos"]) ? indicadores["abiertos"] : 0}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="grid-colum"
                            style={{ background: (select == 1) ? color[select] : '' }}
                            onClick={() => this.handleSelect(1)}
                        >
                            <div className="icon">
                                <Icon type="lock" style={{ color: (select == 1) ? 'white' : '' }} />
                            </div>
                            <div className="text">
                                Tickets Cerrados
                                <p id="number" style={{ color: (select == 1) ? 'white' : '' }}>
                                    {(indicadores && indicadores["cerrados"]) ? indicadores["cerrados"] : 0}
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-4">
                        <div className="grid-colum"
                            id={2}
                            style={{ background: (select == 2) ? color[select] : '' }}
                            onClick={() => this.handleSelect(2)}
                        >
                            <div className="icon">
                                <Icon type="pie-chart" style={{ color: (select == 2) ? 'white' : '' }} />
                            </div>
                            <div className="text">
                                Satisfacción
                                <p id="number" style={{ color: (select == 2) ? 'white' : '' }}>
                                {(indicadores && indicadores["satisfaccion"]) ? indicadores["satisfaccion"] : 0} %
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    handleSelect(id) {
        this.setState({ select: id });
        // this.getEstadistica(id);
    }
}

export default connect()(Indicador);
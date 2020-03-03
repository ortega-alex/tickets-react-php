import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Tooltip, Button, Switch, Icon, Divider } from 'antd';
import Rodal from 'rodal';

import Tabla from '../../_helpers/tabla.component';
import TicketActions from '../../_actions/ticket.actions';
import Formulario from '../../_helpers/formulario.compoent';

const table = [
    { header: 'Nombre', value: 'nombre', filter: true, type: 1 },
    { header: 'Opciones', value: null, filter: false, type: 4, edit: true, status: true }
];
const form = [
    { name: 'Nombre', value: 'nombre', required: true, type: 1, icon: 'idcard' }

];

class Pregunta extends Component {

    constructor(props) {
        super(props);
        this.state = {
            id_pregunta: undefined,
            content: undefined,
            estado: true,
            modal: false
        }
    }

    componentDidMount() {
        this.props.dispatch(TicketActions.getPreguntas());
    }

    render() {
        const { preguntas } = this.props;
        const { modal } = this.state;
        return (
            <div>
                {modal &&
                    this.handleModal()
                }
                <div className="row">
                    <div className="col-md-6 offset-md-3 text-center">
                        <p className="m-0 p-0 h4">PREGUNTAS DE CALIFICACIÓN DE TICKETS</p>
                        <p className="m-0 p-0">
                            Se muestra el listado de preguntas del sistema para la calificación de tickets.
                        </p>
                    </div>
                    <div className="col-md-3 text-right">
                        <Tooltip title="Permite ingresar una nueva pregunta al sistema">
                            <Button
                                onClick={() => this.setState({ id_pregunta: undefined, content: undefined, estado: true, modal: true })}
                                type="primary"
                                htmlType="button"
                            >
                                <Icon type="plus-circle" /> Nueva Categoría
                        </Button>
                        </Tooltip>
                    </div>
                </div>
                <Tabla
                    data={preguntas}
                    arr={table}
                    handleEditEstado={this.handleEditEstado.bind(this)}
                    handleEdit={this.handleEdit.bind(this)}
                />
            </div>
        );
    }

    handleEditEstado(value, pregunta) {
        const data = {
            estado: (value == true ? 1 : 0),
            id_pregunta: pregunta.id_pregunta
        };
        this.props.dispatch(TicketActions.cambioEstadoPregunta(data));
    }

    handleEdit(pregunta) {
        this.setState({
            id_pregunta: pregunta.id_pregunta,
            estado: (pregunta.estado == 1 ? true : false),
            content: pregunta,
            modal: true
        });
    }

    handleModal() {
        const { modal, id_pregunta, estado, content } = this.state;
        return (
            <Rodal
                animation={'flip'}
                duration={500}
                visible={modal}
                onClose={() => {
                    this.setState({
                        modal: !modal,
                        id_pregunta: undefined,
                        content: undefined,
                        estado: true
                    });
                }}
                closeMaskOnClick
                showCloseButton={true}
                customStyles={{ borderRadius: 10 }}
                width={(window.innerWidth < 450 || window.height < 300) ? window.innerWidth : 450}
                height={(window.innerWidth < 450 || window.height < 300) ? window.innerHeight : 300}
                className="modal_rodal"
            >
                {(modal) &&
                    <div>
                        <div className="row">
                            <div className="col-md-3">
                                <Tooltip title="Permite activar o inactivar una categoria">
                                    <Switch
                                        size="small"
                                        defaultChecked={estado}
                                        onChange={(value) => this.setState({ estado: value })}
                                        checkedChildren="ACTIVO"
                                        unCheckedChildren="INACTIVO"
                                    />
                                </Tooltip>
                            </div>
                            <div className="col-md-6">
                                <p className="h4 m-0 p-0"><b>{id_pregunta ? "EDITA" : "NUEVO"} PREGUNTA</b></p>
                            </div>
                        </div>
                        <Divider />
                        <Formulario
                            footer={true}
                            edit={true}
                            arr={form}
                            content={content}
                            handleSubmit={this.handleAddPregunta.bind(this)}
                            no_reset={true}
                        />
                    </div>
                }
            </Rodal>
        );
    }

    handleAddPregunta(values) {
        const { id_pregunta, estado } = this.state;
        values.id_pregunta = id_pregunta;
        values.estado = (estado == true) ? 1 : 0;
        this.props.dispatch(TicketActions.addPregunta(values));
        this.setState({ id_pregunta: undefined, estado: true, modal: false });
    }
}

function MapStateToProps(state) {
    const { _tickets } = state;
    const { preguntas } = _tickets;
    return { preguntas };
}

export default connect(MapStateToProps)(Pregunta);
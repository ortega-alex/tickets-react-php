import React, { Component } from 'react';
import { connect } from "react-redux";
import { Icon, Button, Tooltip, Input, Divider, Switch } from "antd";
import Rodal from "rodal";

import DepartamentoActions from "../../_actions/departamento.actions";
import UsuarioActions from "../../_actions/usuario.actions";
import Formulario from '../../_helpers/formulario.compoent';
import Tabla from "../../_helpers/tabla.component";

const { Search } = Input;
const _dprt_a = require('../../media/dprt_a.png');
const _dprt_i = require('../../media/dprt_i.png');
const form = [
    { name: 'Nombre', value: 'nombre', required: true, type: 1, icon: 'idcard' }
];
const tabla = [
    { header: 'Nombre', value: 'nombre', filter: true, type: 1 },
    { header: 'Puesto', value: 'puesto', filter: true, type: 1 },
    { header: 'Estado', value: '_estado', filter: true, type: 3 },
    { header: 'Opciones', value: null, filter: false, type: 4, edit: true, status: true }
];
const form_asignacion = [
    { name: 'Departamento', value: 'id_departamento', required: true, type: 7, option: 'departamentos_activos' },
    { name: 'Usuario', value: 'id_usuario', required: true, type: 7, option: 'usuarios_activos' },
]

class Departamento extends Component {

    constructor(props) {
        super(props);
        this.state = {
            modal: false,
            estado: true,
            content: undefined,
            id_departamento: undefined,
            _departamentos: undefined,
            modal_departamento: false,
            modal_asignacion: false,
            content_asignacion: undefined,
            estado_asignacion: true,
            id_usuario_departamento: undefined
        }
    }

    componentDidMount() {
        this.props.dispatch(DepartamentoActions.getDepartamentos());
        this.props.dispatch(UsuarioActions.getActivos());
        this.props.dispatch(DepartamentoActions.getDepartamentosActivos());
    }

    render() {
        const { departamentos } = this.props;
        const { _departamentos, modal, modal_departamento, modal_asignacion } = this.state;
        return (
            <div>
                {modal_departamento &&
                    this.handleModalDepartamento()
                }
                {modal &&
                    this.handleModal()
                }
                {modal_asignacion &&
                    this.handleModalAsignacion()
                }
                <div className="row">
                    <div className="col-md-6 offset-md-3 text-center">
                        <p className="h4 p-0 m-0"><b>DEPARTAMENTOS</b></p>
                        <p className="m-0 p-0">Selecciona un departamento para modificar sus catálogos</p>
                    </div>
                    <div className="col-md-3 text-right">
                        <Tooltip title="Permite ingresar un nuevo departamento al sistema">
                            <Button
                                onClick={() => this.setState({ id_departamento: undefined, content: undefined, estado: true, modal: true })}
                                type="primary"
                                htmlType="button"
                            >
                                <Icon type="plus-circle" /> Nuevo
                        </Button>
                        </Tooltip>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-4 offset-md-4 text-center">
                        <Search
                            placeholder="Buscar departamento"
                            onSearch={(value) => {
                                this.handleBucar(value);
                            }}
                            enterButton
                        />
                    </div>
                </div>
                <div className="departamentos">
                    <div className="row">
                        {departamentos && (_departamentos ? _departamentos : departamentos).map((item, i) => {
                            return (
                                <div className="col-md-3" key={i} onClick={() => this.handleVerDepartamento(item)}>
                                    <div className="departamento">
                                        <img src={item.estado == 1 ? _dprt_a : _dprt_i} width="100"></img>
                                        <p className="h5 m-0 p-0 text-center"><b>{item.nombre.toUpperCase()}</b></p>
                                        <p className="m-0 p-0 text-center">{item._estado}</p>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        )
    }

    handleBucar(busqueda) {
        if (busqueda == null || busqueda.trim() == '') {
            this.setState({ _departamentos: undefined });
        } else {
            const { departamentos } = this.props;
            var _departamentos = departamentos.filter(item => {
                let nombre = item.nombre.toLowerCase()
                return nombre.indexOf(busqueda.toLowerCase()) !== -1;
            });
            this.setState({ _departamentos });
        }
    }

    handleModal() {
        const { modal, id_departamento, estado, content } = this.state;
        return (
            <Rodal
                animation={'flip'}
                duration={500}
                visible={modal}
                onClose={() => {
                    this.setState({
                        modal: !modal
                    });
                }}
                closeMaskOnClick
                showCloseButton={true}
                customStyles={{ borderRadius: 10 }}
                width={(window.innerWidth < 500 || window.height < 300) ? window.innerWidth : 500}
                height={(window.innerWidth < 500 || window.height < 300) ? window.innerHeight : 300}
                className="modal_rodal"
            >
                {(modal) &&
                    <div>
                        <div className="row">
                            <div className="col-md-2">
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
                            <div className="col-md-8 text-center">
                                <p className="h4 m-0 p-0"><b>{id_departamento ? "EDITA" : "NUEVO"} DEPARTAMENTO</b></p>
                            </div>
                        </div>
                        <Divider />
                        <Formulario
                            footer={true}
                            edit={true}
                            arr={form}
                            content={content}
                            handleSubmit={this.handleAddDepartamento.bind(this)}
                        />
                    </div>
                }
            </Rodal>
        );
    }

    handleAddDepartamento(values) {
        const { estado, id_departamento } = this.state;
        values.id_departamento = id_departamento;
        values.estado = (estado == true ? 1 : 0);
        this.props.dispatch(DepartamentoActions.addDepartemanto(values));
        this.setState({ id_departamento: undefined, estado: true, modal: false });
    }

    handleVerDepartamento(departamento) {
        this.props.dispatch(DepartamentoActions.getAsignacionesDepartamento(departamento));
        this.setState({
            id_departamento: departamento.id_departamento,
            estado: (departamento.estado == 1 ? true : false),
            modal_departamento: true,
            content: departamento
        });
    }

    handleModalDepartamento() {
        const { modal_departamento, content, estado } = this.state;
        const { asignaciones_departamento } = this.props;
        return (
            <Rodal
                animation={'flip'}
                duration={500}
                visible={modal_departamento}
                onClose={() => { this.setState({ modal_departamento: !modal_departamento, id_usuario: undefined }) }}
                closeMaskOnClick
                showCloseButton={true}
                customStyles={{ borderRadius: 10 }}
                width={(window.innerWidth < 900 || window.height < 450) ? window.innerWidth : 900}
                height={(window.innerWidth < 900 || window.height < 450) ? window.innerHeight : 450}
                className="modal_rodal"
            >
                {(modal_departamento) &&
                    <div>
                        <div className="row">
                            <div className="col-1">
                                <Tooltip title="Permite editar el departamento">
                                    <Button
                                        type="link"
                                        onClick={() => { this.setState({ modal: true }) }}
                                    >
                                        <Icon type="edit" style={{ fontSize: 20, color: "##007bff" }} />
                                    </Button>
                                </Tooltip>
                            </div>
                            <div className="col-2">
                                <Tooltip title="Permite activar o inactivar una categoria">
                                    <Switch
                                        size="small"
                                        defaultChecked={estado}
                                        onChange={(value) => this.handleEditEstadoDepartamento(value)}
                                        checkedChildren="ACTIVO"
                                        unCheckedChildren="INACTIVO"
                                    />
                                </Tooltip>
                            </div>
                            <div className="col-6 text-center">
                                <p className="h4 m-0 p-0"><b>{content.nombre.toUpperCase()}</b></p>
                            </div>
                        </div>
                        <Divider />
                        <Tabla
                            height="360px"
                            data={asignaciones_departamento}
                            arr={tabla}
                            handleEditEstado={this.handleEditEstadoAsignacion.bind(this)}
                            handleEdit={this.handleEditAsignacion.bind(this)}
                        />
                        <div className="row">
                            <div className="col-md-3 offset-md-9 text-right">
                                <Button type="primary" onClick={() => {
                                    this.setState({
                                        content_asignacion: { id_departamento: this.state.id_departamento },
                                        estado_asignacion: true,
                                        modal_asignacion: true
                                    })
                                }}>
                                    NUEVO ASIGNACIÓN
                                </Button>
                            </div>
                        </div>
                    </div>
                }
            </Rodal>
        )
    }

    handleEditEstadoDepartamento(value) {
        const { id_departamento } = this.state;
        const data = {
            id_departamento,
            estado: (value == true ? 1 : 0)
        }
        this.props.dispatch(DepartamentoActions.cambiarEstadoDepartamento(data));
        this.setState({ estado: value });
    }

    handleEditEstadoAsignacion(value, asignacion) {
        const data = {
            id_usuario_departamento: asignacion.id_usuario_departamento,
            id_departamento: asignacion.id_departamento,
            estado: (value == true ? 1 : 0)
        };
        this.props.dispatch(DepartamentoActions.cambiarEstadoAsignacion(data));
    }

    handleEditAsignacion(asignacion) {
        this.setState({
            id_usuario_departamento: asignacion.id_usuario_departamento,
            estado_asignacion: (asignacion.estado == 1 ? true : false),
            content_asignacion: asignacion,
            modal_asignacion: true
        });
    }

    handleModalAsignacion() {
        const { modal_asignacion, estado_asignacion, content_asignacion, id_usuario_departamento } = this.state;
        const { departamentos_activos, usuarios_activos } = this.props;
        return (
            <Rodal
                animation={'flip'}
                duration={500}
                visible={modal_asignacion}
                onClose={() => {
                    this.setState({ modal_asignacion: !modal_asignacion });
                }}
                closeMaskOnClick
                showCloseButton={true}
                customStyles={{ borderRadius: 10 }}
                width={(window.innerWidth < 500 || window.height < 300) ? window.innerWidth : 500}
                height={(window.innerWidth < 500 || window.height < 300) ? window.innerHeight : 300}
                className="modal_rodal"
            >
                {(modal_asignacion) &&
                    <div>
                        <div className="row">
                            <div className="col-md-2">
                                <Tooltip title="Permite activar o inactivar una asignación">
                                    <Switch
                                        size="small"
                                        defaultChecked={estado_asignacion}
                                        onChange={(value) => this.setState({ estado_asignacion: value })}
                                        checkedChildren="ACTIVO"
                                        unCheckedChildren="INACTIVO"
                                    />
                                </Tooltip>
                            </div>
                            <div className="col-md-8 text-center">
                                <p className="h4 m-0 p-0"><b>{id_usuario_departamento ? "EDITA" : "NUEVO"} ASIGNACIÓN</b></p>
                            </div>
                        </div>
                        <Divider />
                        <Formulario
                            footer={true}
                            edit={true}
                            arr={form_asignacion}
                            content={content_asignacion}
                            options={{ departamentos_activos, usuarios_activos }}
                            handleSubmit={this.handleAddAsignacion.bind(this)}
                        />
                    </div>
                }
            </Rodal>
        );
    }

    handleAddAsignacion(values) {
        const { estado_asignacion, id_usuario_departamento } = this.state;
        values.id_usuario_departamento = id_usuario_departamento;
        values.estado = (estado_asignacion == true ? 1 : 0);
        this.props.dispatch(DepartamentoActions.addAsignacion(values));
        this.state({
            estado_asignacion: true,
            content_asignacion: undefined,
            id_usuario_departamento: undefined,
            modal_asignacion: false
        });
    }
}

function MapStateToProps(state) {
    const { _departamentos, _usuarios } = state;
    const { departamentos, departamentos_activos, asignaciones_departamento } = _departamentos;
    const { usuarios_activos } = _usuarios;
    return { departamentos, departamentos_activos, asignaciones_departamento, usuarios_activos };
}

export default connect(MapStateToProps)(Departamento);
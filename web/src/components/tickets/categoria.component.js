import React, { Component } from "react";
import { connect } from "react-redux";
import { Tabs, Button, Icon, Switch, Input, Tooltip, Divider, Slider } from 'antd';
import Rodal from 'rodal';

import TicketActions from '../../_actions/ticket.actions';
import Formulario from '../../_helpers/formulario.compoent';
import Tabla from '../../_helpers/tabla.component';
import funciones from "../../_helpers/Funciones";

const _ticket = require('../../media/ticket.png');
const _ticket_disable = require('../../media/ticket_disable.png');

const { TabPane } = Tabs;
const { Search } = Input;
const form_categoria = [
    { name: 'Nombre', value: 'nombre', required: true, type: 1, icon: 'idcard' }
];
const table_categoria = [
    { header: 'Nombre', value: 'nombre', filter: true, type: 1 },
    { header: 'Valor', value: 'valor', filter: true, type: 5, edit: true },
    { header: 'Asignar', value: null, filter: false, type: 4, asignar: true }
];
const tabs = [
    {
        name: 'INFORMACIÓN PRINCIPAL', formulario: [
            { name: 'titulo', value: 'nombre', required: true, type: 1, icon: 'idcard' },
            { name: 'Categoria', value: 'id_categoria', required: true, type: 7, option: 'categorias' },
            { name: 'Tiempo', value: 'tiempo', required: true, type: 3, icon: 'number', col: 6 },
            { name: 'Marca', value: 'marca_tiempo', required: true, type: 7, option: 'marcas', col: 6 },
            { name: 'Descripcion', value: 'descripcion', require: true, type: 2 },
            { name: 'Autorizacion', value: 'autorizacion', required: false, type: 5, col: 6 },
            { name: 'Automatico', value: 'automatico', required: false, type: 5, col: 6 },
            { name: 'Prioridad', value: 'prioridad', required: true, type: 9, min: 1, max: 5, marks: { 1: 'Muy baja', 2: 'Baja', 3: 'Media', 4: 'Alta', 5: 'Muy alta' } }
        ]
    },
    {
        name: 'PROCEDIMIENTO', formulario: [
            { name: 'Procedimiento', value: 'procedimiento', require: true, type: 2, rows: 15 }
        ]
    }
];

class Categoria extends Component {

    constructor(props) {
        super(props);
        this.state = {
            _tickets_categoria: undefined,
            modal_categoria: false,
            id_categoria: undefined,
            estado: true,
            content: undefined,
            total: 0,
            ids_preguntas: [],
            modal_ticket: false,
            id_ticket: undefined,
            modal_ver_ticket: false
        }
    }

    componentDidMount() {
        this.handleGetCategorias();
    }

    render() {
        const { categorias, tickets_categoria } = this.props;
        const { _tickets_categoria, modal_categoria, modal_ticket, modal_ver_ticket } = this.state;
        return (
            <div>
                {modal_categoria &&
                    this.handleModalCategoria()
                }
                {modal_ver_ticket &&
                    this.handleModalVerTicket()
                }
                {modal_ticket &&
                    this.handleModalTicket()
                }
                <Tabs onChange={(value) => { this.handleGetTicktes(value) }} type="card"
                    tabBarExtraContent={
                        <Button
                            onClick={() => this.handleNuevaCategoria()}
                            type="primary"
                            htmlType="button"
                        >
                            <Icon type="plus-circle" /> Nueva Categoría
                        </Button>
                    }
                >
                    {categorias ? categorias.map((item) => (
                        <TabPane key={item.id_categoria}
                            tab={
                                <div style={{ color: item.estado == 1 ? undefined : '#A6ACAF' }}>
                                    {item.nombre}
                                </div>
                            }
                        >
                            <div>
                                <div className="row">
                                    <div className="col-2">
                                        <Tooltip title="Permite editar la categiria">
                                            <Button
                                                type="link"
                                                onClick={() => { this.handleEditCategoria(item) }}
                                            >
                                                <Icon type="edit" style={{ fontSize: 20, color: "#8F8F8F" }} />
                                            </Button>
                                        </Tooltip>
                                        <Tooltip title="Permite activar o inactivar la categoria">
                                            <Switch
                                                size="small"
                                                checkedChildren="ACTIVO"
                                                unCheckedChildren="INACTIVO"
                                                defaultChecked={item.estado == 0 ? false : true}
                                                onChange={(valor) => {
                                                    this.handleEstadoCategoria(valor, item.id_categoria)
                                                }}
                                            />
                                        </Tooltip>
                                    </div>
                                    <div className="col-md-4 offset-md-2 text-center ">
                                        <Search
                                            placeholder="Buscar Ticket"
                                            onSearch={(value) => {
                                                this.handleBucarTicket(value);
                                            }}
                                            enterButton
                                        />
                                    </div>
                                </div>
                                <div className="categoria">
                                    <div className="row">
                                        <div className="col-md-3">
                                            <Button
                                                type="link"
                                                onClick={() => {
                                                    this.setState({
                                                        id_ticket: undefined,
                                                        modal_ticket: true,
                                                        content: { autorizacion: 0, automatico: 0 }
                                                    });
                                                }}
                                                block
                                                id="nuevo-ticket"
                                            >
                                                <Icon type="plus-circle" id="icon-nuevo-ticket" />
                                                <b>NUEVO TICKET</b>
                                            </Button>
                                        </div>

                                        {tickets_categoria && (_tickets_categoria ? _tickets_categoria : tickets_categoria).map((item, i) => {
                                            return (
                                                <div className="col-md-3" key={i} onClick={() => { this.handleVerTicket(item) }}>
                                                    <div id="vista-ticket-categoria">
                                                        <div className="row" >
                                                            <div className="col-4">
                                                                <img id="img-ticket-categoria" src={item.estado == 1 ? _ticket : _ticket_disable} />
                                                            </div>
                                                            <div className="col-8" >
                                                                <p className="h6 m-0 p-0 text-black"><b>{item.nombre}</b></p>
                                                                <p className="m-0 p-0" style={{ fontSize: '0.8rem' }}>{item.descripcion}</p>
                                                            </div>
                                                            {item.estado == 0 &&
                                                                <div className="col-12 footer">
                                                                    <p className="text-center disable">ticket desactivada</p>
                                                                </div>
                                                            }
                                                        </div>
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </div>
                        </TabPane>
                    )) : <TabPane key="0"></TabPane>}
                </Tabs>
            </div>
        );
    }

    handleGetCategorias() {
        this.props.dispatch(TicketActions.getCategorias());
        setTimeout(() => {
            const { categorias } = this.props;
            this.handleGetTicktes(categorias[0].id_categoria);
        }, 1000);
    }

    handleGetTicktes(id_categoria) {
        this.handleBucarTicket('');
        this.props.dispatch(TicketActions.getTicketsCategorias({ id_categoria }));
    }

    handleEditCategoria(categoria) {
        this.props.dispatch(TicketActions.getPreguntasCategoria(categoria));
        this.setState({
            id_categoria: categoria.id_categoria,
            estado: (categoria.estado == 1 ? true : false),
            content: categoria,
            modal_categoria: true
        });
    }

    handleEstadoCategoria(valor, id_categoria) {
        var data = {
            id_categoria,
            estado: (valor == true) ? 1 : 0
        };
        this.props.dispatch(TicketActions.cambioEstadoCategoria(data));
    }

    handleBucarTicket(busqueda) {
        if (busqueda == null || busqueda.trim() == '') {
            this.setState({ _tickets_categoria: undefined });
        } else {
            const { tickets_categoria } = this.props;
            var _tickets_categoria = tickets_categoria.filter(item => {
                let nombre = item.nombre.toLowerCase()
                return nombre.indexOf(busqueda.toLowerCase()) !== -1;
            });
            this.setState({ _tickets_categoria });
        }
    }

    handleNuevaCategoria() {
        this.props.dispatch(TicketActions.getPreguntasActivas());
        this.setState({ modal_categoria: true, id_categoria: undefined, estado: true, content: undefined });
    }

    handleModalCategoria() {
        const { modal_categoria, id_categoria, estado, content, total } = this.state;
        const { total_calificacion, preguntas_activas } = this.props;
        return (
            <Rodal
                animation={'flip'}
                duration={500}
                visible={modal_categoria}
                onClose={() => {
                    this.setState({
                        modal_categoria: !modal_categoria,
                        id_categoria: undefined,
                        total: 0,
                        ids_preguntas: []
                    });
                }}
                closeMaskOnClick
                showCloseButton={true}
                customStyles={{ borderRadius: 10 }}
                width={(window.innerWidth < 600 || window.height < 450) ? window.innerWidth : 600}
                height={(window.innerWidth < 600 || window.height < 450) ? window.innerHeight : 600}
                className="modal_rodal"
            >
                {(modal_categoria) &&
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
                                <p className="h4 m-0 p-0"><b>{id_categoria ? "EDITA" : "NUEVO"} CATEGORIA</b></p>
                            </div>
                        </div>
                        <Divider />
                        <Formulario
                            footer={true}
                            edit={true}
                            arr={form_categoria}
                            content={content}
                            handleSubmit={this.handleAddCategoria.bind(this)}
                            no_reset={true}
                        />
                        <Tabla
                            height="400px"
                            data={preguntas_activas}
                            arr={table_categoria}
                            handleAsignacion={this.handleAsignacion.bind(this)}
                        />
                        <div className="row">
                            <div className="col-4">
                                <Tooltip title="Calculo total de la calificacion">
                                    <p className="m-0 p-0 text-center">CALIFICACIÓN: {total_calificacion && total == 0 ? total_calificacion : total}</p>
                                </Tooltip>
                            </div>
                        </div>
                    </div>
                }
            </Rodal>
        );
    }

    handleAddCategoria(values) {
        const { total, ids_preguntas, estado, id_categoria } = this.state;
        const { _ids_preguntas } = this.props;
        if (total > 0 && total != 100) {
            funciones.message('warning', "Si asigna alguna pregunta a una categoria el total de la calificacion debera ser de 100");
            return;
        }
        values.id_categoria = id_categoria;
        values.estado = (estado == true) ? 1 : 0;
        values.ids_preguntas = (_ids_preguntas && ids_preguntas.length == 0) ?
            JSON.stringify(_ids_preguntas).replace(/[\[\]']+/g, '') : ids_preguntas;
        this.props.dispatch(TicketActions.addCategoria(values));
        this.setState({ total: 0, ids_preguntas: [], estado: true, id_categoria: undefined, modal_categoria: false });
    }

    handleAsignacion(asignacion) {
        var total = 0;
        var ids_preguntas = [];
        for (var asig in asignacion) {
            if (asignacion[asig]['asignar'] == 1) {
                total += parseFloat(asignacion[asig]['valor']);
                ids_preguntas.push(JSON.stringify({ id_pregunta: asig + "-" + asignacion[asig]['valor'] }));
            }
        }
        this.setState({ total, ids_preguntas });
    }

    handleModalTicket() {
        const { modal_ticket, id_ticket, estado, content } = this.state;
        const { categorias } = this.props;
        return (
            <Rodal
                animation={'flip'}
                duration={500}
                visible={modal_ticket}
                onClose={() => {
                    this.setState({
                        modal_ticket: !modal_ticket
                    });
                }}
                closeMaskOnClick
                showCloseButton={true}
                customStyles={{ borderRadius: 10 }}
                width={(window.innerWidth < 500 || window.height < 700) ? window.innerWidth : 500}
                height={(window.innerWidth < 500 || window.height < 700) ? window.innerHeight : 700}
                className="modal_rodal"
            >
                {(modal_ticket) &&
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
                                <p className="h4 m-0 p-0"><b>{id_ticket ? "EDITA" : "NUEVO"} TICKET</b></p>
                            </div>
                        </div>
                        <Divider />
                        <Formulario
                            edit={true}
                            footer={true}
                            tabs={tabs}
                            content={content}
                            options={{
                                categorias, marcas: [
                                    { marca_tiempo: '1', nombre: 'Minutos' },
                                    { marca_tiempo: '2', nombre: 'Horas' },
                                    { marca_tiempo: '3', nombre: 'Dias' }
                                ]
                            }}
                            handleSubmit={this.handleAddTicket.bind(this)}
                        />
                    </div>
                }
            </Rodal>
        );
    }

    handleAddTicket(values) {
        const { id_ticket, estado } = this.state;
        values.id_ticket = id_ticket;
        values.estado = (estado == true) ? 1 : 0;
        this.props.dispatch(TicketActions.addTicket(values));
        this.setState({ modal_ticket: false, modal_ver_ticket: false, content: undefined, estado: true, id_ticket: undefined });
    }

    handleVerTicket(ticket) {
        this.setState({
            content: ticket,
            id_ticket: ticket.id_ticket,
            estado: (ticket.estado == 1) ? true : false,
            modal_ver_ticket: true
        });
    }

    handleModalVerTicket() {
        const { modal_ver_ticket, estado, content } = this.state;
        return (
            <Rodal
                animation={'flip'}
                duration={500}
                visible={modal_ver_ticket}
                onClose={() => {
                    this.setState({
                        modal_ver_ticket: !modal_ver_ticket,
                        id_ticket: undefined,
                        content: undefined,
                        estado: true
                    });
                }}
                closeMaskOnClick
                showCloseButton={true}
                customStyles={{ borderRadius: 10 }}
                width={(window.innerWidth < 800 || window.height < 400) ? window.innerWidth : 800}
                height={(window.innerWidth < 800 || window.height < 400) ? window.innerHeight : 400}
                className="modal_rodal"
            >
                {(modal_ver_ticket) &&
                    <div>
                        <div className="row text-center">
                            <div className="col-1">
                                <Tooltip title="Permite editar el ticket">
                                    <Button
                                        type="link"
                                        onClick={() => { this.setState({ modal_ticket: true }) }}
                                    >
                                        <Icon type="edit" style={{ fontSize: 20, color: "#8F8F8F" }} />
                                    </Button>
                                </Tooltip>
                            </div>
                            <div className="col-2">
                                <Tooltip title="Permite activar o inactivar un ticket">
                                    <Switch
                                        size="small"
                                        defaultChecked={estado}
                                        onChange={(value) => this.setState({ estado: value })}
                                        checkedChildren="ACTIVO"
                                        unCheckedChildren="INACTIVO"
                                    />
                                </Tooltip>
                            </div>
                            <div className="col-6">
                                <p className="h4 m-0 p-0"><b>{content.nombre.toUpperCase()}</b></p>
                            </div>
                        </div>
                        <Divider />
                        <br />
                        <br />
                        <div className="row">
                            <div className="col-6">
                                <p className="h5 m-0 p-0"><b>Tiempo estimado:</b></p>
                                <p className="m-0 p-0 text-center text-info">
                                    <b>
                                        {content.tiempo} {content.marca_tiempo == 1 ? 'MINUTOS' : (content.marca_tiempo == 2 ? 'HORAS' : 'DIAS')}
                                    </b>
                                </p>

                                <p className="h5 m-0 p-0 mt-5"><b>Descripcion:</b></p>
                                <p className="m-0 p-0 text-center">{content.descripcion}</p>

                                <p className="h5 m-0 p-0 mt-5"><b>Prioridad:</b></p>
                                <div className="text-center pl-5 pr-5">
                                    <Slider
                                        marks={{ 1: 'Muy baja', 2: 'Baja', 3: 'Media', 4: 'Alta', 5: 'Muy alta' }}
                                        min={1}
                                        max={5}
                                        defaultValue={content.prioridad}
                                        step={1}
                                        disabled={true}
                                    />
                                </div>
                            </div>
                            <div className="col-6 ">
                                <div className="procedimiento">
                                    <p className="h5 m-0 p-0"><b>Procedimiento:</b></p>
                                    <p className="m-0 p-0 text-juntify">{content.procedimiento}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                }
            </Rodal>
        );
    }
}

function MapStateToProps(state) {
    const { _tickets } = state;
    const { categorias, tickets_categoria, preguntas_activas, total_calificacion, _ids_preguntas } = _tickets;
    return { categorias, tickets_categoria, preguntas_activas, total_calificacion, _ids_preguntas };
}

export default connect(MapStateToProps)(Categoria);
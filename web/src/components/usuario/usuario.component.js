import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Tooltip, Icon, Upload, Divider } from "antd";
import Rodal from "rodal";

import UsuarioActions from "../../_actions/usuario.actions";
import Tabla from '../../_helpers/tabla.component';
import Formulario from '../../_helpers/formulario.compoent';
import Ficha from "../../_helpers/ficha.component";

const tabla = [
    { header: 'Nombre', value: 'nombre', filter: true, type: 1 },
    { header: 'Usuario', value: 'usuario', filter: true, type: 1 },
    { header: 'Perfil', value: 'perfil', filter: true, type: 1 },
    { header: 'Departamento', value: 'departamento', filter: true, type: 1 },
    { header: 'Estado', value: '_estado', filter: true, type: 3 },
    { header: 'Asignación', value: 'fecha', filter: true, type: 1 },
    { header: 'Soporte', value: '_soporte', filter: true, type: 7 },
    { header: 'Opciones', value: null, filter: false, type: 4, edit: true, status: true, ficha: true }
];

const formulario = [
    { name: 'Nombre', value: 'nombre', required: true, type: 1, icon: 'idcard' },
    { name: 'Correo', value: 'email', required: true, type: 1, icon: 'mail', col: 6 },
    { name: 'Usuario', value: 'usuario', required: true, type: 1, icon: 'user', col: 6 },
    { name: 'Perfil', value: 'id_perfil', required: true, type: 7, option: 'perfiles_activos' },
    { name: 'Nivel de Acceso', value: 'id_rol', required: true, type: 7, option: 'roles_activos' },
    { name: 'Activo', value: 'estado', required: false, type: 5, col: 4 },
    { name: 'Soporte', value: 'soporte', required: false, type: 5, col: 4 },
    { name: 'Restablcer contraseña', value: 'restablecer', required: false, type: 5, col: 4 }
];

const ficha = {
    titulo: null,
    tabs: [
        {
            titulo: 'Tickets',
            descripcion: `Selecciona los tickets que consideras adecuadas para este usuario. 
                            los tickets seleccionadas serán los asignados por defecto al los usuarios. 
                            El usuarios sólo podrán usar las tickets seleccionadas.`,
            tipo: 3,
            data: 'tickets_usuario',
            asignados: 'tk_asignados',
            button: 'GUARDAR',
            info: {
                title: 'Únicamente podrá hacer uso de los tickets seleccionados.',
                toltip: `Se ha limitado el uso de tickets a las tickets seleccionadas. 
                        Si deseas habilitar el uso de otras tickets desactiva Limitar Tickets en la configiuración de este puesto.`
            }
        },
        {
            titulo: 'Historial',
            tipo: 1,
            tabla: [
                { header: 'Fecha', value: 'fecha', filter: true, type: 1 },
                { header: 'Descripcion', value: 'descripcion', filter: true, type: 1 }
            ],
            data: 'historial_usuario'
        },
        {
            titulo: 'Permisos',
            descripcion: `Selecciona los permisos que consideras adecuadas para este usuario. 
                            los permisos seleccionadas serán los asignados por defecto al los usuarios. 
                            El usuarios sólo podrán acceder a el modulo si cuenta con este permiso.`,
            tipo: 3,
            data: 'permisos_usuario',
            asignados: 'pr_asignados',
            button: 'GUARDAR',
            info: {
                title: 'Modulos permitidos por usuario.',
                toltip: 'El usuario solo podra acceder a los modulos seleccionados.'
            }
        },
        {
            titulo: 'Departamentos',
            descripcion: `Visualiza los departamentos asignados al usuario seleccionado.`,
            tipo: 2,
            data: 'departamentos_usuario',
            asignados: 'dp_asignados',
            button: 'GUARDAR',
            info: {
                title: 'Asignacion de departamentos.',
                toltip: 'Departamentos a los cuales a sido asignado el usuario.'
            }
        }
    ]
}

class Usuario extends Component {

    constructor(props) {
        super(props);
        this.state = {
            file: null,
            subiendo: false,
            modal_usuario: false,
            id_usuario: null,
            content: undefined,
            modal_ficha: false
        }
    }

    componentDidMount() {
        this.props.dispatch(UsuarioActions.get());
        this.props.dispatch(UsuarioActions.getRolesActivos());
        this.props.dispatch(UsuarioActions.getPerfilesActivos());
    }

    render() {
        const { subiendo, modal_usuario, modal_ficha } = this.state;
        const { usuarios } = this.props;
        const propsUpload = {
            disabled: subiendo,
            onRemove: () => { this.setState({ file: null }); },
            onChange: (info) => {
                info.file.status = "done";
                this.setState({ subiendo: false })
            },
            multiple: false,
            customRequest: ({ onSuccess, onError, file }) => {
                this.setState({ subiendo: true, file });
                this.props.dispatch(UsuarioActions.masivo({ file }));
            },
            accept: ".xlsx",
            name: 'file',
        };

        return (
            <div>
                {modal_usuario &&
                    this.handleModalUsuaio()
                }
                {modal_ficha &&
                    this.handleModalFicha()
                }
                <div className="row">
                    <div className="col-md-1 offset-md-9 text-right">
                        <Tooltip title="Nuevo Usuario" placement="left">
                            <Button
                                type="link"
                                onClick={() => this.setState({ modal_usuario: true, id_usuario: null, content: undefined, estado: true })}
                            >
                                <Icon type="user-add" style={{ color: '#3498DB', fontSize: 20 }} />
                            </Button>
                        </Tooltip>
                    </div>
                    <div className="col-md-2 text-left">
                        <Upload
                            {...propsUpload}
                        >
                            <Button
                                type="primary"
                                htmlType="button"
                            >
                                <Icon type="upload" /> carga masiva
                            </Button>
                        </Upload>
                    </div>
                </div>
                <div className="row text-center">
                    <div className="col-md-6 offset-md-3">
                        <p className="h3 m-0 p-0"><b>Usuarios</b></p>
                        <p className="m-0 p-0">Se muestra el listado de usuarios del Sistema de Tickets.</p>
                    </div>
                </div>
                <Tabla
                    data={usuarios}
                    arr={tabla}
                    handleEditEstado={this.handleEditEstado.bind(this)}
                    handleEdit={this.handleEdit.bind(this)}
                    handleEditFicha={this.handleEditFicha.bind(this)}
                />
            </div>
        );
    }

    handleModalUsuaio() {
        const { modal_usuario, content, id_usuario } = this.state;
        const { roles_activos, perfiles_activos } = this.props;
        return (
            <Rodal
                animation={'flip'}
                duration={500}
                visible={modal_usuario}
                onClose={() => { this.setState({ modal_usuario: !modal_usuario }) }}
                closeMaskOnClick
                showCloseButton={true}
                customStyles={{ borderRadius: 10 }}
                width={(window.innerWidth < 500 || window.height < 570) ? window.innerWidth : 500}
                height={(window.innerWidth < 500 || window.height < 570) ? window.innerHeight : 570}
                className="modal_rodal"
            >
                {(modal_usuario) &&
                    <div>
                        <div className="row text-center">
                            <div className="col-md-6 offset-md-3">
                                <p className="h4 m-0 p-0"><b>{id_usuario != null ? 'EDITAR' : 'NUEVO'} USUARIO</b></p>
                            </div>
                        </div>
                        <Divider />
                        <Formulario
                            options={{ roles_activos, perfiles_activos }}
                            footer={true}
                            edit={true}
                            arr={formulario}
                            content={content}
                            handleSubmit={this.handleAddUsuario.bind(this)}
                        />
                    </div>
                }
            </Rodal>
        );
    }

    handleAddUsuario(values) {
        const { id_usuario } = this.state;
        values.id_usuario = id_usuario;
        this.props.dispatch(UsuarioActions.save(values));
        this.setState({ id_usuario: null, content: undefined, modal_usuario: false });
    }

    handleEditEstado(valor, usuario) {
        var data = {
            estado: (valor == true ? 1 : 0),
            id_usuario: usuario.id_usuario
        };
        this.props.dispatch(UsuarioActions.changeEstado(data));
    }

    handleEdit(usuario) {
        this.setState({
            id_usuario: usuario.id_usuario,
            content: usuario,
            modal_usuario: true
        });
    }

    handleEditFicha(usuario) {
        this.props.dispatch(UsuarioActions.getFichaUsuaio({ id_usuario: usuario.id_usuario }));
        ficha.titulo = usuario.nombre;
        setTimeout(() => {
            this.setState({ id_usuario: usuario.id_usuario, modal_ficha: true });
        }, 1000);
    }

    handleModalFicha() {
        const { modal_ficha } = this.state;
        const {
            tickets_usuario, historial_usuario, permisos_usuario, departamentos_usuario, tk_asignados,
            pr_asignados, dp_asignados
        } = this.props;
        return (
            <Rodal
                animation={'flip'}
                duration={500}
                visible={modal_ficha}
                onClose={() => { this.setState({ modal_ficha: !modal_ficha, id_usuario: undefined }) }}
                closeMaskOnClick
                showCloseButton={true}
                customStyles={{ borderRadius: 10 }}
                width={(window.innerWidth < 900 || window.height < 450) ? window.innerWidth : 900}
                height={(window.innerWidth < 900 || window.height < 450) ? window.innerHeight : 450}
                className="modal_rodal"
            >
                {(modal_ficha) &&
                    <Ficha
                        ficha={ficha}
                        handleSave={this.handleGuardarFicha.bind(this)}
                        data={{ tickets_usuario, historial_usuario, permisos_usuario, departamentos_usuario }}
                        asignados={{ tk_asignados, pr_asignados, dp_asignados }}
                    />
                }
            </Rodal>
        )
    }

    handleGuardarFicha(titulo, value) {
        const { id_usuario } = this.state;
        if (value) {
            var data = {
                id_usuario,
                db: titulo,
                asignacion: value
            };
            this.props.dispatch(UsuarioActions.saveFicha(data));
        }
    }
}

function mapStateToProps(state) {
    const { _usuarios } = state;
    const { usuarios, roles_activos, perfiles_activos, tickets_usuario, tk_asignados,
        historial_usuario, permisos_usuario, pr_asignados, departamentos_usuario, dp_asignados } = _usuarios;
    return {
        usuarios, roles_activos, perfiles_activos, tickets_usuario, tk_asignados,
        historial_usuario, permisos_usuario, pr_asignados, departamentos_usuario, dp_asignados
    };
}

export default connect(mapStateToProps)(Usuario);
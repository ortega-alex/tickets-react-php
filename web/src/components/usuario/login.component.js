import React, { Component } from "react";
import { connect } from "react-redux";
import { Input, Icon, Form } from "antd";
import Rodal from "rodal";

import UsuarioActions from "../../_actions/usuario.actions";
import Funciones from "../../_helpers/Funciones";

const { Item } = Form;
const _fondo = require('../../media/fondo.jpg');

class Login extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        const { usuario } = this.props;
        const { getFieldDecorator } = this.props.form;
        return (
            <div className="fondo" style={{ backgroundImage: `url(${_fondo})` }}>
                <div className="login">
                    {(usuario && usuario.restablecer === 1) &&
                        this.handleRestablecer()
                    }
                    <Form ref={ref => this.formulariote = ref} onSubmit={this.handleLogin.bind(this)} className="form form-horizontal">
                        <Item>
                            {getFieldDecorator('usuario', {
                                rules: [{ required: true, message: 'Por favor ingrese un usuario' }],
                                initialValue: ''
                            })(
                                <Input size="large" prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Usuario" />
                            )}
                        </Item>

                        <Item>
                            {getFieldDecorator('pass', {
                                rules: [{ required: true, message: 'Por favor ingrese un Contraseña' }],
                                initialValue: ''
                            })(
                                <Input size="large" type="password" prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Contraseña" />
                            )}
                        </Item>

                        <div className="form-group">
                            <button className="btn btn-primary btn-block" type="submit">
                                Enviar
                            </button>
                        </div>
                    </Form>
                </div>
            </div>
        );
    }

    handleLogin(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                this.props.dispatch(UsuarioActions.login(values));
            }
        });
    }

    handleRestablecer() {
        const { usuario } = this.props;
        const { getFieldDecorator } = this.props.form;
        return (
            <Rodal
                animation={'flip'}
                duration={500}
                visible={usuario && usuario.restablecer === 1}
                showCloseButton={false}
                customStyles={{ borderRadius: 10 }}
                width={(window.innerWidth < 450 || window.innerHeight < 300) ? window.innerWidth : 450}
                height={(window.innerWidth < 450 || window.innerHeight < 300) ? window.innerHeight : 300}
                className="modal_rodal"
            >
                {(usuario && usuario.restablecer === 1) &&
                    <div>
                        <Form ref={ref => this.formulariote = ref} onSubmit={this.handleResetPass.bind(this)} className="form form-horizontal">
                            <Item label="Contraseña">
                                {getFieldDecorator('pass_new', {
                                    rules: [{ required: true, message: 'Por favor ingrese un Contraseña' }],
                                    initialValue: ''
                                })(
                                    <Input size="large" type="password" prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Contraseña" />
                                )}
                            </Item>
                            <Item label="Repita la contraseña">
                                {getFieldDecorator('pass_repit', {
                                    rules: [{ required: true, message: 'Por favor ingrese un Contraseña' }],
                                    initialValue: ''
                                })(
                                    <Input size="large" type="password" prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder="Contraseña" />
                                )}
                            </Item>
                            <div className="footer">
                                <button className="btn btn-primary btn-block" type="submit">
                                    Enviar
                                </button>
                            </div>
                        </Form>
                    </div>
                }
            </Rodal>
        );
    }

    handleResetPass(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { usuario } = this.props;
                if (values.pass_new == values.pass_repit) {
                    values.id_usuario = usuario.id_usuario;
                    this.props.dispatch(UsuarioActions.changePass(values));
                } else {
                    Funciones.message("warning", "La contraseña no coincide!");
                }
            }
        });
    }
}

function mapStateToProps(state) {
    const { _usuarios } = state;
    const { usuario } = _usuarios;
    return { usuario };
}

export default connect(mapStateToProps)(Form.create()(Login));
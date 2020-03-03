import React, { Component } from 'react';
import { HashRouter, Route, Link } from 'react-router-dom';
import { Menu as MenuAntd, Button, Switch, Icon, Tooltip } from 'antd';
import { CirclePicker } from 'react-color';
import { AsyncStorage } from 'AsyncStorage';

import UsuarioActions from '../_actions/usuario.actions';
import Indicador from './indicador/indicador.components';
import Usuario from './usuario/usuario.component';
import Categoria from './tickets/categoria.component';
import Pregunta from './tickets/preguntas.component';

class Menu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            pathname: '/',
            collapsed: true,
            cargando: false,
            background: '',
            color: '',
            colors: false,
            colors_default: [
                "#f44336", "#e91e63", "#9c27b0", "#673ab7", "#3f51b5", "#2196f3",
                "#03a9f4", "#00bcd4", "#009688", "#4caf50", "#8bc34a", "#ffeb3b",
                "#000000", "#FFFFFF", "#ff9800", "#ff5722", "#795548", "#607d8b"
            ],
            user: {}
        }
    }

    componentDidMount() {
        AsyncStorage.getItem('menu_tickets', (err, res) => {
            if (!err && res) {
                var menu = JSON.parse(res);
                if (menu.background && menu.color) {
                    this.setState({ background: menu.background, color: menu.color });
                }
            }
        });
        AsyncStorage.getItem('login_tickets', (err, res) => {
            if (!err && res && res != "undefined") {
                const user = JSON.parse(res);
                this.setState({ user });
            }
        });
    }

    render() {
        const { pathname, collapsed, cargando, background, colors, color, user } = this.state;
        return (
            <HashRouter>
                <MenuAntd
                    mode="inline"
                    defaultSelectedKeys={[pathname]}
                    style={{ backgroundColor: background, maxWidth: '20%', position: 'relative' }}
                    inlineCollapsed={collapsed}
                >
                    <MenuAntd.Item key="0" onClick={this.toggleCollapsed} style={{ color: color }}>
                        <Icon type={this.state.collapsed ? 'menu-unfold' : 'menu-fold'} />
                        <span className="title"> Menú Principal  </span>
                    </MenuAntd.Item>

                    <MenuAntd.Item key="/">
                        <Link to="/" onClick={() => { this.setState({ pathname: "/" }) }} style={{ color: color }}>
                            <Icon type="dashboard" />
                            <span>Indicadores</span>
                        </Link>
                    </MenuAntd.Item>

                    <MenuAntd.SubMenu key="1"
                        title={
                            <span style={{ color: color }}>
                                <Icon type="setting" />
                                <span>Configuración</span>
                            </span>
                        }
                    >
                        <MenuAntd.Item key="/usuarios">
                            <Link to="/usuarios" onClick={() => { this.setState({ pathname: "/usuarios" }) }} style={{ color: color }}>
                                <Icon type="user" />
                                <span>Usuarios</span>
                            </Link>
                        </MenuAntd.Item>
                        <MenuAntd.Item key="/preguntas">
                            <Link to="/preguntas" onClick={() => { this.setState({ pathname: "/preguntas" }) }} style={{ color: color }}>
                                <Icon type="star" />
                                <span>Catalogo calificación</span>
                            </Link>
                        </MenuAntd.Item>
                        <MenuAntd.Item key="/categorias">
                            <Link to="/categorias" onClick={() => { this.setState({ pathname: "/categorias" }) }} style={{ color: color }}>
                                <Icon type="tag" />
                                <span>Categorias de tickets</span>
                            </Link>
                        </MenuAntd.Item>
                    </MenuAntd.SubMenu>
                </MenuAntd>

                {this.state.collapsed == false &&
                    <div className="botonera">
                        <div className="row mb-1">
                            {colors &&
                                <div className="col-6">
                                    <h6 className="text-center">Fondo</h6>
                                    <CirclePicker
                                        onChangeComplete={this.handleChangeComplete}
                                        colors={this.state.colors_default}
                                    />
                                    <h6 className="text-center">Texto</h6>
                                    <CirclePicker
                                        onChangeComplete={this.handleChangeCompleteColor}
                                        colors={this.state.colors_default}
                                    />
                                </div>
                            }
                        </div>
                        <div className="row text-center">
                            <div className="col-6 mt-1">
                                <Switch
                                    onChange={() => this.setState({ colors: !colors })}
                                    checkedChildren="Cerrar"
                                    unCheckedChildren="Tema"
                                />
                            </div>
                            {!colors &&
                                <div className="col-6">
                                    <Tooltip title={`Cerrar Sesión, ${user.usuario}`}>
                                        <Button disabled={cargando} type="primary" onClick={() => { this.cerrarSession() }}>
                                            <Icon type="logout" />
                                        </Button>
                                    </Tooltip>
                                </div>
                            }
                        </div>
                    </div>
                }

                <div className="contenido">
                    <Route path="/" exact component={Indicador} />

                    {/* configuraciones */}
                    <Route path="/usuarios" exact component={Usuario} />
                    <Route path="/preguntas" component={Pregunta} />
                    <Route path="/categorias" component={Categoria} />
                </div>
            </HashRouter>
        );
    }

    toggleCollapsed = () => {
        this.setState({
            collapsed: !this.state.collapsed,
        });
    };

    cerrarSession() {
        this.props.dispatch(UsuarioActions.logout());
    }

    handleChangeComplete = (color, event) => {
        this.setState({ background: color.hex });
        AsyncStorage.getItem('menu_tickets', (err, res) => {
            if (!err && res && res != "undefined") {
                var menu = JSON.parse(res);
                menu.color = this.state.color;
                menu.background = color.hex;
                AsyncStorage.setItem('menu_tickets', JSON.stringify(menu));
            } else {
                var menu = { color: this.state.color, background: color.hex };
                AsyncStorage.setItem('menu_tickets', JSON.stringify(menu));
            }
        });
    };

    handleChangeCompleteColor = (color, event) => {
        this.setState({ color: color.hex });
        AsyncStorage.getItem('menu_tickets', (err, res) => {
            if (!err && res && res != "undefined") {
                var menu = JSON.parse(res);
                menu.color = color.hex;
                menu.background = this.state.background;
                AsyncStorage.setItem('menu_tickets', JSON.stringify(menu));
            } else {
                var menu = { background: this.state.background, color: color.hex };
                AsyncStorage.setItem('menu_tickets', JSON.stringify(menu));
            }
        });
    };
}

export default Menu;
import React, { Component } from 'react';
import { AsyncStorage } from "AsyncStorage";
import { Provider } from "react-redux";

import store from "./ConfigureStore";
import Login from "./usuario/login.component";
import Menu from "./menu.component";
import Loading from "../_helpers/Loading.component";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cargando: true,
            login: undefined
        };
    }

    componentDidMount() {
        this.comprobarSesion();
    }

    render() {
        const { cargando, login } = this.state;
        return (
            <Provider store={store}>
                <div className="app">
                    {(cargando == true) &&
                        <div className="fondo fondo-gradiend">
                            <Loading />
                        </div>
                    }
                    {(login == true) &&
                        <Menu />
                    }
                    {(login == false) &&
                        <Login />
                    }
                </div>
            </Provider>
        )
    }

    comprobarSesion() {
        AsyncStorage.getItem('login_tickets', (err, res) => {
            if (!err && res && res != 'undefined') {
                this.setState({ login: true, cargando: false });
            } else {
                this.setState({ login: false, cargando: false });
            }
        });
    }
}

export default App;
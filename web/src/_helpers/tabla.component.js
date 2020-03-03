import React, { Component } from 'react';
import { Tooltip, Switch, Button, Icon } from 'antd';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';

import Funciones from './Funciones';

class Tabla extends Component {
    constructor(props) {
        super(props);
        this.state = {
            asignaciones: []
        }
    }

    render() {
        const { data, arr, height } = this.props;
        return (
            <div className="row">
                <div
                    className='ag-theme-balham' style={{ width: '100%', height: height ? height : '80vh', padding: '30px' }}
                >
                    <AgGridReact
                        floatingFilter={true}
                        enableSorting={true}
                        animateRows={true}
                        enableColResize={true}
                        rowSelection='single'
                        onGridReady={(params) => { params.api.sizeColumnsToFit(); }}
                        rowData={data}
                    >
                        {arr &&
                            arr.map((res, i) => {
                                return (
                                    res.type === 1 ? this.handleText(res, i)
                                        : (res.type === 2 ? this.handleMoney(res, i)
                                            : (res.type === 3) ? this.handleStatus(res, i)
                                                : (res.type === 4) ? this.handleOptios(res, i)
                                                    : (res.type === 5) ? this.handleNumber(res, i)
                                                        : (res.type === 6) ? this.handleUtilidad(res, i)
                                                            : this.handleSoporte(res, i))
                                )
                            })
                        }
                    </AgGridReact>
                </div>
            </div>
        );
    }

    handleText(res, i) {
        return (
            <AgGridColumn key={i} headerName={res.header} field={res.value} width={20} minWidth={70} sortable={res.filter} filter={res.filter}
                cellRendererFramework={(param) => {
                    return (
                        <Tooltip title={param.value}>
                            {param.value}
                        </Tooltip>
                    );
                }}
            />
        );
    }

    handleMoney(res, i) {
        return (
            <AgGridColumn key={i} headerName={res.header} field={res.value} width={20} minWidth={70} sortable={res.filter} filter={res.filter} cellStyle={{ 'text-align': "right" }}
                cellRendererFramework={(param) => {
                    return (
                        <div style={{ color: (param.value < 0) ? '#dc3545' : '#343a40' }}>
                            {Funciones.commaSeparateNumber(parseFloat(param.value).toFixed(2))}
                        </div>
                    );
                }}
            />
        );
    }

    handleNumber(res, i) {
        return (
            <AgGridColumn
                key={i}
                headerName={res.header}
                field={res.value}
                width={20}
                minWidth={70}
                sortable={res.filter}
                filter={res.filter}
                cellStyle={{ 'text-align': "center" }}
                editable={res.edit}
                onCellValueChanged={(value) => this.handleCalcular(value.data)}
            />
        );
    }

    handleUtilidad(res, i) {
        return (
            <AgGridColumn
                key={i}
                headerName={res.header}
                field={res.value}
                width={20}
                minWidth={70}
                sortable={res.filter}
                filter={res.filter}
                cellRendererFramework={(param) => {
                    return (
                        <div
                            style={{
                                height: '100%', width: '100%', margin: 0, padding: 0, textAlign: 'center', color: 'white',
                                backgroundColor: (param.value > 0.45 && param.value < 0.50) ? '#4caf50' : '#f44336'
                            }}
                        >
                            {param.value}
                        </div>
                    )
                }}
            />
        );
    }

    handleStatus(res, i) {
        return (
            <AgGridColumn key={i} headerName={res.header} field={res.value} width={15} minWidth={70} sortable={res.filter} filter={res.filter}
                cellStyle={(param) => (param.value) === "Activo" ? { color: 'green' } : { color: 'red' }}
                cellRendererFramework={(param) => {
                    return (
                        <div>
                            {param.value}&nbsp; <Icon type={param.value === 'Activo' ? 'unlock' : 'lock'} />
                        </div>
                    );
                }}
            />
        );
    }

    handleSoporte(res, i) {
        return (
            <AgGridColumn key={i} headerName={res.header} field={res.value} width={15} minWidth={70} sortable={res.filter} filter={res.filter}
                cellStyle={(param) => (param.value) === "SI" ? { color: 'green' } : { color: 'black' }}
                cellRendererFramework={(param) => {
                    return (
                        param.value === 'SI' ?
                            <div>
                                {param.value} &nbsp; <Icon type="tool" />
                            </div>
                            : <div>{param.value} </div>

                    );
                }}
            />
        );
    }

    handleOptios(res, i) {
        return (
            <AgGridColumn key={i} headerName={res.header} field="data" width={15} minWidth={70}
                cellRendererFramework={(param) => {
                    return (
                        <div className="text-right pt-0 pb-2">
                            {res.edit &&
                                <Button type="link" onClick={() => this.props.handleEdit(param.data)}>
                                    <Icon type="edit" style={{ color: '#B3B6B7', fontSize: 16 }} />
                                </Button>
                            }
                            {res.status &&
                                <Switch size="small" defaultChecked={(param.data.estado == 1) ? true : false}
                                    onChange={(valor) => this.props.handleEditEstado(valor, param.data)} />
                            }
                            {res.ficha &&
                                <Button className="ml-1" type="primary" size="small" onClick={() => this.props.handleEditFicha(param.data)}>
                                    <Icon type="solution" />
                                    Ficha
                                </Button>
                            }
                            {res.asignar &&
                                <Switch size="small" defaultChecked={(param.data.asignar == 1) ? true : false}
                                    onChange={(valor) => this.handleCalcular(param.data, valor)} />
                            }
                        </div>
                    )
                }}
            />
        );
    }

    handleCalcular(data, valor = null) {
        var _data = this.props.data;
        var asignaciones = this.state.asignaciones;
        _data.forEach(element => {
            if ( element.id_pregunta == data.id_pregunta && valor != null ) {
                var estado = (valor == true) ? 1 : 0;
                asignaciones[element.id_pregunta] = { valor: element.valor, asignar: estado };
            } else {
                var estado = (asignaciones[element.id_pregunta] && element.asignar == asignaciones[element.id_pregunta]) ?
                    element.asignar : ((asignaciones[element.id_pregunta] && asignaciones[element.id_pregunta]) ? asignaciones[element.id_pregunta].asignar : element.asignar);
                asignaciones[element.id_pregunta] = { valor: element.valor, asignar: estado };
            }
        });
        this.setState({ asignaciones }, () => {
            this.props.handleAsignacion(this.state.asignaciones);
        });
    }
}

export default Tabla;
import React, { Component } from 'react';
import { Button, Icon, Tooltip, Tabs, Layout, Tree } from 'antd';

import Funciones from './Funciones';
import Tabla from './tabla.component';

const { TreeNode } = Tree;
const { TabPane } = Tabs;

class Ficha extends Component {

    constructor(props) {
        super(props);
        this.state = {
            value: {}
        };
    }

    render() {
        const { ficha, asignados, data } = this.props;
        const { value } = this.state;
        return (
            <div>
                <div className="row">
                    <div className="col-md-8 offset-md-2 text-center">
                        <p className="h4 m-0 p-0"><b>{ficha.titulo.toUpperCase()}</b></p>
                    </div>
                </div>
                <Tabs onChange={() => { this.setState({ value: [] }) }} className="scroll-tabs">
                    {ficha && ficha.tabs.map((tab, i) => {
                        return (
                            <TabPane tab={tab.titulo} key={i} style={{ height: '85%' }}>
                                <div className="row">
                                    {tab.descripcion &&
                                        <div className="col-md-4 text-justify">
                                            <b>Descripcion:</b>
                                            <p>{tab.descripcion}</p>
                                        </div>
                                    }

                                    <div className={tab.descripcion ? "col-md-8" : "col-md-12"}>
                                        <b>{tab.titulo}:</b>
                                        {(tab.tipo == 1 && data[tab.data]) &&
                                            <Tabla
                                                data={data[tab.data]}
                                                arr={tab.tabla}
                                                height="300px"
                                            />
                                        }
                                        {(tab.tipo == 2 && asignados[tab.asignados] && data[tab.data]) &&
                                            <Layout style={{ height: 250, overflowY: 'auto', paddingBottom: 150 }}>
                                                <Tree
                                                    checkable
                                                    multiple
                                                    defaultExpandedKeys={value[i] ? value[i] : asignados[tab.asignados]}
                                                    defaultSelectedKeys={value[i] ? value[i] : asignados[tab.asignados]}
                                                    defaultCheckedKeys={value[i] ? value[i] : asignados[tab.asignados]}
                                                    onCheck={this.onCheck}
                                                >
                                                    <TreeNode title={tab.titulo}>
                                                        {data[tab.data].map((_item) => {
                                                            return (
                                                                <TreeNode title={_item.nombre.replace(/_/g, ' ')} key={_item.id} selectable={false} />
                                                            )
                                                        })}
                                                    </TreeNode>
                                                </Tree>
                                            </Layout>
                                        }
                                        {(tab.tipo == 3 && asignados[tab.asignados] && data[tab.data]) &&
                                            <Layout style={{ height: 250, overflowY: 'auto', paddingBottom: 150 }}>
                                                <Tree
                                                    checkable
                                                    multiple
                                                    defaultExpandedKeys={value[i] ? value[i] : asignados[tab.asignados]}
                                                    defaultSelectedKeys={value[i] ? value[i] : asignados[tab.asignados]}
                                                    defaultCheckedKeys={value[i] ? value[i] : asignados[tab.asignados]}
                                                    onCheck={(checkedKeys, info) => {
                                                        this.onCheck(checkedKeys, info, i);
                                                    }}
                                                >
                                                    {Object.values(data[tab.data]).map((item, i) => (
                                                        <TreeNode title={Object.keys(item).toString().replace(/_/g, ' ')} key={tab.titulo + Object.keys(item) + i} selectable={false} >
                                                            {Object.values(item[Object.keys(item)]).map((_item) => (
                                                                <TreeNode title={_item.nombre.replace(/_/g, ' ')} key={_item.id} selectable={false} />
                                                            ))}
                                                        </TreeNode>
                                                    ))}
                                                </Tree>
                                            </Layout>
                                        }
                                    </div>
                                </div>
                                <div className="text-center footer">
                                    {tab.info &&
                                        <p className="m-0 p-0">
                                            {tab.info.title} &nbsp;
                                            <Tooltip title={tab.info.toltip}>
                                                <Icon type="question-circle-o" />
                                            </Tooltip>
                                        </p>
                                    }
                                    {tab.button &&
                                        <Button type="primary" onClick={() => this.props.handleSave(tab.titulo, value[i])}>
                                            {tab.button}
                                        </Button>
                                    }
                                </div>
                            </TabPane>
                        )
                    })}
                </Tabs>
            </div >
        )
    }

    onCheck(checkedKeys, info, index) {
        let value = {};
        value[index] = [];
        for (const objecto of checkedKeys) {
            if (!Funciones.tiene_letras(objecto)) {
                value[index].push(objecto);
            }
        }
        this.setState({ value });
    };
}

export default Ficha;
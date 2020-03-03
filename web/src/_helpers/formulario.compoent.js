import React, { Component } from 'react';
import { Form, Input, InputNumber, Icon, Tabs, Switch, DatePicker, Select, Button, Slider } from 'antd';
import { CirclePicker } from 'react-color';

var moment = require('moment');
require("moment/min/locales.min");
moment.locale('es');

const { TextArea } = Input;
const { Item } = Form;
const { TabPane } = Tabs;
const { Option } = Select;

class Formulario extends Component {
    constructor(props) {
        super(props);
        this.state = {
            color: undefined
        }
    }

    render() {
        const { arr, tabs, edit, footer, disabled } = this.props;
        return (
            <div className="h-100">
                {arr &&
                    <div>
                        <Form ref={ref => this.formulariote = ref} onSubmit={this.handleSubmit.bind(this)} className="form form-horizontal" className="scroll" >
                            <div className="row">
                                {arr.map((res, i) => {
                                    return (
                                        this.handleGetItem(res, i)
                                    );
                                })
                                }
                            </div>
                        </Form>
                        {edit &&
                            <div className={footer ? 'footer' : ''}>
                                <Button type="primary" block onClick={this.handleSubmit.bind(this)} disabled={disabled}>
                                    ENVIAR
                                </Button>
                            </div>
                        }
                    </div>
                }

                {tabs &&
                    <Tabs onChange={() => { }} className="scroll-tabs">
                        {tabs.map((tab, i) => {
                            return (
                                <TabPane tab={tab.name} key={i}>
                                    <Form ref={ref => this.formulariote = ref} onSubmit={this.handleSubmit.bind(this)} className="form form-horizontal">
                                        <div className="row">
                                            {tab.formulario.map((res, j) => {
                                                return (
                                                    this.handleGetItem(res, j)
                                                )
                                            })}
                                        </div>
                                        {edit &&
                                            <div className="footer">
                                                <Button type="primary" block htmlType="submit" disabled={disabled}>
                                                    ENVIAR
                                                </Button>
                                            </div>
                                        }
                                    </Form>
                                </TabPane>
                            )
                        })}
                    </Tabs>
                }
            </div >
        );
    }

    handleGetItem(res, i) {
        const { getFieldDecorator } = this.props.form;
        const { content } = this.props;
        const layout = {
            labelCol: { span: 8 },
            wrapperCol: { span: 16 },
        };

        if (res.type == 6) {
            return (
                <div className={`col-md-${res.col ? res.col : 12}`} key={i}>
                    <Item label={res.name} className="label">
                        {getFieldDecorator(res.value, {
                            rules: [{ required: res.required, message: 'Por favor ingrese un' + res.name }],
                            initialValue: (content != undefined && content[res.value] != undefined ? moment(content[res.value], "DD-MM-YYYY") : moment())
                        })(
                            this.handleDatePicker(res)
                        )}
                    </Item>
                </div>
            )
        } else {
            return (
                <div className={`col-md-${res.col ? res.col : 12}`} key={i}>
                    <Item
                        label={res.name}
                        className="label"
                        labelCol={res.type == 5 ? { span: 12 } : undefined}
                        wrapperCol={res.type == 5 ? { span: 4 } : undefined}
                    >
                        {getFieldDecorator(res.value, {
                            rules: [{ required: res.required, message: 'Por favor ingrese un' + res.name }],
                            initialValue: (content != undefined && content[res.value] != undefined ? content[res.value] : (res.type == 5) ? 1 : undefined)
                        })(
                            res.type == 1 ? this.handleInput(res)
                                : res.type == 2 ? this.handleTextArea(res)
                                    : res.type == 3 ? this.handleNumber(res)
                                        : res.type == 4 ? this.handleMoneda(res)
                                            : res.type == 5 ? this.handleSwitch(res)
                                                : res.type == 7 ? this.handleSelect(res)
                                                    : res.type == 8 ? this.handleColor(res)
                                                        : this.handleSlider(res)
                        )}
                    </Item>
                </div>
            )
        }
    }

    handleTextArea(res) {
        return (
            <TextArea rows={res.rows ? res.rows : 3} placeholder={res.name} className="inp" />
        )
    }

    handleInput(res) {
        return (
            <Input disabled={(res.disabled) ? res.disabled : false} prefix={<Icon type={res.icon} style={{ color: 'rgba(0,0,0,.25)' }} />} placeholder={res.name} />
        )
    }

    handleNumber(res) {
        return (
            <InputNumber
                className="inp"
                formatter={value => `# ${value}`}
                parser={value => value.replace(/\#\s?|(,*)/g, '')}
                disabled={res.disabled}
            />
        );
    }

    handleMoneda(res) {
        return (
            <InputNumber
                className="inp"
                formatter={value => `$ ${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
                parser={value => value.replace(/\$\s?|(,*)/g, '')}
                disabled={res.disabled}
            />
        )
    }

    handleSwitch(res) {
        const { content } = this.props;
        return (
            <div className="text-center m-0 p-0">
                <Switch
                    defaultChecked={(content != undefined && content[res.value] != undefined) ? (content[res.value] == 1 ? true : false) : true}
                    checkedChildren="SI"
                    unCheckedChildren="NO"
                    onChange={(value) => {
                        this.props.form.setFieldsValue({
                            [res.value]: (value) ? 1 : 0
                        });
                    }}
                />
            </div>
        )
    }

    handleDatePicker(res) {
        return (
            <DatePicker
                className="inp"
                format="DD-MM-YYYY"
                disabled={res.disabled}
            />
        )
    }

    handleSelect(res) {
        const { options } = this.props;
        var condicion = (!res.limpiar) ? '' : null;
        return (
            <Select
                className="inp"
                showSearch
                autoClearSearchValue
                placeholder="Selecciones una opcion"
                optionFilterProp="children"
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                disabled={res.disabled}
                onChange={(value) => {
                    if (res.change) {
                        this.props.optionsChange(value);
                    }
                }}
            >
                {(options && options[res.option]) &&
                    options[res.option].map((item, i) => (
                        (item[res.value] != condicion) &&
                        <Option key={i} value={item[res.value]}>{item.nombre}</Option>
                    ))
                }
            </Select>
        );
    }

    handleSubmit(e) {
        e.preventDefault();
        this.props.form.validateFields((err, values) => {
            if (!err) {
                const { no_reset } = this.props;
                this.props.handleSubmit(values);
                if (!no_reset) {
                    this.props.form.resetFields();
                }
            }
        });
    }

    handleColor(res) {
        const { content } = this.props;
        const { color } = this.state;
        var _color = color ? color : ((content && content[res.value]) ? content[res.value] : 'white');
        return (
            <div className="row">
                <div className="col-8">
                    <CirclePicker
                        onChangeComplete={(color) => {
                            const { hex } = color;
                            this.props.form.setFieldsValue({
                                [res.value]: hex
                            });
                            this.setState({ color: hex });
                        }}
                    />
                </div>
                <div className="col-4">
                    <div style={{
                        width: '100%',
                        height: '100%',
                        backgroundColor: _color,
                        color: _color,
                        border: 'solid 1px black'
                    }}>Color</div>
                </div>
            </div>
        );
    }

    handleSlider(res) {
        const { content } = this.props;
        return (
            <div className="text-center pl-5 pr-5">
                <Slider
                    marks={res.marks}
                    min={res.min}
                    max={res.max}
                    onChange={(value) => {
                        this.props.form.setFieldsValue({
                            [res.value]: value
                        });
                    }}
                    defaultValue={content && content[res.value] ? content[res.value] : 1}
                    step={1}
                />
            </div>
        );
    }
}

export default Form.create()(Formulario);
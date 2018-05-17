import React, {Component} from 'react';
import Select from 'antd/lib/select/'
import './index.scss'
import message from 'antd/lib/message/'
import Button from 'antd/lib/button/'

const Option = Select.Option;
const {IpcRenderer} = window.require('electron')
const configuration = require('../../../main/configs/configuration')


class Setting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            workTime: '1500',
            breakTime: '300',
            voiceName: 'melodious'
        }
        this.audio = new Audio()
    }

    handleWorkTimeChange = (value) => {
        this.setState({workTime: value})
    }

    handleBreakTimeChange = (value) => {
        this.setState({breakTime: value})
    }

    handleVoiceNameChange = (value) => {
        this.setState({voiceName: value}, () => {
            this.audio.src = require('../../../wav/' + this.state.voiceName + '.wav')
            this.audio.play()
        })
    }

    handleSetting = () => {
        configuration.saveSettings('workTime', parseInt(this.state.workTime, 10))
        configuration.saveSettings('breakTime', parseInt(this.state.breakTime, 10))
        configuration.saveSettings('voiceName', this.state.voiceName)
        message.success('修改成功！')
        // IpcRenderer.send('global-setting')
    }

    render() {
        console.log(this.state.value)
        return (
            <div className="setting-wrap">
                <h2>设置</h2>
                <div className="select-item">工作时间：
                    <Select defaultValue={this.state.workTime} style={{width: 120}}
                            onChange={this.handleWorkTimeChange}>
                        <Option value="1200">20分钟</Option>
                        <Option value="1500">25分钟</Option>
                        <Option value="l800">30分钟</Option>
                        <Option value="2100">35分钟</Option>
                        <Option value="2400">40分钟</Option>
                        <Option value="2700">45分钟</Option>
                        <Option value="3000">50分钟</Option>
                        <Option value="3300">55分钟</Option>
                        <Option value="3600">1个小时</Option>
                    </Select>
                </div>
                <div className="select-item">
                    休息时间：
                    <Select defaultValue={this.state.breakTime} style={{width: 120}}
                            onChange={this.handleBreakTimeChange}>
                        <Option value="60">1分钟</Option>
                        <Option value="120">2分钟</Option>
                        <Option value="180">3分钟</Option>
                        <Option value="240">4分钟</Option>
                        <Option value="300">5分钟</Option>
                        <Option value="360">6分钟</Option>
                        <Option value="420">7分钟</Option>
                        <Option value="480">8分钟</Option>
                        <Option value="540">9分钟</Option>
                        <Option value="600">10分钟</Option>
                        <Option value="900">15分钟</Option>
                        <Option value="1200">20分钟</Option>
                    </Select>
                </div>
                <div className="select-item">
                    到点铃声：
                    <Select defaultValue={this.state.voiceName} style={{width: 120}}
                            onChange={this.handleVoiceNameChange}>
                        <Option value="digital">数字铃声</Option>
                        <Option value="melodious">早晨欢乐铃声</Option>
                        {/*<Option value="180">3分钟</Option>*/}
                        {/*<Option value="240">4分钟</Option>*/}
                        {/*<Option value="300">5分钟</Option>*/}
                        {/*<Option value="360">6分钟</Option>*/}
                        {/*<Option value="420">7分钟</Option>*/}
                        {/*<Option value="480">8分钟</Option>*/}
                        {/*<Option value="540">9分钟</Option>*/}
                        {/*<Option value="600">10分钟</Option>*/}
                        {/*<Option value="900">15分钟</Option>*/}
                        {/*<Option value="1200">20分钟</Option>*/}
                    </Select>
                </div>
                <Button onClick={this.handleSetting} type="primary" className="setting-button">设置</Button>
            </div>
        );
    }
}

export default Setting;

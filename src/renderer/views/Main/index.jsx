import React, { PureComponent } from 'react';
import './index.scss';
import Progress from 'antd/lib/progress/';
import Button from 'antd/lib/button';
import * as Events from '../../../shared/events';

const { ipcRenderer } = window.require('electron');

class Main extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            progress: 0, // 进度条
            workTime: 1500, // 工作时间
            breakTime: 300, // 休息时间
            voiceName: 'melodious',
            timeMinute: 0,
            timeSecond: 0,
            isWork: true, // 是否是在工作时间
            isPlaying: false // 是否是在进行中
        };
        this.audio = new Audio();
        this.openSettingWindow = this.openSettingWindow.bind(this);
    }

    componentWillMount() {
        const _this = this;
        ipcRenderer.on(Events.setting_workTime, function(event, workTime) {
            _this.setState(
                {
                    workTime: workTime
                },
                () => {
                    _this.settingTime(_this.state.workTime);
                }
            );
        });
        ipcRenderer.on(Events.setting_breakTime, function(event, breakTime) {
            _this.setState({
                breakTime: breakTime
            });
        });
        ipcRenderer.on(Events.setting_voiceName, function(event, voiceName) {
            _this.setState(
                {
                    voiceName: voiceName
                },
                () => {
                    _this.audio.src = require('../../../wav/' + _this.state.voiceName + '.wav');
                }
            );
        });
        ipcRenderer.send('global-setting');
    }

    componentDidMount() {
        this.setState({ progress: 0 });
    }

    componentWillUnmount() {
        clearInterval(this.interval);
        this.audio.removeEventListener('ended', this.restart);
    }
    // 重新启动
    restart = () => {
        this.setState({ isWork: !this.state.isWork });
        // 如果是工作时间
        if (this.state.isWork) {
            const workTime = this.state.workTime;
            this.settingTime(workTime);
        } else {
            const breakTime = this.state.breakTime;
            this.settingTime(breakTime);
        }
        this.interval = setInterval(this.tick, 1000);
    };
    // 播放音频
    play = () => {
        if (this.state.isPlaying) {
            clearInterval(this.interval);
            this.audio.pause();
        } else {
            this.interval = setInterval(this.tick, 1000);
        }
        this.setState({
            isPlaying: !this.state.isPlaying
        });
    };

    tick = () => {
        const timeSecond = this.state.timeSecond;
        const timeMinute = this.state.timeMinute;
        if (timeMinute === 0 && parseInt(timeSecond, 10) === 0) {
            this.audio.play();
            clearInterval(this.interval);
            if (this.state.isWork) {
                new Notification('休息时间到~~~~🍿', {
                    body: '休息休息！😉'
                });
            } else {
                new Notification('工作时间到~~~~🖥', {
                    body: '赶快去工作吧！😀'
                });
            }
            this.setState({ progress: 0 });
            this.audio.addEventListener('ended', this.restart);
        } else if (parseInt(timeSecond, 10) === 0 && timeMinute >= 0) {
            this.setState(
                {
                    timeMinute: timeMinute - 1,
                    timeSecond: 59
                },
                this.settingProgress
            );
        } else {
            this.setState(
                {
                    timeSecond: timeSecond - 1 < 10 ? '0' + (timeSecond - 1) : timeSecond - 1
                },
                this.settingProgress
            );
        }
    };
    // 设置进度条
    settingProgress = () => {
        this.setState({
            progress: this.state.isWork
                ? this.handleProgress(
                      this.state.timeMinute,
                      this.state.timeSecond,
                      this.state.workTime
                  )
                : this.handleProgress(
                      this.state.timeMinute,
                      this.state.timeSecond,
                      this.state.breakTime
                  )
        });
    };
    // 设置时间
    settingTime = time => {
        this.setState({
            timeMinute: this.handleTime(time).minute,
            timeSecond: this.handleTime(time).second
        });
    };
    // 处理进度条
    handleProgress(minute, second, totalTime) {
        return Math.floor((1 - (minute * 60 + parseInt(second, 10)) / totalTime) * 100);
    }
    // 处理时间
    handleTime(time) {
        let minute = Math.floor(time / 60);
        let second = time - minute * 60;
        if (second < 10) {
            second = '0' + second;
        }
        return { minute, second };
    }

    openSettingWindow() {
        ipcRenderer.send(Events.open_settings_window);
    }

    render() {
        return (
            <main className="wrap">
                <div className="progress-wrap">
                    <Progress type="circle" width={300} percent={this.state.progress} />
                </div>
                <div className="remain-time-wrap">
                    {this.state.timeMinute + ':' + this.state.timeSecond}
                </div>
                <div className="word">{this.state.isWork ? 'Work Time 💻' : 'Break Time 🍔'}</div>
                <div className="go-to-setting-wrap">
                    <Button
                        icon={this.state.isPlaying ? 'pause' : 'caret-right'}
                        shape="circle"
                        size="large"
                        type="primary"
                        onClick={this.play}
                        style={{ marginRight: '10px' }}
                    />
                    <Button
                        icon="setting"
                        shape="circle"
                        size="large"
                        type="primary"
                        onClick={this.openSettingWindow}
                    />
                </div>
            </main>
        );
    }
}

export default Main;

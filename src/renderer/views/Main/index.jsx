import React, {Component} from 'react';
import './index.scss';
import Progress from 'antd/lib/progress'
import Button from 'antd/lib/button'
import {connect} from 'react-redux'
import * as Events from '../../../shared/events'
import {setWorkTime} from '../../store/setting/action'

const {ipcRenderer} = window.require('electron')

class Main extends Component {
    constructor(props) {
        super(props)
        this.state = {
            progress: 0, // 进度条
            workTime: 10, // 工作时间
            breakTime: 6, // 休息时间
            timeMinute: this.handleTime(10).minute,
            timeSecond: this.handleTime(10).second,
            isWork: true, // 是否是在工作时间
            isPlaying: true // 是否是在进行中
        }
        this.audio = new Audio(require('../../../wav/digital.wav'))
        console.log(this.props)
        this.openSettingWindow = this.openSettingWindow.bind(this);
    }

    componentDidMount() {
        this.interval = setInterval(this.tick, 1000)
        if (this.state.isWork) {
            this.setState({progress: this.handleProgress(this.state.timeMinute, this.state.timeSecond, this.state.workTime)})
        } else {
            this.setState({progress: this.handleProgress(this.state.timeMinute, this.state.timeSecond, this.state.breakTime)})
        }
    }

    componentWillUnmount() {
        clearInterval(this.interval)
        this.audio.removeEventListener("ended", this.restart)
    }

    restart = () => {
        if (this.state.isWork) {
            const workTime = this.state.workTime;
            this.setState({
                timeMinute: this.handleTime(workTime).minute,
                timeSecond: this.handleTime(workTime).second
            })
        } else {
            const breakTime = this.state.breakTime;
            this.setState({
                timeMinute: this.handleTime(breakTime).minute,
                timeSecond: this.handleTime(breakTime).second
            })
        }
        this.interval = setInterval(this.tick, 1000)
    }

    play = () => {
        if (this.state.isPlaying) {
            clearInterval(this.interval)
            this.audio.pause();
        } else {
            this.interval = setInterval(this.tick, 1000)
        }
        this.setState({
            isPlaying: !this.state.isPlaying
        })
    }

    tick = () => {
        const timeSecond = this.state.timeSecond;
        const timeMinute = this.state.timeMinute;
        if (timeMinute === 0 && parseInt(timeSecond, 10) === 0) {
            this.startPlayAudio();
            clearInterval(this.interval)
            if (this.state.isWork) {
                new Notification('工作时间到', {
                    body: '赶快去工作吧😀',
                })
                this.setState({progress: 0})
            } else {
                new Notification('休息时间到', {
                    body: '休息休息😉'
                })
                this.setState({progress: 0})
            }
            this.setState({isWork: !this.state.isWork})
            this.audio.addEventListener('ended', this.restart)

        } else if (parseInt(timeSecond, 10) === 0 && timeMinute >= 0) {
            this.setState({
                timeMinute: timeMinute - 1,
                timeSecond: 60,
            }, () => {
                this.setState({
                    progress: this.state.isWork ? this.handleProgress(this.state.timeMinute, this.state.timeSecond, this.state.workTime) : this.handleProgress(this.state.timeMinute, this.state.timeSecond, this.state.breakTime)
                })
            })
        } else {
            this.setState({
                timeSecond: timeSecond - 1 < 10 ? '0' + (timeSecond - 1) : timeSecond - 1,
            }, () => {
                this.setState({
                    progress: this.state.isWork ? this.handleProgress(this.state.timeMinute, this.state.timeSecond, this.state.workTime) : this.handleProgress(this.state.timeMinute, this.state.timeSecond, this.state.breakTime)
                })
            })
        }
    }

    handleProgress(minute, second, totalTime) {
        // console.log("minute" + minute, "second" + parseInt(second), "totalTime" + totalTime)
        // console.log(Math.floor((1 - (minute * 60 + parseInt(second)) / totalTime)))
        return Math.floor((1 - (minute * 60 + parseInt(second, 10)) / totalTime) * 100)
    }

    handleTime(time) {
        let minute = Math.floor(time / 60);
        let second = time - minute * 60;
        if (second < 10) {
            second = '0' + second;
        }
        return {minute, second}
    }

    openSettingWindow() {
        console.log(this.props)
        ipcRenderer.send(Events.open_settings_window)
        this.props.setWorkTime(221)
    }

    componentWillReceiveProps(newProps) {
        console.log('1')
        if (this.state.progress === 0) {
            this.startPlayAudio()
        }
    }

    startPlayAudio() {
        this.audio.currentTime = 0;
        this.audio.play()
    }

    render() {
        return (
            <main className="wrap">
                <div className="progress-wrap">
                    <Progress type="circle" width={300} percent={this.state.progress}/>
                </div>
                <div className="remain-time-wrap">
                    {this.state.timeMinute + ':' + this.state.timeSecond}
                </div>
                <div className="word">
                    To Rest Or Work
                </div>
                <div className="go-to-setting-wrap">
                    <Button icon={this.state.isPlaying ? 'pause' : 'caret-right'} shape="circle" size="large"
                            type="primary"
                            onClick={this.play}/>
                    <Button icon="setting" shape="circle" size="large" type="primary" onClick={this.openSettingWindow}/>
                </div>
            </main>
        );
    }
}

export default connect(state => ({
    breakTime: state.default.breakTime,
    workTime: state.default.workTime
}), {setWorkTime})(Main);

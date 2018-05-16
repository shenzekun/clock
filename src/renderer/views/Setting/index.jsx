import React, {Component} from 'react';
import {connect} from 'react-redux'
import {setWorkTime, setBreakTime} from '../../store/setting/action'
import './index.scss';

class Setting extends Component {
    render() {
        console.log(this.props)
        return (
            <div>
                <button onClick={this.props.setWorkTime.bind(this, 1)}>nihao</button>
            </div>
        );
    }
}

export default connect(state => ({
        state
    }), {
        setWorkTime,
        setBreakTime
    }
)(Setting);

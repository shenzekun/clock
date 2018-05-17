import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
// import {Provider} from 'react-redux'
import Route from './renderer/route/router'
// import store from './renderer/store/store'
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<Route/>, document.getElementById('root'));
registerServiceWorker();

import React, {Component} from 'react'
import {Switch, Route, HashRouter} from 'react-router-dom'
import Main from '../views/Main/index'
import Setting from '../views/Setting/index'

export default class RouteConfig extends Component {
    render() {
        return (
            <HashRouter>
                <Switch>
                    <Route path="/" component={Main} exact/>
                    <Route path="/setting" component={Setting} exact/>
                </Switch>
            </HashRouter>
        )
    }
}

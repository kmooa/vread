import React, {Component} from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import { Router, Route, Redirect} from 'react-router'
import {BrowserRouter, Switch} from 'react-router-dom'
import {createStore} from 'redux';
import {Provider} from 'react-redux';
import reducer from '../imports/reducers/main'

import 'normalize.css';

import Home from '../imports/ui/pages/home/main.jsx';
import Editor from '../imports/ui/pages/editor/main.jsx';
import Viewer from '../imports/ui/pages/viewer/main.jsx';

import '../imports/ui/style/main'


var store = createStore(reducer);


Meteor.startup(() => {
    render(
        <BrowserRouter>
            <Provider store={store}>
                <div id="bootstrap-overrides">
                    <Route render={({location, history, match}) => {

                        var path = location.pathname;

                        return (
                            <div className="default-container">
                                <Switch key={location.key} location={location}>
                                    <Route exact path="/" component={Home}/>
                                    <Route exact path="/editor" component={Editor}/>
                                    <Route exact path="/viewer/:url" component={Viewer}/>
                                </Switch>
                            </div>
                        );
                    }}/>
                </div>
            </Provider>
        </BrowserRouter>
        ,document.getElementById('render-target')
    );
});

class Missing extends Component{
    render(){
        return(
            <div>
                <div>
                    The page you're looking for does not exist :(
                </div>
            </div>
        )
    }
}

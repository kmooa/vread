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
import Missing from '../imports/ui/pages/missing/main.jsx'

import '../imports/ui/style/main'

let store = createStore(reducer);

Meteor.startup(() => {
    render(
        <BrowserRouter>
            <Provider store={store}>
                <div id="bootstrap-overrides">
                    <Route render={({location, history, match}) => {

                        let path = location.pathname;

                        return (
                            <div className="default-container">
                                <Switch key={location.key} location={location}>
                                    <Route exact path="/" component={Home}/>
                                    <Route exact path="/editor" component={Editor}/>
                                    <Route exact path="/viewer/:url" component={Viewer}/>
                                    <Route component={Missing} />
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

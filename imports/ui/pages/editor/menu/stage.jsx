/**
 * Created by JohnBae on 10/9/17.
 */

import React from 'react';
import {connectAdvanced} from "react-redux";
import {bindActionCreators} from 'redux';
import {Button, ButtonToolbar} from 'react-bootstrap';

import * as Actions from "../../../../actions/main";
import featherize from '../../../components/featherEffect';

//Environemnt presets
let environments = [
    {label: "Sandbox", environment: "default", particles: "none"},
    {label: "Forest", environment: "forest", particles: "none"},
    {label: "Desert", environment: "yavapai", particles: {type: "snow", color: "white", amount: 2000}},
    {label: "Dystopia", environment: "tron", particles: {type: "dust", color: "yellow", amount: 2000}},
    ];

let particles = [
    {type: "rain", label: "rain"},
    {type: "snow", label: "snow"},
    {type: "dust", label: "dust"},
    {type: "default", label: "stars"},
    {type: "none", label: "none"}];

class Scenes extends React.Component{

    constructor(props){
        super(props);
        this.state = {profile: ""}
    }

    editScene(scene){
        this.props.actions.setStageScene(scene.environment);
        this.props.actions.setStageParticles(scene.particles);
    }

    uploadUserImage(event){

        let self = this,
            input = event.target;
        if (input.files && input.files[0]) {
            let reader = new FileReader();
            reader.onload = function (e) {
                featherize(e.target.result, function(feathered){
                    self.setState({profile: feathered});
                    self.props.actions.addUserStage(feathered);
                    self.props.actions.setUserStage(feathered);
                });
            }
            reader.readAsDataURL(input.files[0]);
        }
    }

    render(){

        let self = this;

        let Environments = environments.map(function(elem){

            return (
                <Button key = {elem.label}
                        className="menu-item"
                        onClick={()=>self.editScene(elem)}>
                    {elem.label}
                </Button>
            )
        });

        let i = 1;
        let User = this.props.user.map(function(elem, iter){

            return <Button key = {i}
                           onClick={()=>self.props.actions.setUserStage(elem)}
                           className="menu-item">{i++}</Button>
        });

        return(
            <div>
                <div className="menu-row" style={{display: "inline-block"}}>
                    <Button className="menu-item-square emptyButton">
                        <img style={{
                            verticalAlign: "middle",
                            height: "2rem",
                        }}src="/assets/icons/scene.svg"/>
                    </Button>
                </div>
                <div className="menu-row" style={{display: "inline-block", overflow: "scroll", width: 'calc(100vw - 65px)', marginLeft: "0"}}>
                    <ButtonToolbar style={{width: "5000px"}}>
                        <Button className="menu-item-square"
                                onClick={()=> this.refs.uploader.click()}>
                            <img style={{
                                verticalAlign: "middle",
                                height: "2rem",
                            }}src="/assets/icons/add.svg"/>
                        </Button>
                        {Environments}
                        {this.props.user.size > 0 ?
                            <Button className="menu-item"
                                    onClick={()=>this.props.actions.setUserStage(null)}>
                                Clear User Image
                            </Button> : ""}
                        {User}
                    </ButtonToolbar>
                </div>
                <input style={{height: "0px", width: "0px"}} type="file" id="input" accept=".png, .jpg" onChange = {(event)=> this.uploadUserImage(event)} ref="uploader"/>
            </div>
        )
    }
}

function selector(dispatch) {

    let result = {};
    const actions = bindActionCreators(Actions, dispatch);

    return (nextState) => {

        const nextResult = {
            actions: actions,
            stage: nextState.stage.get("scene"),
            user: nextState.stage.get("user")
        };

        if(nextResult!=result){
            result = nextResult;
        }
        return result
    }
}

export default connectAdvanced(selector)(Scenes);

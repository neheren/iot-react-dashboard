import React, { Component } from 'react'
import PropTypes from 'prop-types'
import auth from '../auth'
import {Switch, Button, Grid, TextField} from '@material-ui/core'
import styled from 'styled-components'
import CircularProgress from '@material-ui/core/CircularProgress'
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import Typography from '@material-ui/core/Typography'
import CloudDoneIcon from '@material-ui/icons/CloudDone'
import ErrorIcon from '@material-ui/icons/Error'
import LoopIcon from '@material-ui/icons/Loop'

const Root = styled.div`
    padding: 20px 0;
`

const Settings = styled.div`
    padding: 20px 20px 20px 0;
    `

const IconWrapper = styled.div`
    display: flex;
    align-items: center;
    margin: 10px 0;
`

const TrainedText = styled.div`
    font-size: 12px;
    margin-left: 10px;
    display: inline;
`

export default class PredictionControl extends Component {
    static propTypes = {
        prop: PropTypes,
        onPredictionStateChanged: PropTypes.func,
    }

    constructor(props) {
        super(props)
        
        this.state = {
            login: auth.getAuthToken(auth.USER_TYPES.SUPPLIER),
            predictionState: {
                enable: false,
            },
            firstLoad: true,
            modelTrained: false,
            epochsNo: 1,
            learningRate: 0.2,
            hiddenLayers: 4,
            windowSize: 5,
 
            isTraining: false,
        }
        this.isModelTrained(1).then(res => {
            console.log({res})
            this.setState({modelTrained: res})
        })
        
    }

	isModelTrained = async (id) => {
		let response = await fetch (
			`https://smart-meter-app-iot.herokuapp.com/supplier/predict/${id}
			?secret_token=${this.state.login.token}`
        );
        if(response.status == 204) { 
            return 'TRAINING'
        }
        return (response.status == 200)
    }
    

    handleChange = (updatePredictionProp) => {
        //console.log({...this.state.predictionState, ...updatePredictionProp})
        this.setState({predictionState: {...this.state.predictionState, ...updatePredictionProp}}, () => {
            this.props.onPredictionStateChanged(this.state.predictionState)
        })
    }

    componentWillMount() {
        this.props.onPredictionStateChanged && this.props.onPredictionStateChanged(this.state.predictionState)
        // this.predict(1).then(res => {
        //     console.log({res})
        // })
    }

    async trainModel (epochsNo, learningRate, hiddenLayers, windowSize) {
        try{
            let response = await fetch (
                `https://smart-meter-app-iot.herokuapp.com/supplier/generate-model?secret_token=${
                        this.state.login.token
                    }&epochsNo=${
                        epochsNo
                    }&learningRate=${
                        learningRate
                    }&hiddenLayers=${
                        hiddenLayers
                    }&windowSize=${
                        windowSize
                    }
                `
            );
            if(response.status == 204) { 
                alert('Model already training')
                return null
            }
            if(response.status == 200){
                alert('Model trained')
                const data = await response.json()
                return data
            } else {
                alert('Training error')
                return null
            }
        }catch(e){
            alert('Training error')
            alert(e)
        } finally { 
        }
    }
    
    handleModelTraining = () =>  {
        this.setState({isTraining: true})
        
        const { epochsNo, learningRate, hiddenLayers, windowSize } = this.state
        this.trainModel(epochsNo, learningRate, hiddenLayers, windowSize).then((data) => {
            this.isModelTrained(1).then(res => {
                console.log('TRAINDES: ' + res)
                this.setState({isTraining: false, modelTrained: res})
            })
        })
    }


    render() {
        return (
            <Root>
                {!!this.state.modelTrained}
                {
                    this.state.modelTrained === 'TRAINING' 
                    ? <>
                        <IconWrapper>
                            <LoopIcon fontSize="small"/>
                            <TrainedText>Model training</TrainedText> 
                        </IconWrapper>
                    </>
                    : (this.state.modelTrained 
                        ? <>
                            <IconWrapper>
                                <CloudDoneIcon fontSize="small"/>
                                <TrainedText>Model trained</TrainedText> 
                            </IconWrapper>
                        </>
                        : <>
                            <IconWrapper>
                                <ErrorIcon fontSize="small" color="secondary" />
                                <TrainedText>Model not trained </TrainedText> 
                            </IconWrapper>
                        </>
                    )
                }
                <div>
                    <ExpansionPanel>
                        <ExpansionPanelSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1bh-content"
                            id="panel1bh-header"
                        >
                            <Grid container spacing={2} alignItems="center">
                                <Grid item>
                                    <Switch
                                        disabled={!this.state.modelTrained}
                                        checked={this.state.predictionState.enable}
                                        onChange={(change) => this.handleChange({enable: change.target.checked})}
                                        name="checkedA"
                                        inputProps={{ 'aria-label': 'secondary checkbox' }}
                                    />
                                </Grid>
                                <Grid item>
                                    <Typography>
                                        Enable prediction
                                    </Typography>
                                </Grid>
                            </Grid>
                        </ExpansionPanelSummary>
                        <ExpansionPanelDetails>
                            <Settings>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <TextField type="number" variant="outlined" value={this.state.epochsNo} label={'Number of epochs'} 
                                        onChange={event => this.setState({epochsNo: event.target.value})} />    
                                    </Grid>    
                                    <Grid item xs={6}>
                                        <TextField type="number" variant="outlined" value={this.state.learningRate} label={'Learning rate'} 
                                        onChange={event => this.setState({learningRate: event.target.value})} />    
                                    </Grid>    
                                    <Grid item xs={6}>
                                        <TextField type="number" variant="outlined" value={this.state.hiddenLayers} label={'Hidden layers'} 
                                        onChange={event => this.setState({hiddenLayers: event.target.value})} />    
                                    </Grid>    
                                    <Grid item xs={6}>
                                        <TextField type="number" variant="outlined" value={this.state.windowSize} label={'Window size'} 
                                        onChange={event => this.setState({windowSize: event.target.value})} />    
                                    </Grid>    
                                    <Grid item xs={6}>
                                        <Button fullWidth color="secondary" variant="contained" onClick={this.handleModelTraining} disabled={this.state.isTraining}>  
                                            {this.state.isTraining ? <><CircularProgress size={20} color="secondary"/> Training model</> : 'Train model'} 
                                        </Button>
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TrainedText>
                                            Model can train eventhough error panels are shown
                                        </TrainedText>
                                    </Grid>
                                </Grid>

                            </Settings>
                        </ExpansionPanelDetails>
                    </ExpansionPanel>
                </div>
            </Root>
        )
    }
}

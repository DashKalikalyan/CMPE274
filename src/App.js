import React, { Component } from 'react';
import Prediction from './Prediction/Prediction';
import './App.css';
let _ = require('lodash');

class App extends Component {
    constructor(props){
        super(props);
        this.state = {
            search: '',
            fromPredictions: [],
            toPredictions: [],
            currentFromFocus: -1,
            currentToFocus: -1,
            currentFromSelected: '',
            currentToSelected: ''
        };
        this.debouncedGetLocationFunction = _.debounce(this.getLocationHandler, 500);
    }

    getLocationHandler = (search, sourceOrDestination) => {
        fetch('https://api.locationiq.com/v1/autocomplete.php?key=81fb40cd2a126e&q='
            + search + '&viewbox=-87.5239841,42.0230219,-87.940101,%2041.643919')
            .then(response => response.json())
            .then((places) => {
                    places = places.map(place => {
                    return {
                        'display_name': place.display_name,
                        'lat': place.lat,
                        'lon': place.lon
                    };
                    });
                    places = _.uniq(places);

                    if(sourceOrDestination === 'source')
                    this.setState({fromPredictions: places});
                    if(sourceOrDestination === 'destination')
                    this.setState({toPredictions: places});
            })
            .catch((error) => {
                console.log(error);
            })
    };

    onInputSourceHandler = (event) => {
        if(event.target.value)
            this.debouncedGetLocationFunction(event.target.value, 'source');
        else {
            this.setState({fromPredictions: [],
                            currentFromFocus: -1,
                            currentFromSelected: ''});
            this.setState({toPredictions: [],
                currentToFocus: -1,
                currentToSelected: ''});
        }
    };

    onInputDestinationHandler = (event) => {
        if(event.target.value)
            this.debouncedGetLocationFunction(event.target.value, 'destination');
        else {
            this.setState({toPredictions: [],
                            currentToFocus: -1,
                            currentToSelected: ''});
        }
    };

    keyDownSourceHandler = (event) => {
        if(event.keyCode === 40 && this.state.currentFromFocus < this.state.fromPredictions.length-1){
            let newFocus = this.state.currentFromFocus + 1;
            let newSelected = this.state.fromPredictions[newFocus];
            this.setState({currentFromFocus: newFocus,
                            currentFromSelected: newSelected});
        } else if(event.keyCode === 38 && this.state.currentFromFocus > 0){
            let newFocus = this.state.currentFromFocus - 1;
            let newSelected = this.state.fromPredictions[newFocus];
            this.setState({currentFromFocus: newFocus,
                            currentFromSelected: newSelected});
        } else if(event.keyCode === 13){
            this.setState({fromPredictions: [],
                            currentFromFocus: -1});
        }
    };

    keyDownDestinationHandler = (event) => {
        if(event.keyCode === 40 && this.state.currentToFocus < this.state.toPredictions.length-1){
            let newFocus = this.state.currentToFocus + 1;
            let newSelected = this.state.toPredictions[newFocus];
            this.setState({currentToFocus: newFocus,
                currentToSelected: newSelected});
        } else if(event.keyCode === 38 && this.state.currentToFocus > 0){
            console.log(this.state.toPredictions);
            let newFocus = this.state.currentToFocus - 1;
            let newSelected = this.state.toPredictions[newFocus];
            console.log(newFocus);
            console.log(newSelected);
            this.setState({currentToFocus: newFocus,
                currentToSelected: newSelected});
        } else if(event.keyCode === 13){
            this.setState({toPredictions: [],
                            currentToFocus: -1});
        }
    };

    selectSourceHandler = (selected) => {
        this.setState({currentFromSelected: selected,
                        currentFromFocus: -1,
                        fromPredictions: []});
    };

    selectDestinationHandler = (selected) => {
        this.setState({currentToSelected: selected,
                        currentToFocus: -1,
                        toPredictions: []});
    };

    predictionHandler = () => {
        console.log(this.state.currentToSelected.lat, this.state.currentToSelected.lon);
        console.log(this.state.currentFromSelected.lat, this.state.currentFromSelected.lon);
    };


    render() {
        console.log(this.state);
        let fromPredictions = this.state.fromPredictions.map((fromPrediction, index) => {
            return(
                <Prediction
                    id = {index}
                    selectHandler = {this.selectSourceHandler}
                    focus = {this.state.currentFromFocus}
                    prediction={fromPrediction}/>
            );
        });
        let toPredictions = this.state.toPredictions.map((toPrediction, index) => {
            return(
                <Prediction
                    id = {index}
                    selectHandler = {this.selectDestinationHandler}
                    focus = {this.state.currentToFocus}
                    prediction={toPrediction}/>
            );
        });
        return (
            <div className="container">
                <div className="search-container">
                    <div className="welcome"><h1>Welcome</h1></div>
                    <div className="row">
                        <div className="col-md-6">
                            <div className="autocomplete">
                                <input class="form-control" id = "from-source"
                                       onInput={ this.onInputSourceHandler }
                                       value={this.state.currentFromSelected.display_name}
                                       onKeyDown={this.keyDownSourceHandler}
                                       id="inputdefault" type="text"/>
                                <div className="autocomplete-items">
                                    {fromPredictions}
                                </div>
                            </div>
                            <div className="autocomplete">
                                <input class="form-control" id="to-destination"
                                       onInput={ this.onInputDestinationHandler }
                                       value={this.state.currentToSelected.display_name}
                                       onKeyDown={this.keyDownDestinationHandler}
                                       id="inputdefault" type="text"/>
                                <div className="autocomplete-items">
                                    {toPredictions}
                                </div>
                            </div>
                            <button type="button" class="btn btn-success" onClick={this.predictionHandler}>Predict!!</button>
                        </div>
                        <div className="col-md-6">

                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

export default App;

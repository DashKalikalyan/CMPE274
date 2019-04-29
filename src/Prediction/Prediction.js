import React from 'react';
import './Prediction.css';

const prediction = (props) => {
    let cls = 'autocomplete-item ';
    if (props.id === props.focus){
        cls += 'active-focus';
    }
    return(
        <div
            className={cls}
            onClick={() => props.selectHandler(props.prediction)}>
            {props.prediction.display_name}
        </div>
    );
};
export default prediction;
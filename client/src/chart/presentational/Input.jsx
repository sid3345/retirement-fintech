import React from "react";
import PropTypes from "prop-types";
import * as d3 from "d3";


const roundIt = (x) => {
    switch (true) {
        case (x < 100):
            return Math.round(x);
        case (x < 1000):
            return Math.round(x / 100) * 100;
        case (x < 10000):
            return Math.round(x / 1000) * 1000;
        case (x < 50000):
            return Math.floor(x / 5000) * 5000;
        case (x < 100000):
            return Math.round(x / 10000) * 10000;
        case (x < 1000000):
            return Math.floor(x / 50000) * 50000;
        case (x >= 1000000):
            return Math.round(x / 100000) * 100000;
    }
}

const Input = ({ label, text, type, id, paramId, personId, min, max, value, handleChange, valueFormat }) => {
    return ( 
        <div className="form-group">
            <label htmlFor={label}>{d3.format(".2s")(roundIt(parseInt(text)))}</label>
            <input
                type={type}
                className="form-control"
                id={id}
                value={value}
                onChange={(e) => handleChange( personId, paramId, e )}
                min={min}
                max={max}
                required
            />
        </div> )
};
Input.propTypes = {
    label: PropTypes.string.isRequired,
    text: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    id: PropTypes.string.isRequired,
    paramId: PropTypes.string.isRequired,
    personId: PropTypes.number.isRequired,
    min: PropTypes.number,
    max: PropTypes.number,
    value: PropTypes.number.isRequired,
    handleChange: PropTypes.func.isRequired,
    valueFormat: PropTypes.string,
};
export default Input;
import React from 'react';
import './App.css';

const Square = (props) => {
    const {onClick, id, background, value} = props;
    return (
      <button type="button" className="square" onClick={onClick} id={id} style={{ background}}>
        {value}
      </button>
    );
  }

export default Square;
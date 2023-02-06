import React from "react";
import styled from 'styled-components';

const InputComponent = styled.input`
  padding: 0.5em;
  margin: 0.2em;
  color: black;
  background: #DEDEDE;
  border: none;
  border-radius: 3px;
  width: 100%;
  placeholder: "Type your comment here..."
`;




const Input = ({ type, variant, className, id, onClick, size, placeholder, newinpt, value, onChange, width, children }) => {
    return <InputComponent
        type={type ? type : "input"}
        variant={variant}
        className={className ? `input-comp ${className}` : "input-comp"}
        id={id}
        onClick={onClick}
        size={size}
        placeholder={placeholder}
        newinpt = {newinpt}
        value = {value}
        onChange = {onChange}
        width={width}
    >
        {children}
    </InputComponent >

};

export default Input;
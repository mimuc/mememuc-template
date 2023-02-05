import React from "react";
import styled from 'styled-components';

const InputComponent = styled.input`
  padding: 0.5em;
  margin: 0.5em;
  color: black;
  background: #DEDEDE;
  border: none;
  border-radius: 3px;
  width: 800px;
  placeholder: "Type your comment here..."
`;




const Input = ({ type, variant, className, id, onClick, size, placeholder, width, children }) => {
    return <InputComponent
        type={type ? type : "input"}
        variant={variant}
        className={className ? `input-comp ${className}` : "input-comp"}
        id={id}
        onClick={onClick}
        size={size}
        placeholder={placeholder}
        width={width}
    >
        {children}
    </InputComponent >

};

export default Input;
import React from "react";
import styled from 'styled-components';

const ButtonComponent = styled.button`
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    text-decoration: none;
    vertical-align: middle;
    margin: 0.18rem;
    cursor: pointer;
    user-select: none;
    border-radius: 0.3rem;
    padding: 0 
        ${props => props.size === "sm" 
        ? "1.1rem" 
        : props.size === "xs" 
        ? "0.8rem" 
        : props.size === "md" 
        ? "1.4rem" 
        : props.size === "1g" 
        ? "1.6rem" 
        : "1.1rem"};
    height: ${(props) =>
      props.size === "sm" 
      ? "34px" 
      :props.size === "xs" 
      ? "28px"
      : props.size === "md" 
      ? "37px"
      : props.size === "lg" 
      ? "40px" : "34px"
    };
    font-family: "Rubik",sans-serif;
    font-weight: 400;
    border: 2px solid white;
    background-color: ${(props) => 
      props.variant === "light" 
        ? "#f8f9fa" 
        : props.variant === "dark" 
        ? "#A0A0A0" 
        : props.variant === "like" 
        ? "#EBFBDB"
        : props.variant === "liked" 
        ? "#55B045" 
        : props.variant === "dislike"
        ? "#FAB5B5"
        : props.variant === "disliked" 
        ? "#DE2828"
        : props.variant === "primary" 
        ? "#0d6efd" 
        : props.variant === "secondary" 
        ? "#6c757d"
        :"f8f9fa"};
    color: ${(props) => 
        props.variant === "light" 
              ? "#6F6F6F" 
              : props.variant === "dark" 
              ? "#ffffff" 
              : props.variant === "like" 
              ? "#4A8D3E"
              : props.variant === "liked" 
              ? "#ffffff" 
              : props.variant === "dislike"
              ? "#A61C1C"
              : props.variant === "disliked" 
              ? "#ffffff"
              : props.variant === "primary" 
              ? "#0d6efd" 
              : props.variant === "secondary" 
              ? "#6c757d"
              :"212529"};
`;




const Button = ({ type, variant, className, id, onClick, size, children }) => {
    return <ButtonComponent
        type={type ? type : "button"}
        variant={variant}
        className={className ? `button-comp ${className}` : "button-comp"}
        id={id}
        onClick={onClick}
        size={size}
    >
        {children}
    </ButtonComponent >

};

export default Button;
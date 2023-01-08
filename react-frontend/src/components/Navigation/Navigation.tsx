import {Link} from "react-router-dom";
import styled from "styled-components";

const NavLink = styled(Link)`
  padding-right: 20px;
`;

export const Navigation = () => {
    return (
        <div style={{marginLeft: 20}}>
            <NavLink to={'/'}>Start</NavLink>
            <NavLink to={'/profile'}>Profile</NavLink>
            <NavLink to={'/new'}>New</NavLink>
        </div>
    )
}
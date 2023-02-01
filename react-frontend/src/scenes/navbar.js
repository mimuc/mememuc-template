import {Link, useMatch, useResolvedPath} from "react-router-dom"

export default function Navbar(){  
    return <nav className="nav">
    <Link to="/" className = "site-title" >
        Meme Generator
    </Link>
    <ul>
        <CustomLink to = "/create">Create</CustomLink>
        <CustomLink to = "/discover">Discover</CustomLink>
        <CustomLink to = "/profile">Profile</CustomLink>
        <CustomLink to = "/editor">Editor</CustomLink>
    </ul>
</nav>;
};

function CustomLink({to, children,...props}){
    const resolvedPath = useResolvedPath(to)
    const isActive = useMatch({path: resolvedPath.pathname, end:true})
    
    return(
        <li className={isActive ? "active":""}>
            <Link to = {to} {...props}>
                {children}</Link>
        </li>
    )

}


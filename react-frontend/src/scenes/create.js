import { useNavigate } from "react-router-dom"

export default function Create() {
    const navigate = useNavigate()

    return(
    <>
        <h1>Create</h1>
        <button onClick={() => navigate('/discover')}>Editor</button>
    </>
    ) 
}
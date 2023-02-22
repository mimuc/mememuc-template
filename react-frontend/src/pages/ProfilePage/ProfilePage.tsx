import {useEffect, useState} from "react";
import Cookies from 'js-cookie';
import {theme, Typography} from "antd";
import {DraftList} from "src/components";

const {Title} = Typography;

export const ProfilePage = () => {
    const {token} = theme.useToken();

    const [userData, setUserData] = useState<any>(null);

    useEffect(() => {
        const fetchUserData = async () => {
            const response = await fetch("http://localhost:3001/my", {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${Cookies.get("token")}`,
                },
            });

            if (response.ok) {
                const data = await response.json();
                setUserData(data);
            }
        };

        fetchUserData();
    }, []);

    return (
        <>
            <Title>Profile Page</Title>
            {userData && (
                <>
                    <p>Name: {userData.name}</p>
                    <p>Email: {userData.email}</p>
                    <p>Username: {userData.username}</p>
                </>
            )}
            <Title level={2}>Your Drafts</Title>
            <DraftList/>
            <Title level={2} style={{marginTop: token.marginXXL}}>Your Memes</Title>
            {/*TODO: display memes here if signed in, else Empty with not signed in info and link to sign in page*/}
        </>
    )
}

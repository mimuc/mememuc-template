import {Outlet, RouteObject} from "react-router-dom";
import {BasicLayout, MemeLayout} from "src/layouts";
import {ApiPage, EditorPage, LoginPage, MemeListPage, ProfilePage, RegisterPage, SingleMemePage} from "src/pages";
import {ErrorPage} from "./ErrorPage/ErrorPage";

const BasicWrapper = () => {
    return (
        <BasicLayout>
            <Outlet/>
        </BasicLayout>
    );
}

const MemeWrapper = () => {
    return (
        <MemeLayout>
            <Outlet/>
            <MemeListPage/>
        </MemeLayout>
    );
}

export const routes: RouteObject[] = [
    {
        errorElement: <ErrorPage/>,
        path: '/',
        children: [
            {
                element: <MemeWrapper/>,
                path: 'memes',
                children: [
                    {
                        path: ':memeId',
                        element: <SingleMemePage/>
                    }
                ]
            },
            {
                element: <BasicWrapper/>,
                children: [
                    {
                        index: true,
                        element: <EditorPage/>
                    },
                    {
                        path: 'profile',
                        element: <ProfilePage/>
                    },
                    {
                        path: 'api',
                        element: <ApiPage/>
                    },
                    {
                        path: 'login',
                        element: <LoginPage/>
                    },
                    {
                        path: 'register',
                        element: <RegisterPage/>
                    }
                ]
            }
        ]
    }
]
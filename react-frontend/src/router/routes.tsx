import {Outlet, RouteObject} from "react-router-dom";
import {MemeLayout} from "src/layouts";
import {ApiPage, MemePage, MemesPage, NewPage, ProfilePage} from "src/pages";
import {ErrorPage} from "./ErrorPage/ErrorPage";

// const AppWrapper = () => {
//     return <AppLayout>
//         <Outlet/>
//     </AppLayout>
// }

const MemeWrapper = () => {
    return <MemeLayout>
        <Outlet/>
        <MemesPage/>
    </MemeLayout>
}

export const routes: RouteObject[] = [
    {
        element: <Outlet/>,//<AppWrapper/>,
        errorElement: <ErrorPage/>,
        path: '/',
        children: [
            {
                index: true,
                element: <NewPage/>
            },
            {
                element: <MemeWrapper/>,
                path: 'memes',
                children: [
                    {
                        path: ':memeId',
                        element: <MemePage/>
                    }
                ]
            },
            {
                path: 'profile',
                element: <ProfilePage/>
            },
            {
                path: 'api',
                element: <ApiPage/>
            }
        ]
    }
]
import {Outlet, RouteObject} from "react-router-dom";
// import {AppLayout} from "src/layouts";
import {ErrorPage} from "./ErrorPage/ErrorPage";
import {MemesPage, MemePage, NewPage, ProfilePage, StartPage} from "src/pages";

// const AppWrapper = () => {
//     return <AppLayout>
//         <Outlet/>
//     </AppLayout>
// }

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
                path: 'memes',
                children: [
                    {
                        index: true,
                        element: <MemesPage/>
                    },
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
        ]
    }
]
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import {
    createBrowserRouter,
    RouterProvider,
    Route,
    createRoutesFromElements,
} from 'react-router-dom';
import AgentLogin from './Pages/AgentLogin';
import HeadLogin from './Pages/HeadLogin';
import RMLogin from './Pages/RMLogin';
import Home from './Pages/Home';
import Layout from './Pages/Layout';
import Agents from './Pages/Agents';
import Rm from './Pages/Rm';
import Customers from './Pages/Customers';
import Policy from './Pages/Policy';
import Profile from './Pages/Profile';
import CustomerPage from './Pages/CustomerPage';
import PolicyDetails from './Pages/PolicyDetails';
// const [finalAgentId, finaliseAgentId] = React.useState('');
// const [finalHeadId, finaliseHeadId] = React.useState('');
// const [finalRmId, finaliseRmId] = React.useState('');

// const router = createBrowserRouter([
//     {
//         path: '/',
//         element: <AgentLogin />,
//     },
//     {
//         path: '/login/agent',
//         element: <AgentLogin />,
//     },
//     {
//         path: '/login/head',
//         element: <HeadLogin />,
//     },
//     {
//         path: '/login/rm',
//         element: <RMLogin />,
//     },
//     {
//         path: '/agent',
//         element: <Layout isAgent={true} />,
//         children: [
//             {
//                 path: '',
//                 element: <Home />,
//             },
//             {
//                 path: 'home',
//                 element: <Home />,
//             },
//             {
//                 path: 'rms',
//                 element: <Rm />,
//             },
//             {
//                 path: 'agents',
//                 element: <Agents />,
//             },
//             {
//                 path: 'customers',
//                 element: <Customers />,
//             },
//             {
//                 path: 'policies',
//                 element: <Policy />,
//             },
//             {
//                 path: 'profile',
//                 element: <Profile />,
//             },
//             // Add more routes for rm
//         ],
//     },
//     {
//         path: '/head',
//         element: <Layout isHead={true} />,
//         children: [
//             {
//                 path: '',
//                 element: <Home />,
//             },
//             {
//                 path: 'home',
//                 element: <Home />,
//             },
//             {
//                 path: 'rms',
//                 element: <Rm />,
//             },
//             {
//                 path: 'agents',
//                 element: <Agents />,
//             },
//             {
//                 path: 'customers',
//                 element: <Customers />,
//             },
//             {
//                 path: 'policies',
//                 element: <Policy />,
//             },
//             {
//                 path: 'profile',
//                 element: <Profile />,
//             },
//             // Add more routes for rm
//         ],
//     },
//     {
//         path: '/rm',
//         element: <Layout isRm={true} />,
//         children: [
//             {
//                 path: '',
//                 element: <Home />,
//             },
//             {
//                 path: 'home',
//                 element: <Home />,
//             },
//             {
//                 path: 'rms',
//                 element: <Rm />,
//             },
//             {
//                 path: 'agents',
//                 element: <Agents />,
//             },
//             {
//                 path: 'customers',
//                 element: <Customers />,
//             },
//             {
//                 path: 'policies',
//                 element: <Policy />,
//             },
//             {
//                 path: 'profile',
//                 element: <Profile />,
//             },
//             // Add more routes for rm
//         ],
//     },
// ]);

const router = createBrowserRouter(
    createRoutesFromElements(
        <>
            <Route path="/" element={<AgentLogin />} />
            <Route path="/login/agent" element={<AgentLogin />} />
            <Route path="/login/head" element={<HeadLogin />} />
            <Route path="/login/rm" element={<RMLogin />} />

            <Route path="/agent" element={<Layout isAgent={true} />}>
                <Route path="" element={<Home />} />
                <Route path="home" element={<Home />} />
                <Route path="rms" element={<Rm />} />
                <Route path="agents" element={<Agents />} />

                <Route path="customers" element={<Customers />} />
                <Route path="customerdetails/:id" element={<CustomerPage />} />
                <Route path="policies" element={<Policy />} />
                <Route path="policydetails/:id" element={<PolicyDetails />} />
                <Route path="profile" element={<Profile />} />
                {/* Add more routes for agent as needed */}
            </Route>

            <Route path="/head" element={<Layout isHead={true} />}>
                <Route path="" element={<Home />} />
                <Route path="home" element={<Home />} />
                <Route path="rms" element={<Rm />} />
                <Route path="agents" element={<Agents />} />
                <Route path="customers" element={<Customers />} />
                <Route path="customerdetails/:id" element={<CustomerPage />} />
                <Route path="policies" element={<Policy />} />
                <Route path="policydetails/:id" element={<PolicyDetails />} />

                <Route path="profile" element={<Profile />} />
                {/* Add more routes for head as needed */}
            </Route>

            <Route path="/rm" element={<Layout isRm={true} />}>
                <Route path="" element={<Home />} />
                <Route path="home" element={<Home />} />
                <Route path="rms" element={<Rm />} />
                <Route path="agents" element={<Agents />} />
                <Route path="customers" element={<Customers />} />
                <Route path="customerdetails/:id" element={<CustomerPage />} />
                <Route path="policies" element={<Policy />} />
                <Route path="policydetails/:id" element={<PolicyDetails />} />

                <Route path="profile" element={<Profile />} />
                {/* Add more routes for rm as needed */}
            </Route>
        </>
    )
);

ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);

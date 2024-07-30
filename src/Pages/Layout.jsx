import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCookies } from 'react-cookie';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import { Outlet } from 'react-router-dom';
import config from '@/config';

const Layout = ({ isHead, isRm, isAgent }) => {
    const [cookies, setCookie, removeCookie] = useCookies([
        'accessToken',
        'refreshToken',
    ]);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [_id, setId] = useState('');

    useEffect(() => {
        const checkAuth = async () => {
            console.log(
                'Checking authentication',
                cookies.accessToken,
                ' ',
                cookies.refreshToken
            );
            if (cookies.accessToken) {
                try {
                    const url = isHead
                        ? `${config.API_URL}/head/current`
                        : isRm
                        ? `${config.API_URL}/rm/current`
                        : `${config.API_URL}/agent/current`;
                    console.log('Checking access token with URL:', url);
                    const response = await axios.get(url, {
                        headers: {
                            Authorization: `Bearer ${cookies.accessToken}`,
                        },
                        withCredentials: true,
                    });

                    if (response.status !== 200) {
                        throw new Error('Not authorized');
                    }
                    console.log('User is authenticated:', response.data.data);
                    setId(response.data.data._id);
                    setLoading(false);
                    return; // Exit the function if user is authenticated
                } catch (error) {
                    console.error(
                        'Access token is invalid, attempting to refresh token'
                    );
                }
            }

            // Try to refresh the token if there is a refresh token
            if (cookies.refreshToken) {
                try {
                    const refreshUrl = `${config.API_URL}/${
                        isHead ? 'head' : isRm ? 'rm' : 'agent'
                    }/refresh-token`;
                    console.log('Refreshing token with URL:', refreshUrl);
                    const refreshResponse = await axios.post(refreshUrl, {
                        refreshToken: cookies.refreshToken,
                    });
                    console.log('Refresh response:', refreshResponse.data);
                    if (refreshResponse.status !== 200) {
                        throw new Error('Not authorized');
                    }
                    console.log('Tokens refreshed successfully');
                    setCookie('accessToken', refreshResponse.data.accessToken, {
                        path: '/',
                        sameSite: 'None',
                        secure: true,
                    });
                    setCookie(
                        'refreshToken',
                        refreshResponse.data.refreshToken,
                        { path: '/', sameSite: 'None', secure: true }
                    );
                    setLoading(false);
                    return; // Exit the function if tokens are refreshed
                } catch (refreshError) {
                    console.error('Refresh token is invalid:', refreshError);
                    removeCookie('accessToken');
                    removeCookie('refreshToken');
                }
            }

            // If no valid tokens are found, redirect to login
            console.error('No valid tokens available, redirecting to login');
            setLoading(false);
            navigate(`/login/${isHead ? 'head' : isRm ? 'rm' : 'agent'}`);
        };

        checkAuth();
    }, [
        navigate,
        cookies.accessToken,
        cookies.refreshToken,
        isHead,
        isRm,
        isAgent,
        setCookie,
        removeCookie,
    ]);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-100">
            <Navbar isHead={isHead} isRm={isRm} isAgent={isAgent} />
            <Outlet context={{ isHead, isRm, isAgent, _id }} />
        </div>
    );
};

export default Layout;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Link, useNavigate } from 'react-router-dom';
import config from '@/config';

const AgentLogin = () => {
    const [agentId, setAgentId] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [cookies] = useCookies(['accessToken', 'refreshToken']);
    useEffect(() => {
        const checkAccessToken = async () => {
            if (cookies.accessToken) {
                try {
                    const response = await axios.get(
                        `${config.API_URL}/agent/current`,
                        {
                            headers: {
                                Authorization: `Bearer ${cookies.accessToken}`,
                            },
                            withCredentials: true,
                        }
                    );
                    if (response.data) {
                        // Redirect to agent home
                        navigate('/agent/home', {
                            state: { data: response.data },
                        });
                    }
                } catch (error) {
                    console.error('Invalid access token');
                }
            }
        };

        checkAccessToken();
    }, [navigate]);

    const handleLogin = async () => {
        try {
            const response = await axios.post(
                `${config.API_URL}/agent/login`,
                {
                    agentId,
                    password,
                },
                { withCredentials: true }
            );
            if (response.data) {
                // Save tokens to cookies
                // Cookies.set('accessToken', response.data.accessToken);
                // Cookies.set('refreshToken', response.data.refreshToken);

                navigate('/agent/home', { state: { data: response.data } });
            }
        } catch (error) {
            console.error(error);
            setError('Invalid credentials');
        }
    };

    return (
        <>
            <div className="flex flex-row min-h-screen justify-center items-center">
                <Card className="w-[350px]">
                    <CardHeader>
                        <CardTitle>Agent Login</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={(e) => {
                                e.preventDefault();
                                handleLogin();
                            }}
                        >
                            <div className="grid w-full items-center gap-4">
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="agentId">ID</Label>
                                    <Input
                                        id="agentId"
                                        placeholder="Enter your ID"
                                        value={agentId}
                                        onChange={(e) => {
                                            setAgentId(e.target.value);
                                            setError('');
                                        }}
                                    />
                                </div>
                                <div className="flex flex-col space-y-1.5">
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) => {
                                            setPassword(e.target.value);
                                            setError('');
                                        }}
                                    />
                                </div>
                            </div>
                            {error && (
                                <div className="text-red-500 text-sm mt-2">
                                    {error}
                                </div>
                            )}
                            <CardFooter className="flex justify-center mt-4">
                                <Button type="submit">Login</Button>
                            </CardFooter>
                        </form>
                    </CardContent>
                    <CardFooter className="flex justify-around text-sm text-[#707e94]">
                        <Link to="/login/admin">Admin Login</Link>
                        <Link to="/login/rm">RM Login</Link>
                    </CardFooter>
                </Card>
            </div>
        </>
    );
};

export default AgentLogin;

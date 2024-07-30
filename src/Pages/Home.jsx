import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { useOutletContext } from 'react-router-dom';
import axios from 'axios';
import config from '@/config';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';

const Home = () => {
    const { isHead, isRm, isAgent, _id } = useOutletContext();
    console.log('User ID:', _id, 'Is agent?', isAgent);
    const [allPolicy, setAllPolicy] = useState([]);
    const [individualPolicy, setIndividualPolicy] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAllPolicy = async () => {
            try {
                const response = await axios.get(`${config.API_URL}/policy/`);
                console.log('Policy stats:', response.data);
                setAllPolicy(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching all policy stats:', error);
            }
        };

        const fetchIndividualPolicy = async () => {
            try {
                const response = await axios.get(
                    `${config.API_URL}/policy/${
                        isHead ? 'head' : isRm ? 'rm' : 'agent'
                    }/${_id}`
                );
                console.log('Individual policy stats:', response.data);
                setIndividualPolicy(response.data.data);
            } catch (error) {
                console.error('Error fetching individual policy stats:', error);
            }
        };

        fetchAllPolicy();
        fetchIndividualPolicy();
    }, [isHead, isRm, isAgent, _id]);

    if (loading) {
        return <div>Loading...</div>;
    }

    const dataForChart = {
        labels: individualPolicy.map((policy) => policy.policyNo),
        datasets: [
            {
                label: 'Net Premium',
                data: individualPolicy.map((policy) => policy.netPremium),
                backgroundColor: 'rgba(75, 192, 192, 0.6)',
                borderWidth: 1,
            },
            {
                label: 'IDV Value',
                data: individualPolicy.map((policy) => policy.idvValue),
                backgroundColor: 'rgba(153, 102, 255, 0.6)',
                borderWidth: 1,
            },
        ],
    };

    return (
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <Card className="mb-6 h-auto">
                <CardHeader>
                    <h2 className="text-xl font-medium text-gray-900">
                        Company Policy Stats
                    </h2>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 border-b">
                                        Policy No
                                    </th>
                                    <th className="py-2 px-4 border-b">
                                        Booking No
                                    </th>
                                    <th className="py-2 px-4 border-b">
                                        Customer ID
                                    </th>
                                    <th className="py-2 px-4 border-b">
                                        Issue Date
                                    </th>
                                    <th className="py-2 px-4 border-b">
                                        Expiry Date
                                    </th>
                                    <th className="py-2 px-4 border-b">
                                        Net Premium
                                    </th>
                                    <th className="py-2 px-4 border-b">
                                        IDV Value
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {allPolicy.map((policy) => (
                                    <tr key={policy._id}>
                                        <td className="py-2 px-4 border-b">
                                            {policy.policyNo}
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            {policy.bookingNo}
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            {policy.customerId}
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            {new Date(
                                                policy.issueDate
                                            ).toLocaleDateString()}
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            {new Date(
                                                policy.expiryDate
                                            ).toLocaleDateString()}
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            {policy.netPremium}
                                        </td>
                                        <td className="py-2 px-4 border-b">
                                            {policy.idvValue}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-2">
                <Card className="h-auto">
                    <CardHeader>
                        <h3 className="text-lg font-medium text-gray-900">
                            Individual Policy Stats for Month
                        </h3>
                    </CardHeader>
                    <CardContent>
                        <Bar data={dataForChart} />
                    </CardContent>
                </Card>
                <Card className="h-auto">
                    <CardHeader>
                        <h3 className="text-lg font-medium text-gray-900">
                            Individual Policy Stats All Time
                        </h3>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="min-w-full bg-white border">
                                <thead>
                                    <tr>
                                        <th className="py-2 px-4 border-b">
                                            Policy No
                                        </th>
                                        <th className="py-2 px-4 border-b">
                                            Booking No
                                        </th>
                                        <th className="py-2 px-4 border-b">
                                            Customer ID
                                        </th>
                                        <th className="py-2 px-4 border-b">
                                            Issue Date
                                        </th>
                                        <th className="py-2 px-4 border-b">
                                            Expiry Date
                                        </th>
                                        <th className="py-2 px-4 border-b">
                                            Net Premium
                                        </th>
                                        <th className="py-2 px-4 border-b">
                                            IDV Value
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {individualPolicy.map((policy) => (
                                        <tr key={policy._id}>
                                            <td className="py-2 px-4 border-b">
                                                {policy.policyNo}
                                            </td>
                                            <td className="py-2 px-4 border-b">
                                                {policy.bookingNo}
                                            </td>
                                            <td className="py-2 px-4 border-b">
                                                {policy.customerId}
                                            </td>
                                            <td className="py-2 px-4 border-b">
                                                {new Date(
                                                    policy.issueDate
                                                ).toLocaleDateString()}
                                            </td>
                                            <td className="py-2 px-4 border-b">
                                                {new Date(
                                                    policy.expiryDate
                                                ).toLocaleDateString()}
                                            </td>
                                            <td className="py-2 px-4 border-b">
                                                {policy.netPremium}
                                            </td>
                                            <td className="py-2 px-4 border-b">
                                                {policy.idvValue}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
};

export default Home;

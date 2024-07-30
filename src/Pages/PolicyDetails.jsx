import { useLocation, useParams } from 'react-router-dom';
import { Card, CardHeader, CardDescription } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import axios from 'axios';
import config from '@/config';

const PolicyDetailsPage = () => {
    const location = useLocation();
    const { id } = useParams();
    const [policy, setPolicy] = useState(null);
    const [customer, setCustomer] = useState(null);
    const [rm, setRm] = useState(null);
    const [agent, setAgent] = useState(null);

    const fetchCustomer = async (customerId) => {
        try {
            if (!customerId) return;
            const response = await axios.get(
                `${config.API_URL}/customer/${customerId}`
            );
            setCustomer(response.data.data);
        } catch (error) {
            console.error('Error fetching customer:', error);
        }
    };

    const fetchRm = async (relationshipManagerId) => {
        try {
            if (!relationshipManagerId) return;
            const response = await axios.get(
                `${config.API_URL}/rm/${relationshipManagerId}`
            );
            setRm(response.data.data);
        } catch (error) {
            console.error('Error fetching RM:', error);
        }
    };

    const fetchAgent = async (agentId) => {
        try {
            if (!agentId) return;
            const response = await axios.get(
                `${config.API_URL}/agent/${agentId}`
            );
            setAgent(response.data.data);
        } catch (error) {
            console.error('Error fetching agent:', error);
        }
    };

    useEffect(() => {
        const fetchPolicy = async () => {
            try {
                const response = await axios.get(
                    `${config.API_URL}/policy/${id}`
                );
                setPolicy(response.data.data);
                fetchCustomer(response.data.data.customerId);
                fetchRm(response.data.data.relationshipManagerId);
                fetchAgent(response.data.data.agentId);
            } catch (error) {
                console.error('Error fetching policy:', error);
            }
        };

        if (location.state?.policy) {
            setPolicy(location.state.policy);
            fetchCustomer(location.state.policy.customerId);
            fetchRm(location.state.policy.relationshipManagerId);
            fetchAgent(location.state.policy.agentId);
        } else {
            fetchPolicy();
        }
    }, [id, location.state]);

    if (!policy) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-3xl mx-auto mt-8 p-4">
            <Card className="border rounded-lg shadow-md">
                <CardHeader className="bg-gray-100 p-4 rounded-t-lg">
                    <h2 className="text-2xl font-semibold">
                        {policy.policyNo}
                    </h2>
                </CardHeader>
                <CardDescription className="p-4 space-y-4">
                    <div>
                        <h4 className="text-lg font-medium">Policy ID</h4>
                        <p className="text-gray-700">{policy._id}</p>
                    </div>
                    <div>
                        <h4 className="text-lg font-medium">Customer ID</h4>
                        <p className="text-gray-700">{policy.customerId}</p>
                    </div>
                    <div>
                        <h4 className="text-lg font-medium">Product ID</h4>
                        <p className="text-gray-700">{policy.productId}</p>
                    </div>
                    <div>
                        <h4 className="text-lg font-medium">Issue Date</h4>
                        <p className="text-gray-700">
                            {new Date(policy.issueDate).toLocaleDateString()}
                        </p>
                    </div>
                    <div>
                        <h4 className="text-lg font-medium">Expiry Date</h4>
                        <p className="text-gray-700">
                            {new Date(policy.expiryDate).toLocaleDateString()}
                        </p>
                    </div>
                    <div>
                        <h4 className="text-lg font-medium">NCB</h4>
                        <p className="text-gray-700">{policy.ncb}</p>
                    </div>
                    <div>
                        <h4 className="text-lg font-medium">IDV Value</h4>
                        <p className="text-gray-700">{policy.idvValue}</p>
                    </div>
                    <div>
                        <h4 className="text-lg font-medium">Net OD Premium</h4>
                        <p className="text-gray-700">{policy.netOdPremium}</p>
                    </div>
                    <div>
                        <h4 className="text-lg font-medium">Net Premium</h4>
                        <p className="text-gray-700">{policy.netPremium}</p>
                    </div>
                    <div>
                        <h4 className="text-lg font-medium">Comm Premium</h4>
                        <p className="text-gray-700">{policy.commPremium}</p>
                    </div>
                    {customer && (
                        <div>
                            <h4 className="text-lg font-medium">Customer</h4>
                            <div className="ml-4 mt-2">
                                <p className="text-slate-900">
                                    Name: {customer.name}
                                </p>
                                <p className="text-slate-900">
                                    Contact: {customer.contactDetails}
                                </p>
                            </div>
                        </div>
                    )}
                    {rm && (
                        <div>
                            <h4 className="text-lg font-medium">
                                Relationship Manager
                            </h4>
                            <div className="ml-4 mt-2">
                                <p className="text-slate-900">
                                    Name: {rm.name}
                                </p>
                                <p className="text-slate-900">
                                    Contact: {rm.contactDetails}
                                </p>
                            </div>
                        </div>
                    )}
                    {agent && (
                        <div>
                            <h4 className="text-lg font-medium">Agent</h4>
                            <div className="ml-4 mt-2">
                                <p className="text-slate-900">
                                    Name: {agent.name}
                                </p>
                                <p className="text-slate-900">
                                    Contact: {agent.contactDetails}
                                </p>
                            </div>
                        </div>
                    )}
                    <div>
                        <h4 className="text-lg font-medium">Created At</h4>
                        <p className="text-gray-700">
                            {new Date(policy.createdAt).toLocaleString()}
                        </p>
                    </div>
                    <div>
                        <h4 className="text-lg font-medium">Updated At</h4>
                        <p className="text-gray-700">
                            {new Date(policy.updatedAt).toLocaleString()}
                        </p>
                    </div>
                </CardDescription>
            </Card>
        </div>
    );
};

export default PolicyDetailsPage;

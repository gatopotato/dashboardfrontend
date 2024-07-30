import { useLocation, useParams } from 'react-router-dom';
import { Card, CardHeader, CardDescription } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import axios from 'axios';
import config from '@/config';

const CustomerPage = () => {
    const location = useLocation();
    const { id } = useParams();
    const [customer, setCustomer] = useState(null);
    const [rm, setRm] = useState(null);
    const [agent, setAgent] = useState(null);

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
        const fetchCustomer = async () => {
            try {
                const response = await axios.get(
                    `${config.API_URL}/customer/${id}`
                );
                setCustomer(response.data.data);
                fetchRm(response.data.data.relationshipManagerId);
                fetchAgent(response.data.data.agentId);
            } catch (error) {
                console.error('Error fetching customer:', error);
            }
        };

        if (location.state?.customer) {
            setCustomer(location.state.customer);
            fetchRm(location.state.customer.relationshipManagerId);
            fetchAgent(location.state.customer.agentId);
        } else {
            fetchCustomer();
        }
    }, [id, location.state]);

    if (!customer) {
        return <div>Loading...</div>;
    }

    return (
        <div className="max-w-3xl mx-auto mt-8 p-4">
            <Card className="border rounded-lg shadow-md">
                <CardHeader className="bg-gray-100 p-4 rounded-t-lg">
                    <h2 className="text-2xl font-semibold">{customer.name}</h2>
                </CardHeader>
                <CardDescription className="p-4 space-y-4">
                    <div>
                        <h4 className="text-lg font-medium">Customer ID</h4>
                        <p className="text-gray-700">{customer.custId}</p>
                    </div>
                    <div>
                        <h4 className="text-lg font-medium">Address</h4>
                        <p className="text-gray-700">{customer.address}</p>
                    </div>
                    <div>
                        <h4 className="text-lg font-medium">Contact Details</h4>
                        <p className="text-gray-700">
                            {customer.contactDetails}
                        </p>
                    </div>
                    <div>
                        <h4 className="text-lg font-medium">Date of Birth</h4>
                        <p className="text-gray-700">
                            {new Date(
                                customer.dateOfBirth
                            ).toLocaleDateString()}
                        </p>
                    </div>
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
                            {new Date(customer.createdAt).toLocaleString()}
                        </p>
                    </div>
                    <div>
                        <h4 className="text-lg font-medium">Updated At</h4>
                        <p className="text-gray-700">
                            {new Date(customer.updatedAt).toLocaleString()}
                        </p>
                    </div>
                </CardDescription>
            </Card>
        </div>
    );
};

export default CustomerPage;

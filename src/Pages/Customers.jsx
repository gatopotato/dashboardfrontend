import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { Card, CardHeader, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useOutletContext } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import config from '@/config';
import Modal from 'react-modal';

Modal.setAppElement('#root'); // Ensure accessibility

const Customers = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        contactDetails: '',
        dateOfBirth: new Date(),
        relationshipManagerId: '',
        agentId: '',
    });
    const [agentId, setAgentId] = useState('');
    const [error, setError] = useState('');
    const [customers, setCustomers] = useState([]);
    const [search, setSearch] = useState('');
    const { isHead, isRm, isAgent, _id } = useOutletContext();
    const [cookies] = useCookies(['accessToken']);
    const [relationshipManagerId, setRelationshipManagerId] = useState(_id);
    const [filteredCustomers, setFilteredCustomers] = useState(customers);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [newCustomerId, setNewCustomerId] = useState('');
    const [newCustId, setNewCustId] = useState('');

    useEffect(() => {
        const fetchAgentDetails = async () => {
            if (isAgent && _id) {
                try {
                    const response = await axios.get(
                        `${config.API_URL}/agent/${_id}`,
                        {
                            headers: {
                                Authorization: `Bearer ${cookies.accessToken}`,
                            },
                        }
                    );
                    console.log('Agent details:', response.data.data);
                    setAgentId(response.data.data._id);
                    setRelationshipManagerId(
                        response.data.data.relationshipManagerId
                    );
                    console.log('RM ID:', relationshipManagerId);
                    setFormData((prevData) => ({
                        ...prevData,
                        agentId: _id,
                        relationshipManagerId,
                    }));
                } catch (error) {
                    console.error('Failed to fetch agent details:', error);
                }
            } else if (isRm && _id) {
                setRelationshipManagerId(_id);
                setFormData((prevData) => ({
                    ...prevData,
                    relationshipManagerId: _id,
                }));
                console.log(formData);
            }
        };

        const fetchCustomers = async () => {
            try {
                const response = await axios.get(
                    `${config.API_URL}/customer/${
                        isRm ? 'rm' : 'agent'
                    }/${_id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${cookies.accessToken}`,
                        },
                    }
                );
                setCustomers(response.data.data);
                setFilteredCustomers(response.data.data);
            } catch (error) {
                console.error('Failed to fetch customers:', error);
            }
        };

        fetchAgentDetails();
        fetchCustomers();
    }, [isAgent, isRm, _id, cookies.accessToken]);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const response = await axios.get(
                    `${config.API_URL}/customer/${
                        isRm ? 'rm' : 'agent'
                    }/${_id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${cookies.accessToken}`,
                        },
                    }
                );
                setCustomers(response.data.data);
                setFilteredCustomers(response.data.data);
            } catch (error) {
                console.error('Failed to fetch customers:', error);
            }
        };
        fetchCustomers();
    }, [isAgent, isRm, _id, cookies.accessToken]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleDateChange = (date) => {
        setFormData({
            ...formData,
            dateOfBirth: date,
        });
    };

    const handleAddClient = async (e) => {
        e.preventDefault();
        try {
            console.log(formData);
            const response = await axios.post(
                `${config.API_URL}/customer/create-customer`,
                formData,
                { withCredentials: true }
            );
            setCustomers([...customers, response.data.data]);
            setFormData({
                name: '',
                address: '',
                contactDetails: '',
                dateOfBirth: new Date(),
                relationshipManagerId: relationshipManagerId,
                agentId: isRm ? '' : agentId,
            });
            setFormSubmitted((prev) => !prev);
            setNewCustomerId(response.data.data._id);
            setNewCustId(response.data.data.custId);
            // setCustomers(response.data.data);
            setModalIsOpen(true);
        } catch (error) {
            console.error('Failed to create customer:', error);
            setError('Failed to create customer');
        }
    };

    useEffect(() => {
        if (search) {
            setFilteredCustomers(
                customers.filter(
                    (customer) =>
                        customer.name
                            .toLowerCase()
                            .includes(search.toLowerCase()) ||
                        customer.custId
                            .toLowerCase()
                            .includes(search.toLowerCase())
                )
            );
        } else {
            setFilteredCustomers(customers);
        }
    }, [search, formSubmitted]);

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded shadow">
                        <h2 className="text-xl font-medium text-gray-900 mb-4">
                            New Client
                        </h2>
                        <form onSubmit={handleAddClient} className="p-4">
                            <div className="flex flex-col space-y-4">
                                <div>
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        placeholder="Enter client name"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="address">Address</Label>
                                    <Input
                                        id="address"
                                        name="address"
                                        placeholder="Enter address"
                                        value={formData.address}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="contactDetails">
                                        Contact Details
                                    </Label>
                                    <Input
                                        id="contactDetails"
                                        name="contactDetails"
                                        placeholder="Enter contact details"
                                        value={formData.contactDetails}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="dateOfBirth">
                                        Date of Birth
                                    </Label>
                                    <div className="relative">
                                        <DatePicker
                                            selected={formData.dateOfBirth}
                                            onChange={handleDateChange}
                                            showYearDropdown
                                            dateFormat="yyyy/MM/dd"
                                            className="border p-2 rounded w-full"
                                            wrapperClassName="w-full"
                                        />
                                    </div>
                                </div>
                                <Button type="submit" className="mt-8">
                                    Submit
                                </Button>
                            </div>
                            {error && (
                                <div className="text-red-500 text-sm mt-2">
                                    {error}
                                </div>
                            )}
                        </form>
                    </div>
                    <div className="bg-white p-4 rounded shadow">
                        <h2 className="text-xl font-medium text-gray-900 mb-4">
                            Customers
                        </h2>
                        <div className="mb-4">
                            <Input
                                placeholder="Search"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                        </div>
                        <div className="bg-white p-1 rounded shadow max-h-96 overflow-y-auto">
                            <ul className="list-none space-y-1 font-normal">
                                {filteredCustomers.map((customer, index) => (
                                    <li
                                        key={index}
                                        className="p-1 rounded hover:bg-gray-100 cursor-pointer"
                                        onClick={() => {
                                            console.log(customer);
                                            navigate(
                                                `/${
                                                    isAgent ? 'agent' : 'rm'
                                                }/customerdetails/${
                                                    customer._id
                                                }`,
                                                {
                                                    state: { customer },
                                                }
                                            );
                                        }}
                                    >
                                        <div className="p-2 border rounded shadow-sm">
                                            <div className="mb-1">
                                                <h2 className="text-lg font-semibold">
                                                    {customer.name}
                                                </h2>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium">
                                                    {customer.custId}
                                                </h4>
                                                <div className="text-gray-600 text-xs">
                                                    {customer.contactDetails}
                                                </div>
                                                <div className="text-gray-600 text-xs">
                                                    {customer.address}
                                                </div>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            <Modal
                isOpen={modalIsOpen}
                onRequestClose={() => setModalIsOpen(false)}
                contentLabel="Customer Created"
                className="fixed inset-0 flex items-center justify-center p-4"
                overlayClassName="fixed inset-0 bg-black bg-opacity-50"
            >
                <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
                    <h2 className="text-xl font-semibold mb-4">
                        New Customer Created
                    </h2>
                    <p className="mb-4">Customer ID: {newCustId}</p>
                    <div className="flex justify-end space-x-2">
                        <button
                            className="bg-blue-500 text-white px-4 py-2 rounded"
                            onClick={() =>
                                navigate(
                                    `/${
                                        isAgent ? 'agent' : 'rm'
                                    }/customerdetails/${newCustomerId}`
                                    // {
                                    //     state: { customer },
                                    // }
                                )
                            }
                        >
                            Go to Customer Details
                        </button>
                        <button
                            className="bg-gray-300 text-gray-700 px-4 py-2 rounded"
                            onClick={() => setModalIsOpen(false)}
                        >
                            Close
                        </button>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

export default Customers;

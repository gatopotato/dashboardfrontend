import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useOutletContext } from 'react-router-dom';
import DatePicker from 'react-datepicker';
import Select from 'react-select';
import 'react-datepicker/dist/react-datepicker.css';
import config from '@/config';

const Policies = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        policyNo: '',
        customerId: '',
        productId: '',
        issueDate: new Date(),
        expiryDate: new Date(),
        agentId: '',
        rmId: '',
        headId: '',
        ncb: '',
        idvValue: '',
        netOdPremium: '',
        netPremium: '',
        commPremium: '',
        insuranceType: '',
        corpInsId: '',
        vehicleNo: '',
        model: '',
        yearOfManufacture: '',
        fuelType: '',
        category: '',
        cases: '',
    });
    const [agentId, setAgentId] = useState('');
    const [rmId, setRmId] = useState('');
    const [headId, setHeadId] = useState('');
    const [error, setError] = useState('');
    const [policies, setPolicies] = useState([]);
    const [search, setSearch] = useState('');
    const { isHead, isRm, isAgent, _id } = useOutletContext();
    const [cookies] = useCookies(['accessToken']);
    const [relationshipManagerId, setRelationshipManagerId] = useState(_id);
    const [filteredPolicies, setFilteredPolicies] = useState(policies);
    const [formSubmitted, setFormSubmitted] = useState(false);
    const [customers, setCustomers] = useState([]);
    const [customerOptions, setCustomerOptions] = useState([]);
    const [insCompanies, setInsCompanies] = useState([]);
    const [insCompanyOptions, setInsCompanyOptions] = useState([]);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const insuranceOptions = [
        { value: 'corporate', label: 'Corporate Insurance' },
        { value: 'life', label: 'Life Insurance' },
        { value: 'medical', label: 'Medical Insurance' },
        { value: 'motor', label: 'Motor Insurance' },
    ];
    const fuelOptions = [
        { value: 'P', label: 'Petrol' },
        { value: 'D', label: 'Diesel' },
    ];

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
                    setRmId(response.data.data.relationshipManagerId);
                    setFormData((prevData) => ({
                        ...prevData,
                        agentId: _id,
                        rmId: response.data.data.relationshipManagerId,
                        headId: response.data.data.headId,
                    }));
                    const res = await axios.get(
                        `${config.API_URL}/rm/${rmId}`,
                        {
                            headers: {
                                Authorization: `Bearer ${cookies.accessToken}`,
                            },
                        }
                    );
                    setRmId(res.data.data.relationshipManagerId);
                    setHeadId(res.data.data.headId);
                    console.log('headId agent', res.data.data.headId);
                } catch (error) {
                    console.error('Failed to fetch agent details:', error);
                }
            } else if (isRm && _id) {
                setRelationshipManagerId(_id);
                setRmId(_id);
                setFormData((prevData) => ({
                    ...prevData,
                    rmId: _id,
                }));
                // Fetch the headId using the RM details API
                try {
                    const response = await axios.get(
                        `${config.API_URL}/rm/${_id}`,
                        {
                            headers: {
                                Authorization: `Bearer ${cookies.accessToken}`,
                            },
                        }
                    );
                    setHeadId(response.data.data.headId);
                    console.log('headId rm', response.data.data.headId);
                    setFormData((prevData) => ({
                        ...prevData,
                        headId: response.data.data.headId,
                    }));
                } catch (error) {
                    console.error('Failed to fetch RM details:', error);
                }
            }
        };

        const fetchPolicies = async () => {
            try {
                const response = await axios.get(
                    `${config.API_URL}/policy/${isRm ? 'rm' : 'agent'}/${_id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${cookies.accessToken}`,
                        },
                    }
                );
                setPolicies(response.data.data);
                setFilteredPolicies(response.data.data);
            } catch (error) {
                console.error('Failed to fetch policies:', error);
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
                const options = response.data.data.map((customer) => ({
                    value: customer._id,
                    label: customer.name,
                }));
                setCustomerOptions(options);
            } catch (error) {
                console.error('Failed to fetch customers:', error);
            }
        };

        const fetchInsuranceCompanies = async () => {
            try {
                const response = await axios.get(
                    `${config.API_URL}/inscomp/get/all`,
                    {
                        headers: {
                            Authorization: `Bearer ${cookies.accessToken}`,
                        },
                    }
                );
                setInsCompanies(response.data.data);
                const options = response.data.data.map((company) => ({
                    value: company._id,
                    label: company.name,
                }));
                setInsCompanyOptions(options);
            } catch (error) {
                console.error('Failed to fetch insurance companies:', error);
            }
        };

        fetchAgentDetails();
        fetchPolicies();
        fetchCustomers();
        fetchInsuranceCompanies();
    }, [isAgent, isRm, _id, cookies.accessToken]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleDateChange = (date, name) => {
        setFormData({
            ...formData,
            [name]: date,
        });
    };

    const handleCustomerChange = (selectedOption) => {
        setFormData({
            ...formData,
            customerId: selectedOption.value,
        });
    };

    const handleInsuranceTypeChange = (selectedOption) => {
        setFormData({
            ...formData,
            insuranceType: selectedOption.value,
        });
    };

    const handleFuelTypeChange = (selectedOption) => {
        setFormData({
            ...formData,
            fuelType: selectedOption.value,
        });
    };

    const handleInsCompanyChange = (selectedOption) => {
        setFormData({
            ...formData,
            headId: selectedOption.value,
        });
    };

    const handleAddPolicy = async (e) => {
        e.preventDefault();
        if (isSubmitting) return; // Prevent multiple submissions
        setIsSubmitting(true);

        try {
            let insuranceData;
            let insuranceResponse;

            if (formData.insuranceType === 'motor') {
                insuranceData = {
                    vehicleNo: formData.vehicleNo,
                    model: formData.model,
                    yearOfManufacture: formData.yearOfManufacture,
                    fuelType: formData.fuelType,
                    category: formData.category,
                    cases: formData.cases,
                };
                insuranceResponse = await axios.post(
                    `${config.API_URL}/motorins/create`,
                    insuranceData,
                    { withCredentials: true }
                );
                formData.insId = insuranceResponse.data.data._id;
            } else if (formData.insuranceType === 'corporate') {
                insuranceData = {
                    productId: formData.productId,
                };
                insuranceResponse = await axios.post(
                    `${config.API_URL}/corporateins/create`,
                    insuranceData,
                    { withCredentials: true }
                );
                formData.insId = insuranceResponse.data.data._id;
            } else {
                insuranceData = { productId: formData.productId };
                insuranceResponse = await axios.post(
                    `${config.API_URL}/${formData.insuranceType}/create`,
                    insuranceData,
                    { withCredentials: true }
                );
                formData.insId = insuranceResponse.data.data._id;
            }

            const productData = {
                insCompanyId: formData.headId,
                type: formData.insuranceType,
                insId: formData.insId,
                planName: formData.policyNo,
            };
            const productResponse = await axios.post(
                `${config.API_URL}/product/create`,
                productData,
                { withCredentials: true }
            );

            const policyData = {
                insuranceCompanyId: formData.headId,
                headId: headId,
                relationshipManagerId: rmId,
                agentId: formData.agentId,
                policyNo: formData.policyNo,
                customerId: formData.customerId,
                productId: productResponse.data.data._id,
                issueDate: formData.issueDate,
                expiryDate: formData.expiryDate,
                ncb: formData.ncb,
                idvValue: formData.idvValue,
                netOdPremium: formData.netOdPremium,
                netPremium: formData.netPremium,
                commPremium: formData.commPremium,
            };
            const policyResponse = await axios.post(
                `${config.API_URL}/policy/create`,
                policyData,
                { withCredentials: true }
            );

            setPolicies([...policies, policyResponse.data.data]);
            setFormData({
                policyNo: '',
                customerId: '',
                productId: '',
                issueDate: new Date(),
                expiryDate: new Date(),
                agentId: isRm ? '' : agentId,
                rmId: relationshipManagerId,
                headId: '',
                ncb: '',
                idvValue: '',
                netOdPremium: '',
                netPremium: '',
                commPremium: '',
                insuranceType: '',
                corpInsId: '',
                vehicleNo: '',
                model: '',
                yearOfManufacture: '',
                fuelType: '',
                category: '',
                cases: '',
            });
            setFormSubmitted((prev) => !prev);
        } catch (error) {
            console.error('Failed to create policy:', error);

            // If product creation fails, delete motorInsurance
            if (insuranceResponse?.data?.data?._id) {
                try {
                    await axios.delete(
                        `${config.API_URL}/motorins/delete/${insuranceResponse.data.data._id}`
                    );
                } catch (deleteError) {
                    console.error(
                        'Failed to delete motor insurance:',
                        deleteError
                    );
                }
            }

            setError('Failed to create policy');
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (search) {
            setFilteredPolicies(
                policies.filter(
                    (policy) =>
                        policy.policyNo
                            .toLowerCase()
                            .includes(search.toLowerCase()) ||
                        policy.customerId
                            .toLowerCase()
                            .includes(search.toLowerCase())
                )
            );
        } else {
            setFilteredPolicies(policies);
        }
    }, [search, formSubmitted]);

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded shadow">
                        <h2 className="text-xl font-medium text-gray-900 mb-4">
                            New Policy
                        </h2>
                        <form onSubmit={handleAddPolicy} className="p-4">
                            <div className="flex flex-col space-y-4">
                                <div>
                                    <Label htmlFor="policyNo">
                                        Policy Number
                                    </Label>
                                    <Input
                                        id="policyNo"
                                        name="policyNo"
                                        placeholder="Enter policy number"
                                        value={formData.policyNo}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="customerId">
                                        Customer ID
                                    </Label>
                                    <Select
                                        id="customerId"
                                        name="customerId"
                                        options={customerOptions}
                                        value={customerOptions.find(
                                            (option) =>
                                                option.value ===
                                                formData.customerId
                                        )}
                                        onChange={handleCustomerChange}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="insuranceType">
                                        Insurance Type
                                    </Label>
                                    <Select
                                        id="insuranceType"
                                        name="insuranceType"
                                        options={insuranceOptions}
                                        value={insuranceOptions.find(
                                            (option) =>
                                                option.value ===
                                                formData.insuranceType
                                        )}
                                        onChange={handleInsuranceTypeChange}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="headId">
                                        Insurance Company
                                    </Label>
                                    <Select
                                        id="headId"
                                        name="headId"
                                        options={insCompanyOptions}
                                        value={insCompanyOptions.find(
                                            (option) =>
                                                option.value === formData.headId
                                        )}
                                        onChange={handleInsCompanyChange}
                                        className="basic-multi-select"
                                        classNamePrefix="select"
                                    />
                                </div>
                                {formData.insuranceType === 'corporate' && (
                                    <div>
                                        <Label htmlFor="corpInsId">
                                            Corporate Insurance ID
                                        </Label>
                                        <Input
                                            id="corpInsId"
                                            name="corpInsId"
                                            placeholder="Enter corporate insurance ID"
                                            value={formData.corpInsId}
                                            onChange={handleChange}
                                        />
                                    </div>
                                )}
                                {formData.insuranceType === 'motor' && (
                                    <>
                                        <div>
                                            <Label htmlFor="vehicleNo">
                                                Vehicle Number
                                            </Label>
                                            <Input
                                                id="vehicleNo"
                                                name="vehicleNo"
                                                placeholder="Enter vehicle number"
                                                value={formData.vehicleNo}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="model">Model</Label>
                                            <Input
                                                id="model"
                                                name="model"
                                                placeholder="Enter model"
                                                value={formData.model}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="yearOfManufacture">
                                                Year of Manufacture
                                            </Label>
                                            <Input
                                                id="yearOfManufacture"
                                                name="yearOfManufacture"
                                                placeholder="Enter year of manufacture"
                                                value={
                                                    formData.yearOfManufacture
                                                }
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="fuelType">
                                                Fuel Type
                                            </Label>
                                            <Select
                                                id="fuelType"
                                                name="fuelType"
                                                options={fuelOptions}
                                                value={fuelOptions.find(
                                                    (option) =>
                                                        option.value ===
                                                        formData.fuelType
                                                )}
                                                onChange={handleFuelTypeChange}
                                                className="basic-multi-select"
                                                classNamePrefix="select"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="category">
                                                Category
                                            </Label>
                                            <Input
                                                id="category"
                                                name="category"
                                                placeholder="Enter category"
                                                value={formData.category}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="cases">Cases</Label>
                                            <Input
                                                id="cases"
                                                name="cases"
                                                placeholder="Enter cases"
                                                value={formData.cases}
                                                onChange={handleChange}
                                            />
                                        </div>
                                    </>
                                )}
                                <div>
                                    <Label htmlFor="ncb">NCB</Label>
                                    <Input
                                        id="ncb"
                                        name="ncb"
                                        placeholder="Enter NCB"
                                        value={formData.ncb}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="idvValue">IDV Value</Label>
                                    <Input
                                        id="idvValue"
                                        name="idvValue"
                                        placeholder="Enter IDV value"
                                        value={formData.idvValue}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="netOdPremium">
                                        Net OD Premium
                                    </Label>
                                    <Input
                                        id="netOdPremium"
                                        name="netOdPremium"
                                        placeholder="Enter net OD premium"
                                        value={formData.netOdPremium}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="netPremium">
                                        Net Premium
                                    </Label>
                                    <Input
                                        id="netPremium"
                                        name="netPremium"
                                        placeholder="Enter net premium"
                                        value={formData.netPremium}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="commPremium">
                                        Comm Premium
                                    </Label>
                                    <Input
                                        id="commPremium"
                                        name="commPremium"
                                        placeholder="Enter comm premium"
                                        value={formData.commPremium}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="issueDate">
                                        Issue Date
                                    </Label>
                                    <div className="relative">
                                        <DatePicker
                                            selected={formData.issueDate}
                                            onChange={(date) =>
                                                handleDateChange(
                                                    date,
                                                    'issueDate'
                                                )
                                            }
                                            showYearDropdown
                                            dateFormat="yyyy/MM/dd"
                                            className="border p-2 rounded w-full"
                                            wrapperClassName="w-full"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="expiryDate">
                                        Expiry Date
                                    </Label>
                                    <div className="relative">
                                        <DatePicker
                                            selected={formData.expiryDate}
                                            onChange={(date) =>
                                                handleDateChange(
                                                    date,
                                                    'expiryDate'
                                                )
                                            }
                                            showYearDropdown
                                            dateFormat="yyyy/MM/dd"
                                            className="border p-2 rounded w-full"
                                            wrapperClassName="w-full"
                                        />
                                    </div>
                                </div>
                                <Button
                                    type="submit"
                                    className="mt-8"
                                    disabled={
                                        !formData.customerId ||
                                        !formData.insuranceType ||
                                        isSubmitting
                                    }
                                >
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
                            Policies
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
                                {filteredPolicies.map((policy, index) => (
                                    <li
                                        key={index}
                                        className="p-1 rounded hover:bg-gray-100 cursor-pointer"
                                        onClick={() => {
                                            console.log(policy);
                                            navigate(
                                                `/${
                                                    isAgent ? 'agent' : 'rm'
                                                }/policydetails/${policy._id}`,
                                                {
                                                    state: { policy },
                                                }
                                            );
                                        }}
                                    >
                                        <div className="p-2 border rounded shadow-sm">
                                            <div className="mb-1">
                                                <h2 className="text-lg font-semibold">
                                                    {policy.policyNo}
                                                </h2>
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-medium">
                                                    {policy.policyNo}
                                                </h4>
                                                <h4 className="text-sm font-medium">
                                                    {policy.bookingNo}
                                                </h4>
                                                <div className="text-gray-600 text-xs">
                                                    {policy.netPremium}
                                                </div>
                                                <div className="text-gray-600 text-xs">
                                                    {policy.expiryDate}
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
        </div>
    );
};

export default Policies;

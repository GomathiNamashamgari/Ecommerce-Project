import { Box } from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import zIndex from '@mui/material/styles/zIndex';
import React, { useState, useEffect } from 'react'

const steps = [
    { name: "Order Placed", description: "on Mon 17 Nov", value: "PlLACED" },
    { name: "Packed", description: "Item Packed in Dispatch Warehouse", value: "CONFIRM" },
    { name: "Shipped", description: "by Thu 20 Nov", value: "SHIPPED" },
    { name: "Arriving", description: "on Mon 24 Nov", value: "ARRIVING" },
    { name: "Arrived", description: "on Mon 24 Nov", value: "DELIVERED" },
    //{name: "Cancelled", description:"on Tue 25 Nov", value:"CANCELLED"},
];

const canceledStep = [
    { name: "Order Placed", description: "on Thu 24 Dec", value: "PLACED" },
    { name: "Order Cancelled", description: "on Thu 24 Dec", value: "CANCELLED" },
];

const currentStep = 2;

const OrderStepper = ({ orderStatus }: any) => {
    const [statusStep, setStatusStep] = useState(steps);

    useEffect(() => {
        if (orderStatus === 'CANCELLED') {
            setStatusStep(canceledStep)
        } else {
            setStatusStep(steps)
        }
    }, [orderStatus])



    return (
        <Box className='mx-auto my-10'>
            {statusStep.map((step, index) => (
                <>
                    <div key={index} className={`flex px-4`}>
                        <div className='flex flex-col items-center'>
                            <Box sx={{ zIndex: 10 }}
                                className={`w-8 h-8 rounded-full flex items-center
                        justify-center z-10 ${index <= currentStep ? "bg-gray-200 text-primary-color" : "bg-gray-300 text-gray-600"}`}>
                                {step.value === orderStatus ? (
                                    <CheckCircleIcon />
                                ) : (
                                    <FiberManualRecordIcon sx={{ zIndex: -1 }} />
                                )}
                            </Box>
                            {index < statusStep.length - 1  && (
                                <div className={` border h-20 w-[2px] ${index < currentStep ? "bg-primary-color " : "bg-gray-300 text-gray-600"}`}>

                                </div>
                            )}
                        </div>
                        <div className='ml-2 w-full'>
                            <div className={` ${step.value === orderStatus ? "bg-primary-color p-2 text-white font-medium rounded-md-translate-y-3" :
                                ""
                                } ${(orderStatus === "CANCELLED" && step.value
                                    === orderStatus) ? "bg-red-500" : ""}w-full`}>
                                <p className={``}>
                                    {step.name}
                                </p>
                                <p className={`${step.value === orderStatus ? "text-gray-200" : "text-gray-500"}`}>
                                    {step.description}
                                </p>

                            </div>

                        </div>
                    </div>
                </>
            ))}
        </Box>
    )
}

export default OrderStepper
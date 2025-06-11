import React from 'react'
import Button from '@mui/material/Button';
import { FaAngleDown } from "react-icons/fa6";
const CountryDrop = () => {
    return (
        <>
            <Button className='countryDrop'>
                <div className='info d-flex flex-column'>
                    <span className='lable'>Your Location</span>
                    <span className='name'>Yasamal</span>
                </div>
                <span className='ml-auto'><FaAngleDown /></span>
            </Button>
        </>
    )
}

export default CountryDrop

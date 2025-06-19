import React, { useState } from 'react';
import { Checkbox, FormControlLabel } from '@mui/material';
import RangeSlider from 'react-range-slider-input';
import 'react-range-slider-input/dist/style.css';
import { Link } from 'react-router';

const Sidebar = () => {
    const [value, setValue] = useState([100, 60000]);

    return (
        <div className="sidebar">
            <div className="filterBox">
                <h6>PRODUCT CATEGORIES</h6>
                <div className="scroll">
                    <ul>
                        {["Men", "Women", "Beauty", "Kids"].map((cat, i) => (
                            <li key={i}><FormControlLabel className='w-100' control={<Checkbox />} label={cat} /></li>
                        ))}
                    </ul>
                </div>
            </div>
            <div className="filterBox">
                <h6>FILTER BY PRICE</h6>
                <RangeSlider value={value} onInput={setValue} min={100} max={60000} step={5} />
                <div className="d-flex pt-2 pb-2 priceRange">
                    <span><strong>${value[0]} - ${value[1]}</strong></span>
                </div>
            </div>
            <div className="filterBox">
                <h6>STATUS</h6>
                <ul>
                    {["In Stock", "On Sale"].map((item, i) => (
                        <li key={i}><FormControlLabel className='w-100' control={<Checkbox />} label={item} /></li>
                    ))}
                </ul>
            </div>
            <div className="filterBox">
                <h6>BRANDS</h6>
                <ul>
                    {["Nike", "Puma", "Adidas", "Joma"].map((brand, i) => (
                        <li key={i}><FormControlLabel className='w-100' control={<Checkbox />} label={brand} /></li>
                    ))}
                </ul>
            </div>
            <Link to="#">
                <img className='w-100' src="https://klbtheme.com/bacola/wp-content/uploads/2021/05/sidebar-banner.gif" alt="" />
            </Link>
        </div>
    );
};

export default Sidebar;

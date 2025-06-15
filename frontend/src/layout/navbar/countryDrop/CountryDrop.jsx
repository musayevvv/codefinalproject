import React, { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import { FaAngleDown } from "react-icons/fa6";
import Dialog from '@mui/material/Dialog';
import { IoIosSearch } from "react-icons/io";
import { MdClose } from "react-icons/md";
import Slide from '@mui/material/Slide';
import { useDispatch, useSelector } from 'react-redux';
import { getCountriesThunk } from '../../../redux/reducer/countrySlice';
import './CountryDrop.css'


const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const CountryDrop = () => {
    const [isOpenModal, setisOpenModal] = useState(false);
    const [selectedTab, setselectedTab] = useState(null);
    const [selectedCountry, setselectedCountry] = useState('');
    const [countryList, setcountryList] = useState([]);
    const dispatch = useDispatch();
    const { country } = useSelector((state) => state.countries);

    useEffect(() => {
        dispatch(getCountriesThunk());
    }, [dispatch]);

    useEffect(() => {
        setcountryList(country);
    }, [country]);

    const selectCountry = (index, countryName) => {
        setselectedTab(index);
        setisOpenModal(false);
        setselectedCountry(countryName);
    };

    const filterList = (e) => {
        const keyword = e.target.value.toLowerCase();
        if (keyword !== '') {
            const filtered = country.filter((item) =>
                item.countryName.toLowerCase().includes(keyword)
            );
            setcountryList(filtered);
        } else {
            setcountryList(country);
        }
    };

    const displayCountry = () => {
        if (!selectedCountry) return 'Select Location';
        return selectedCountry.length > 10
            ? selectedCountry.slice(0, 10) + '...'
            : selectedCountry;
    };

    return (
        <>
            <Button className="countryDrop" onClick={() => setisOpenModal(true)}>
                <div className="info d-flex flex-column">
                    <span className="lable">Your Location</span>
                    <span className="name">{displayCountry()}</span>
                </div>
                <span className="ml-auto"><FaAngleDown /></span>
            </Button>

            <Dialog
                className="locationModal"
                open={isOpenModal}
                onClose={() => setisOpenModal(false)}
                TransitionComponent={Transition}
            >
                <h4 className="mb-0">Çatdırılma Yerinizi seçin</h4>
                <p>Ünvanınızı daxil edin və əraziniz üçün təklifi dəqiqləşdirək.</p>
                <Button className="close_" onClick={() => setisOpenModal(false)}><MdClose /></Button>

                <div className="headerSearch w-100">
                    <input type="text" placeholder="Axtar..." onChange={filterList} />
                    <Button><IoIosSearch /></Button>
                </div>

                <ul className="countryList mt-3">
                    {countryList.length > 0 &&
                        countryList.map((item, index) => (
                            <li key={index}>
                                <Button
                                    onClick={() => selectCountry(index, item.countryName)}
                                    className={`${selectedTab === index ? 'active' : ''}`}
                                >
                                    {item.countryName}
                                </Button>
                            </li>
                        ))}
                </ul>
            </Dialog>
        </>
    );
};

export default CountryDrop;

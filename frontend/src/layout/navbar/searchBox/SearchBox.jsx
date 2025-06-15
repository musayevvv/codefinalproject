import React from 'react'
import { IoIosSearch } from "react-icons/io";
import Button from '@mui/material/Button';
import './SearchBox.css'

const SearchBox = () => {
    return (
        <div className="headerSearch ml-3 mr-3">
            <input type="text" placeholder='Axtar...' />
            <Button><IoIosSearch /></Button>
        </div>

    )
}

export default SearchBox

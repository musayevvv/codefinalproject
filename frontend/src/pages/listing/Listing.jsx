import React, { useState } from 'react';
import Sidebar from './sideBar/SideBar';
import Button from '@mui/material/Button';
import { IoIosMenu } from 'react-icons/io';
import { CgMenuGridR } from 'react-icons/cg';
import { TfiLayoutGrid4Alt } from 'react-icons/tfi';
import { FaAngleDown } from 'react-icons/fa6';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import ProductItem from '../home/productItem/ProductItem';
import './Listing.css';

const Listing = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [productView, setProductView] = useState('four');
  const openDropdown = Boolean(anchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const productList = Array(40).fill({
    image: 'https://klbtheme.com/bacola/wp-content/uploads/2021/04/product-image-62.jpg',
    title: 'Sample Product',
    inStock: true,
    oldPrice: '$20.00',
    netPrice: '$15.00',
    rating: 5,
    discount: '20%'
  });

  return (
    <section className="product_Listing_Page">
      <div className="container">
        <div className="productListing d-flex">
          <Sidebar />
          <div className="content_right">
            <img src="https://klbtheme.com/bacola/wp-content/uploads/2021/08/bacola-banner-18.jpg" className='w-100' alt="Banner" style={{ borderRadius: '8px' }} />
            <div className="showBy d-flex align-items-center mt-3 mb-3">
              <div className="btnWrapper d-flex align-items-center">
                <Button className={productView === 'one' ? 'act' : ''} onClick={() => setProductView('one')}><IoIosMenu /></Button>
                <Button className={productView === 'three' ? 'act' : ''} onClick={() => setProductView('three')}><CgMenuGridR /></Button>
                <Button className={productView === 'four' ? 'act' : ''} onClick={() => setProductView('four')}><TfiLayoutGrid4Alt /></Button>
              </div>
              <div className="ml-auto showByFilter">
                <Button id="basic-button" onClick={handleClick}>Show 9 <FaAngleDown /></Button>
                <Menu id="basic-menu" anchorEl={anchorEl} open={openDropdown} onClose={handleClose} MenuListProps={{ 'aria-labelledby': 'basic-button' }}>
                  {[10, 20, 30, 40, 50, 60].map(num => (
                    <MenuItem key={num} onClick={handleClose}>{num}</MenuItem>
                  ))}
                </Menu>
              </div>
            </div>
            <div className="productListing">
              {productList.map((product, idx) => (
                <ProductItem key={idx} {...product} itemView={productView} />
              ))}
            </div>
            <div className="d-flex align-items-center justify-content-center mt-5">
              <Pagination count={10} color="primary" size='large' />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Listing;
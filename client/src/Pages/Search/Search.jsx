import Sidebar from "../../Components/Sidebar/Sidebar";
import Button from '@mui/material/Button';
import { IoIosMenu } from "react-icons/io";
import { CgMenuGridR } from "react-icons/cg";
import { TfiLayoutGrid4Alt } from "react-icons/tfi";
import { useContext, useEffect, useState } from "react";
import ProductItem from "../../Components/ProductItem/ProductItem";
import { fetchDataFromApi } from "../../utils/api";
import CircularProgress from '@mui/material/CircularProgress';
import { MyContext } from "../../App";

const SearchPage = () => {

    const [anchorEl, setAnchorEl] = useState(null);
    const [productView, setProductView] = useState('four');
    const [productData, setProductData] = useState([]);
    const [isLoading, setisLoading] = useState(false);
    const openDropdown = Boolean(anchorEl);
    const [isOpenFilter, setIsOpenFilter] = useState(false);

    const context = useContext(MyContext);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    useEffect(() => {
        window.scrollTo(0, 0);
        setisLoading(true);
        setTimeout(() => {
            setProductData(context.searchData)
            setisLoading(false);
        }, 3000);

        context.setEnableFilterTab(false);
    }, [context.searchData]);


    const filterData = (subCatId) => {
        setisLoading(true);

        fetchDataFromApi(`/api/products?subCatId=${subCatId}`).then((res) => {
            setProductData(res.products);
            setisLoading(false);
        })
    }

    const filterByPrice = (price, subCatId) => {
        setisLoading(true);

        fetchDataFromApi(`/api/products?minPrice=${price[0]}&maxPrice=${price[1]}&subCatId=${subCatId}`).then((res) => {
            setProductData(res.products)
            setisLoading(false);
        })
    }

    const filterByRating = (rating, subCatId) => {

        setisLoading(true);
        fetchDataFromApi(`/api/products?rating=${rating}&subCatId=${subCatId}`).then((res) => {
            setProductData(res.products)
            setisLoading(false);
        })
    }


    const openFilters = () => {
        setIsOpenFilter(!isOpenFilter)
    }

    return (
        <>
            <section className="product_Listing_Page">
                <div className="container">
                    <div className="productListing d-flex">
                        <Sidebar filterData={filterData} filterByPrice={filterByPrice} filterByRating={filterByRating} isOpenFilter={isOpenFilter} />
                        <div className="content_right">
                            <div className="showBy mt-0 mb-3 d-flex align-items-center">
                                <div className="d-flex align-items-center btnWrapper">
                                    <Button className={productView === 'one' && 'act'} onClick={() => setProductView('one')}><IoIosMenu />
                                    </Button>
                                    <Button className={productView === 'three' && 'act'} onClick={() => setProductView('three')}>
                                        <CgMenuGridR /></Button>
                                    <Button className={productView === 'four' && 'act'} onClick={() => setProductView('four')}><TfiLayoutGrid4Alt /></Button>
                                </div>
                            </div>
                            <div className="productListing">
                                {
                                    isLoading === true ?
                                        <div className="loading d-flex align-items-center justify-content-center">
                                            <CircularProgress color="inherit" />
                                        </div>
                                        :
                                        <>
                                            {
                                                productData?.length !== 0 && productData?.map((item, index) => {
                                                    return (
                                                        <ProductItem key={index} itemView={productView} item={item} />
                                                    )
                                                })
                                            }
                                        </>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </section>F
        </>
    )}

export default SearchPage;
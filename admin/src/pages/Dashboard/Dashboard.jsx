import DashboardBox from "./components/dashboardBox";
import { FaUserCircle } from "react-icons/fa";
import { IoMdCart } from "react-icons/io";
import { MdShoppingBag } from "react-icons/md";
import { GiStarsStack } from "react-icons/gi";
import SearchBox from "../../components/SearchBox/Search";
import MenuItem from "@mui/material/MenuItem";
import { useContext, useEffect, useState } from "react";
import Button from "@mui/material/Button";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { FaPencilAlt } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { MyContext } from "../../App";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";
import Rating from "@mui/material/Rating";
import { deleteData, fetchDataFromApi } from "../../utils/api";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import './Dashboard.css'

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

export const options = {
  backgroundColor: "transparent",
  chartArea: { width: "100%", height: "100%" },
};

const columns = [
  { id: "product", label: "PRODUCT", minWidth: 150 },
  { id: "category", label: "CATEGORY", minWidth: 100 },
  { id: "subcategory", label: "SUB CATEGORY", minWidth: 150 },
  { id: "brand", label: "BRAND", minWidth: 130 },
  { id: "price", label: "PRICE", minWidth: 100 },
  { id: "rating", label: "RATING", minWidth: 80 },
  { id: "action", label: "ACTION", minWidth: 120 },
];

const Dashboard = () => {
  const [showBy, setshowBy] = useState(10);
  const [productList, setProductList] = useState([]);
  const [categoryVal, setcategoryVal] = useState("all");

  const [totalUsers, setTotalUsers] = useState();
  const [totalOrders, setTotalOrders] = useState();
  const [totalProducts, setTotalProducts] = useState();
  const [totalProductsReviews, setTotalProductsReviews] = useState();
  const [totalSales, setTotalSales] = useState();
  const [salesData, setSalesData] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(50);
  const [year, setYear] = useState(new Date().getFullYear());

  const context = useContext(MyContext);

  const handleChangeYear = (event) => {
    setYear(event.target.value);
    fetchDataFromApi(`/api/orders/sales?year=${event.target.value}`).then((res) => {
      const sales = res?.monthlySales?.map(item => ({
        name: item?.month,
        sales: parseInt(item?.sale),
      })) || [];
      const uniqueArr = sales.filter((obj, index, self) =>
        index === self.findIndex((t) => t.name === obj.name)
      );
      setSalesData(uniqueArr);
    });
  };

  const handleChangePage = (event, newPage) => setPage(newPage);
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    getProducts(page, rowsPerPage);
  }, [page, rowsPerPage]);

  const getProducts = (page, rowsPerPage) => {
    fetchDataFromApi(`/api/products/all?page=${page + 1}&perPage=${rowsPerPage}`).then((res) => {
      setProductList(res);
      context.setProgress(100);
    });
  };

  useEffect(() => {
    context.setisHideSidebarAndHeader(false);
    window.scrollTo(0, 0);
    context.setProgress(40);

    fetchDataFromApi("/api/user/get/count").then(res => setTotalUsers(res.userCount));
    fetchDataFromApi("/api/orders/get/count").then(res => setTotalOrders(res.orderCount));
    fetchDataFromApi("/api/products/get/count").then(res => setTotalProducts(res.productsCount));
    fetchDataFromApi("/api/productReviews/get/count").then(res => setTotalProductsReviews(res.productsReviews));

    fetchDataFromApi("/api/orders/").then((res) => {
      const total = res.reduce((sum, item) => sum + parseInt(item.amount), 0);
      setTotalSales(total);
    });

    fetchDataFromApi(`/api/orders/sales?year=${year}`).then((res) => {
      const sales = res?.monthlySales?.map(item => ({
        name: item?.month,
        sales: parseInt(item?.sale),
      })) || [];
      const uniqueArr = sales.filter((obj, index, self) =>
        index === self.findIndex((t) => t.name === obj.name)
      );
      setSalesData(uniqueArr);
    });
  }, []);

  const deleteProduct = (id) => {
    const userInfo = JSON.parse(localStorage.getItem("user"));
    if (userInfo?.email === "rinkuv37@gmail.com") {
      context.setProgress(40);
      deleteData(`/api/products/${id}`).then(() => {
        context.setProgress(100);
        context.setAlertBox({ open: true, error: false, msg: "Product Deleted!" });
        fetchDataFromApi(`/api/products`).then(setProductList);
      });
    } else {
      context.setAlertBox({ open: true, error: true, msg: "Only Admin can delete Product" });
    }
  };

  const handleChangeCategory = (event) => {
    const val = event.target.value;
    setcategoryVal(val);
    if (val !== "all") {
      fetchDataFromApi(`/api/products/catId?catId=${val}`).then((res) => {
        setProductList(res);
        context.setProgress(100);
      });
    } else {
      fetchDataFromApi(`/api/products`).then((res) => {
        setProductList(res);
        context.setProgress(100);
      });
    }
  };

  const searchProducts = (keyword) => {
    if (keyword) {
      fetchDataFromApi(`/api/search?q=${keyword}&page=1&perPage=10000`).then(setProductList);
    } else {
      fetchDataFromApi(`/api/products`).then(setProductList);
    }
  };

  const showPerPage = (e) => {
    setshowBy(e.target.value);
    fetchDataFromApi(`/api/products?page=1&perPage=${e.target.value}`).then((res) => {
      setProductList(res);
      context.setProgress(100);
    });
  };
  return (
    <>
      <div className="right-content w-100">
        <div className="row dashboardBoxWrapperRow dashboard_Box dashboardBoxWrapperRowV2">
          <div className="col-md-12">
            <div className="dashboardBoxWrapper d-flex">
              <DashboardBox
                color={["#1da256", "#48d483"]}
                icon={<FaUserCircle />}
                grow={true}
                title="Total Users"
                count={totalUsers}
              />
              <DashboardBox
                color={["#c012e2", "#eb64fe"]}
                icon={<IoMdCart />}
                title="Total Orders"
                count={totalOrders}
              />
              <DashboardBox
                color={["#2c78e5", "#60aff5"]}
                icon={<MdShoppingBag />}
                title="Total Products"
                count={totalProducts}
              />
              <DashboardBox
                color={["#e1950e", "#f3cd29"]}
                icon={<GiStarsStack />}
                title="Total Reviews"
                count={totalProductsReviews}
              />
            </div>
          </div>
        </div>
        <div className="card shadow border-0 p-3 mt-4">
          <h3 className="hd">Best Selling Products</h3>

          <div className="row cardFilters mt-2 mb-3">
            <div className="col-md-3">
              <h4>CATEGORY BY</h4>
              <FormControl size="small" className="w-100">
                <Select
                  value={categoryVal || "all"}
                  onChange={handleChangeCategory}
                  displayEmpty
                  inputProps={{ "aria-label": "Without label" }}
                  className="w-100"
                >
                  <MenuItem value="all">
                    <em>All</em>
                  </MenuItem>
                  {context.catData?.categoryList?.length !== 0 &&
                    context.catData?.categoryList?.map((cat, index) => {
                      return (
                        <MenuItem
                          className="text-capitalize"
                          value={cat._id}
                          key={index}
                        >
                          {cat.name}
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>
            </div>

            <div className="col-md-9 d-flex justify-content-end">
              <div className="searchWrap d-flex">
                <SearchBox searchProducts={searchProducts} />
              </div>
            </div>
          </div>

          <Paper sx={{ width: "100%", overflow: "hidden" }}>
            <TableContainer sx={{ maxHeight: 440 }}>
              <Table stickyHeader aria-label="sticky table">
                <TableHead>
                  <TableRow>
                    {columns.map((column) => (
                      <TableCell
                        key={column.id}
                        align={column.align}
                        style={{ minWidth: column.minWidth }}
                      >
                        {column.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                <TableBody>
                  {productList?.products?.length !== 0 &&
                    productList?.products
                      ?.map((item, index) => {
                        return (
                          <TableRow key={index}>
                            <TableCell style={{ minWidth: columns.minWidth }}>
                              <div className="d-flex align-items-center productBox">
                                <div className="imgWrapper">
                                  <div className="img card shadow m-0">
                                    <LazyLoadImage
                                      alt={"image"}
                                      effect="blur"
                                      className="w-100"
                                      src={item.images[0]}
                                    />
                                  </div>
                                </div>
                                <div className="info pl-3">
                                  <Link to={`/product/details/${item.id}`}>
                                    <h6>{item?.name}</h6>
                                  </Link>
                                  <p>{item?.description}</p>
                                </div>
                              </div>
                            </TableCell>

                            <TableCell style={{ minWidth: columns.minWidth }}>
                              {item?.catName}
                            </TableCell>
                            <TableCell style={{ minWidth: columns.minWidth }}>
                              {item?.subCatName}
                            </TableCell>
                            <TableCell style={{ minWidth: columns.minWidth }}>
                              <span className="badge badge-secondary">
                                {item?.brand}
                              </span>
                            </TableCell>
                            <TableCell style={{ minWidth: columns.minWidth }}>
                              <div style={{ width: "70px" }}>
                                <del className="old">{item?.oldPrice}$</del>
                                <span className="new text-danger d-block w-100">
                                  {item?.price}$
                                </span>
                              </div>
                            </TableCell>
                            <TableCell style={{ minWidth: columns.minWidth }}>
                              <Rating
                                name="read-only"
                                defaultValue={item?.rating}
                                precision={0.5}
                                size="small"
                                readOnly
                              />
                            </TableCell>

                            <TableCell style={{ minWidth: columns.minWidth }}>
                              <div className="actions d-flex align-items-center">
                                <Link to={`/product/details/${item.id}`}>
                                  <Button
                                    className="secondary"
                                    color="secondary"
                                  >
                                    <FaEye />
                                  </Button>
                                </Link>

                                <Link to={`/product/edit/${item.id}`}>
                                  <Button className="success" color="success">
                                    <FaPencilAlt />
                                  </Button>
                                </Link>

                                <Button
                                  className="error"
                                  color="error"
                                  onClick={() => deleteProduct(item?.id)}
                                >
                                  <MdDelete />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                </TableBody>
              </Table>
            </TableContainer>
            <TablePagination
              rowsPerPageOptions={[50, 100, 150, 200]}
              component="div"
              count={
                Number.isInteger(productList?.totalPages)
                  ? productList.totalPages * rowsPerPage
                  : 0
              }
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />

          </Paper>
        </div>

        <div className="card p-3">
          <div className="d-flex align-items-center">
            <h3 className="hd">Total Sales</h3>

            <div className="ml-auto res-full" style={{ width: '100px' }}>
              <Select
                size="small"
                className="w-100"
                value={year}
                onChange={handleChangeYear}
                displayEmpty
                inputProps={{ 'aria-label': 'Without label' }}
              >
                <MenuItem value={2020}>2020</MenuItem>
                <MenuItem value={2021}>2021</MenuItem>
                <MenuItem value={2022}>2022</MenuItem>
                <MenuItem value={2023}>2023</MenuItem>
                <MenuItem value={2024}>2024</MenuItem>
                <MenuItem value={2025}>2025</MenuItem>
              </Select>
            </div>

          </div>
          <br />

          <div className="chartWrapper">
            {salesData?.length !== 0 && (
              <BarChart
                width={900}
                height={400}
                data={salesData}
                stroke="none"
                margin={{
                  top: 0,
                  right: 0,
                  left: 0,
                  bottom: 0,
                }}
                barSize={20}
              >
                <XAxis
                  dataKey="name"
                  scale="point"
                  padding={{ left: 10, right: 10 }}
                  tick={{ fontSize: 12 }}
                  label={{ position: "insideBottom", fontSize: 14 }}
                  style={{ fill: context?.theme === "dark" ? "white" : "#000" }}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  label={{ position: "insideBottom", fontSize: 14 }}
                  style={{ fill: context?.theme === "dark" ? "white" : "#000" }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#071739  ",
                    color: "white",
                  }}
                  labelStyle={{ color: "yellow" }}
                  itemStyle={{ color: "cyan" }}
                  cursor={{ fill: "white" }}
                />
                <Legend />
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={false}
                  vertical={false}
                />
                <Bar dataKey="sales" stackId="a" fill="#0858f7" />
              </BarChart>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;

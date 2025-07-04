import React, { useContext, useEffect, useState } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { IoMdCloudUpload } from "react-icons/io";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { useNavigate } from "react-router-dom";
import {
  deleteData,
  editData,
  fetchDataFromApi,
  uploadImage,
} from "../../utils/api";

import MyContext from "../../Context/MyContext";

import NoUserImg from "../../assets/images/no-user.jpg";
import CircularProgress from "@mui/material/CircularProgress";

function CustomTabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
}


CustomTabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const MyAccount = () => {
  const [isLogin, setIsLogin] = useState(false);

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const history = useNavigate();

  const context = useContext(MyContext);

  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);

  const [previews, setPreviews] = useState([]);
  const [userData, setUserData] = useState([]);

  const formdata = new FormData();

  const [formFields, setFormFields] = useState({
    name: "",
    email: "",
    phone: "",
    images: [],
    isAdmin: false,
    password: "",
  });

  const [fields, setFields] = useState({
    oldPassword: "",
    password: "",
    confirmPassword: "",
  });

  useEffect(() => {
    window.scrollTo(0, 0);

    const token = localStorage.getItem("token");
    if (token !== "" && token !== undefined && token !== null) {
      setIsLogin(true);
    } else {
      history("/signIn");
    }

    deleteData("/api/imageUpload/deleteAllImages");
    const user = JSON.parse(localStorage.getItem("user"));

    fetchDataFromApi(`/api/user/${user?.userId}`).then((res) => {
      setUserData(res);
      setPreviews(res.images);

      setFormFields({
        name: res.name,
        email: res.email,
        phone: res.phone,
      });
    });


    context.setEnableFilterTab(false);
  }, []);

  const changeInput = (e) => {
    const { name, value } = e.target;
    setFormFields(prev => ({
      ...prev,
      [name]: value,
    }));
  };


  const changeInput2 = (e) => {
    setFields(() => ({
      ...fields,
      [e.target.name]: e.target.value,
    }));
  };
  const onChangeFile = async (e, apiEndPoint) => {
    try {
      setUploading(true);
      setPreviews([]);

      const files = e.target.files;
      if (!files.length) {
        setUploading(false);
        return;
      }
      const formdata = new FormData();
      const validImages = [];

      for (const file of files) {
        if (
          file.type === "image/jpeg" ||
          file.type === "image/jpg" ||
          file.type === "image/png" ||
          file.type === "image/webp"
        ) {
          formdata.append("images", file);
          validImages.push(file);
        } else {
          context.setAlertBox({
            open: true,
            error: true,
            msg: "Please select a valid JPG or PNG image file.",
          });
          setUploading(false);
          return;
        }
      }

      await uploadImage(apiEndPoint, formdata);

      const response = await fetchDataFromApi("/api/imageUpload");

      if (response && response.length > 0) {
        let allImages = [];
        response.forEach((item) => {
          if (item?.images?.length) {
            allImages = allImages.concat(item.images);
          }
        });

        const uniqueImages = [...new Set(allImages)];

        setPreviews(uniqueImages);

        const user = JSON.parse(localStorage.getItem("user"));
        const userInfo = await fetchDataFromApi(`/api/user/${user?.userId}`);

        const updatedData = {
          name: userInfo?.name,
          email: userInfo?.email,
          phone: userInfo?.phone,
          images: uniqueImages,
          isAdmin: userInfo?.isAdmin,
        };

        await editData(`/api/user/${user?.userId}`, updatedData);

        context.setAlertBox({
          open: true,
          error: false,
          msg: "Images Uploaded!",
        });
      }
    } catch (error) {
      console.error(error);
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Failed to upload images.",
      });
    } finally {
      setUploading(false);
    }
  };

  const edituser = async (e) => {
    e.preventDefault();

    if (
      formFields.name.trim() === "" ||
      formFields.email.trim() === "" ||
      formFields.phone.trim() === "" ||
      previews.length === 0
    ) {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Please fill all the details",
      });
      return;
    }

    setIsLoading(true);

    try {
      const user = JSON.parse(localStorage.getItem("user"));

      const updatedUser = {
        ...formFields,
        images: previews,
      };

      const res = await editData(`/api/user/${user?.userId}`, updatedUser);

      if (res?.status || res?.success) {
        context.setAlertBox({
          open: true,
          error: false,
          msg: "User profile updated successfully!",
        });
      } else {
        context.setAlertBox({
          open: true,
          error: true,
          msg: res?.message || "Failed to update profile.",
        });
      }
    } catch (error) {
      console.error(error);
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Something went wrong while updating profile.",
      });
    } finally {
      setIsLoading(false);
    }
  };



  const changePassword = (e) => {
    e.preventDefault();
    formdata.append("password", fields.password);

    if (
      fields.oldPassword !== "" &&
      fields.password !== "" &&
      fields.confirmPassword !== ""
    ) {
      if (fields.password !== fields.confirmPassword) {
        context.setAlertBox({
          open: true,
          error: true,
          msg: "Password and confirm password not match",
        });
      } else {
        const user = JSON.parse(localStorage.getItem("user"));

        const data = {
          name: user?.name,
          email: user?.email,
          password: fields.oldPassword,
          newPass: fields.password,
          phone: formFields.phone,
          images: formFields.images,
        };

        editData(`/api/user/changePassword/${user.userId}`, data).then(
          (res) => {

          }
        );
      }
    } else {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Please fill all the details",
      });
      return false;
    }
  };

  return (
    <section className="section myAccountPage">
      <div className="container">
        <h2 className="hd">My Account</h2>

        <Box sx={{ width: "100%" }} className="myAccBox card border-0">
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              aria-label="basic tabs example"
            >
              <Tab label="Edit Profile" {...a11yProps(0)} />
              <Tab label="Change Password" {...a11yProps(1)} />
            </Tabs>
          </Box>
          <CustomTabPanel value={value} index={0}>
            <form onSubmit={edituser}>
              <div className="row">
                <div className="col-md-4">
                  <div className="userImage d-flex align-items-center justify-content-center">
                    {uploading === true ? (
                      <CircularProgress />
                    ) : (
                      <>
                        {previews?.length !== 0 ? (
                          previews?.map((img, index) => {
                            return <img src={img} key={index} />;
                          })
                        ) : (
                          <img src={NoUserImg} />
                        )}
                        <div className="overlay d-flex align-items-center justify-content-center">
                          <IoMdCloudUpload />
                          <input
                            type="file"
                            multiple
                            onChange={(e) =>
                              onChangeFile(e, "/api/user/upload")
                            }
                            name="images"
                          />
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="col-md-8">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <TextField
                          label="Name"
                          variant="outlined"
                          className="w-100"
                          name="name"
                          onChange={changeInput}
                          value={formFields.name}
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <TextField
                          label="Email"
                          disabled
                          variant="outlined"
                          className="w-100"
                          name="email"
                          onChange={changeInput}
                          value={formFields.email}
                        />
                      </div>
                    </div>

                    <div className="col-md-6">
                      <div className="form-group">
                        <TextField
                          label="Phone"
                          variant="outlined"
                          className="w-100"
                          name="phone"
                          onChange={changeInput}
                          value={formFields.phone}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <Button
                      type="submit"
                      className="btn-blue bg-red btn-lg btn-big"
                    >
                      {isLoading === true ? <CircularProgress /> : "Save"}
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </CustomTabPanel>
          <CustomTabPanel value={value} index={1}>
            <form onSubmit={changePassword}>
              <div className="row">
                <div className="col-md-12">
                  <div className="row">
                    <div className="col-md-4">
                      <div className="form-group">
                        <TextField
                          label="Old Password"
                          variant="outlined"
                          className="w-100"
                          name="oldPassword"
                          onChange={changeInput2}
                        />
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="form-group">
                        <TextField
                          label="New password"
                          variant="outlined"
                          className="w-100"
                          name="password"
                          onChange={changeInput2}
                        />
                      </div>
                    </div>

                    <div className="col-md-4">
                      <div className="form-group">
                        <TextField
                          label="Confirm Password"
                          variant="outlined"
                          className="w-100"
                          name="confirmPassword"
                          onChange={changeInput2}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <Button
                      type="submit"
                      className="btn-blue bg-red btn-lg btn-big"
                    >
                      {" "}
                      Save
                    </Button>
                  </div>
                </div>
              </div>
            </form>
          </CustomTabPanel>
        </Box>
      </div>
    </section>
  );
};

export default MyAccount;

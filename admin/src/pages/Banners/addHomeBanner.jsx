import React, { useContext, useEffect, useState } from "react";
import Breadcrumbs from "@mui/material/Breadcrumbs";
import HomeIcon from "@mui/icons-material/Home";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { emphasize, styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import { FaCloudUploadAlt } from "react-icons/fa";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import {
  deleteData,
  deleteImages,
  fetchDataFromApi,
  postData,
  uploadImage,
} from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { FaRegImages } from "react-icons/fa";
import { MyContext } from "../../App";
import CircularProgress from "@mui/material/CircularProgress";
import { IoCloseSharp } from "react-icons/io5";
import { LazyLoadImage } from "react-lazy-load-image-component";
import "react-lazy-load-image-component/src/effects/blur.css";

const StyledBreadcrumb = styled(Chip)(({ theme }) => {
  const backgroundColor =
    theme.palette.mode === "light"
      ? theme.palette.grey[100]
      : theme.palette.grey[800];
  return {
    backgroundColor,
    height: theme.spacing(3),
    color: theme.palette.text.primary,
    fontWeight: theme.typography.fontWeightRegular,
    "&:hover, &:focus": {
      backgroundColor: emphasize(backgroundColor, 0.06),
    },
    "&:active": {
      boxShadow: theme.shadows[1],
      backgroundColor: emphasize(backgroundColor, 0.12),
    },
  };
});

const AddBanner = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formFields, setFormFields] = useState({
    images: [],
    catName: "",
    catId: "",
    subCat: "",
    subCatId: "",
    subCatName: "",
  });

  const [previews, setPreviews] = useState([]);
  const [categoryVal, setcategoryVal] = useState("");
  const [subCatVal, setSubCatVal] = useState("");
  const [subCatData, setSubCatData] = useState([]);

  const formdata = new FormData();
  const history = useNavigate();
  const context = useContext(MyContext);

  useEffect(() => {
    fetchDataFromApi("/api/imageUpload").then((res) => {
      res?.map((item) => {
        item?.images?.map((img) => {
          deleteImages(`/api/homeBanner/deleteImage?img=${img}`).then(() => {
            deleteData("/api/imageUpload/deleteAllImages");
          });
        });
      });
    });
  }, []);

  useEffect(() => {
    if (
      categoryVal &&
      !context.catData?.categoryList?.some((cat) => cat._id === categoryVal)
    ) {
      setcategoryVal("");
    }

    if (
      subCatVal &&
      !subCatData.some((subCat) => subCat._id === subCatVal)
    ) {
      setSubCatVal("");
    }
  }, [context.catData, subCatData]);


  let img_arr = [];
  let uniqueArray = [];

  const onChangeFile = async (e, apiEndPoint) => {
    try {
      const files = e.target.files;
      setUploading(true);

      for (var i = 0; i < files.length; i++) {
        if (
          files[i] &&
          (files[i].type === "image/jpeg" ||
            files[i].type === "image/jpg" ||
            files[i].type === "image/png" ||
            files[i].type === "image/webp")
        ) {
          const file = files[i];
          formdata.append(`images`, file);
        } else {
          context.setAlertBox({
            open: true,
            error: true,
            msg: "Please select a valid JPG or PNG image file.",
          });
          setUploading(false);
          return false;
        }
      }
    } catch (error) {
      console.log(error);
    }

    uploadImage(apiEndPoint, formdata).then(() => {
      fetchDataFromApi("/api/imageUpload").then((response) => {
        if (response?.length) {
          response.map((item) => {
            item?.images?.map((img) => {
              img_arr.push(img);
            });
          });

          uniqueArray = img_arr.filter(
            (item, index) => img_arr.indexOf(item) === index
          );

          const appendedArray = [...previews, ...uniqueArray];
          setPreviews(appendedArray);

          setTimeout(() => {
            setUploading(false);
            img_arr = [];
            uniqueArray = [];
            fetchDataFromApi("/api/imageUpload").then((res) => {
              res?.map((item) => {
                item?.images?.map((img) => {
                  deleteImages(`/api/homeBanner/deleteImage?img=${img}`);
                });
              });
            });

            context.setAlertBox({
              open: true,
              error: false,
              msg: "Images Uploaded!",
            });
          }, 500);
        }
      });
    });
  };

  const removeImg = async (index, imgUrl) => {
    const imgIndex = previews.indexOf(imgUrl);

    deleteImages(`/api/banners/deleteImage?img=${imgUrl}`).then(() => {
      context.setAlertBox({
        open: true,
        error: false,
        msg: "Image Deleted!",
      });
    });

    if (imgIndex > -1) {
      previews.splice(index, 1);
    }
  };

  const handleChangeCategory = async (event) => {
    const selectedId = event.target.value;
    setcategoryVal(selectedId);

    const selectedCat = context.catData?.categoryList.find(
      (cat) => cat._id === selectedId
    );

    setFormFields((prev) => ({
      ...prev,
      catName: selectedCat?.name || "",
      catId: selectedId,
    }));
    try {
      const result = await fetchDataFromApi(`/api/subcategories/${selectedId}`);
      if (Array.isArray(result)) {
        setSubCatData(result);
      } else {
        setSubCatData([]);
      }
    } catch (err) {
      console.error("Subcategory fetch error:", err);
      setSubCatData([]);
    }

    setSubCatVal("");
  };

  const handleChangeSubCategory = (event) => {
    const selectedId = event.target.value;
    setSubCatVal(selectedId);

    const selectedSubCat = subCatData.find((sub) => sub._id === selectedId);
    setFormFields((prev) => ({
      ...prev,
      subCat: selectedSubCat?.name || "",
      subCatName: selectedSubCat?.name || "",
      subCatId: selectedId,
    }));
  };

  useEffect(() => {
    if (categoryVal) {
      handleChangeCategory({ target: { value: categoryVal } });
    }
  }, []);


  const addHomeBanner = (e) => {
    e.preventDefault();
  };

  return (
    <div className="right-content w-100">
      <div className="card shadow border-0 w-100 flex-row p-4 mt-2">
        <h5 className="mb-0">Add Home Banner</h5>
        <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
          <StyledBreadcrumb
            component="a"
            href="#"
            label="Dashboard"
            icon={<HomeIcon fontSize="small" />}
          />
          <StyledBreadcrumb
            component="a"
            label="Home Banners"
            href="#"
            deleteIcon={<ExpandMoreIcon />}
          />
          <StyledBreadcrumb
            label="Add Home Banner"
            deleteIcon={<ExpandMoreIcon />}
          />
        </Breadcrumbs>
      </div>

      <form className="form" onSubmit={addHomeBanner}>
        <div className="row">
          <div className="col-sm-9">
            <div className="card p-4 mt-0">
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <h6>CATEGORY</h6>
                    <Select
                      value={categoryVal ?? ""}
                      onChange={handleChangeCategory}
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                      className="w-100"
                    >
                      <MenuItem value="">
                        <em>Select Category</em>
                      </MenuItem>

                      {Array.isArray(context.catData?.categoryList) &&
                        context.catData.categoryList.map((cat) => (
                          <MenuItem key={cat._id} value={cat._id}>
                            {cat.name}
                          </MenuItem>
                        ))}
                    </Select>

                  </div>
                </div>

                <div className="col-md-6">
                  <div className="form-group">
                    <h6>SUB CATEGORY</h6>
                    <Select
                      value={subCatVal ?? ""}
                      onChange={handleChangeSubCategory}
                      displayEmpty
                      inputProps={{ "aria-label": "Without label" }}
                      className="w-100"
                    >
                      <MenuItem value="">
                        <em>Select Subcategory</em>
                      </MenuItem>

                      {Array.isArray(subCatData) &&
                        subCatData.map((subCat) => (
                          <MenuItem key={subCat._id} value={subCat._id}>
                            {subCat.name}
                          </MenuItem>
                        ))}
                    </Select>

                  </div>
                </div>
              </div>

              <div className="imagesUploadSec">
                <h5 className="mb-4">Media And Published</h5>

                <div className="imgUploadBox d-flex align-items-center">
                  {previews?.length !== 0 &&
                    previews?.map((img, index) => (
                      <div className="uploadBox" key={index}>
                        <span
                          className="remove"
                          onClick={() => removeImg(index, img)}
                        >
                          <IoCloseSharp />
                        </span>
                        <div className="box">
                          <LazyLoadImage
                            alt={"image"}
                            effect="blur"
                            className="w-100"
                            src={img}
                          />
                        </div>
                      </div>
                    ))}

                  <div className="uploadBox">
                    {uploading ? (
                      <div className="progressBar text-center d-flex align-items-center justify-content-center flex-column">
                        <CircularProgress />
                        <span>Uploading...</span>
                      </div>
                    ) : (
                      <>
                        <input
                          type="file"
                          onChange={(e) =>
                            onChangeFile(e, "/api/banners/upload")
                          }
                          name="images"
                        />
                        <div className="info">
                          <FaRegImages />
                          <h5>image upload</h5>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <br />

                <Button
                  type="submit"
                  className="btn-blue btn-lg btn-big w-100"
                >
                  <FaCloudUploadAlt /> &nbsp;
                  {isLoading ? (
                    <CircularProgress color="inherit" className="loader" />
                  ) : (
                    "PUBLISH AND VIEW"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddBanner;

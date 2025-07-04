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
  editData,
  fetchDataFromApi,
  postData,
  uploadImage,
} from "../../utils/api";
import { useNavigate, useParams } from "react-router-dom";
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

const EditBanner = () => {
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

  let { id } = useParams();
  const formdata = new FormData();
  const history = useNavigate();
  const context = useContext(MyContext);

  useEffect(() => {
    context.setProgress(20);
    fetchDataFromApi("/api/imageUpload").then((res) => {
      res?.forEach((item) => {
        item?.images?.forEach((img) => {
          deleteImages(`/api/banners/deleteImage?img=${img}`).then(() => {
            deleteData("/api/imageUpload/deleteAllImages");
          });
        });
      });
    });

    fetchDataFromApi(`/api/banners/${id}`).then((res) => {
      setPreviews(res.images);
      setcategoryVal(res?.catId || "");
      setSubCatVal(res?.subCatId || "");
      setFormFields((prev) => ({
        ...prev,
        catId: res?.catId || "",
        subCatId: res?.subCatId || "",
      }));
      context.setProgress(100);
    });
  }, [id]);

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


  useEffect(() => {
    const subCatArr = [];
    context.catData?.categoryList?.forEach((cat) => {
      if (cat?.children?.length) {
        cat.children.forEach((subCat) => {
          subCatArr.push(subCat);
        });
      }
    });
    setSubCatData(subCatArr);
  }, [context.catData]);

  let img_arr = [];
  let uniqueArray = [];

  const onChangeFile = async (e, apiEndPoint) => {
    try {
      const files = e.target.files;
      setUploading(true);

      for (let file of files) {
        if (["image/jpeg", "image/jpg", "image/png"].includes(file.type)) {
          formdata.append("images", file);
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
      response.forEach((item) => {
        item?.images?.forEach((img) => img_arr.push(img));
      });

      uniqueArray = [...new Set(img_arr)];
      const appendedArray = [...previews, ...uniqueArray];
      setPreviews(appendedArray);

      setTimeout(() => {
        setUploading(false);
        img_arr = [];
        uniqueArray = [];
        fetchDataFromApi("/api/imageUpload").then((res) => {
          res?.forEach((item) => {
            item?.images?.forEach((img) => {
              deleteImages(`/api/banners/deleteImage?img=${img}`);
            });
          });
        });
        context.setAlertBox({
          open: true,
          error: false,
          msg: "Images Uploaded!",
        });
      }, 500);
    } catch (error) {
      console.log(error);
    }
  };

  const removeImg = (index, imgUrl) => {
    deleteImages(`/api/banners/deleteImage?img=${imgUrl}`).then(() => {
      context.setAlertBox({
        open: true,
        error: false,
        msg: "Image Deleted!",
      });
    });
    const newPreviews = [...previews];
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  const handleChangeCategory = (event) => {
    const selectedId = event.target.value;
    setcategoryVal(selectedId);
    const selectedCat = context.catData?.categoryList?.find(
      (cat) => cat._id === selectedId
    );
    setFormFields((prev) => ({
      ...prev,
      catName: selectedCat?.name || "",
      catId: selectedId,
    }));
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

  const editSlide = (e) => {
    e.preventDefault();
    const finalImages = [...previews];
    if (!formFields.catId || !formFields.subCatId || finalImages.length === 0) {
      context.setAlertBox({
        open: true,
        error: true,
        msg: "Please fill all the details",
      });
      return;
    }
    setIsLoading(true);
    formFields.images = finalImages;
    editData(`/api/banners/${id}`, formFields).then(() => {
      setIsLoading(false);
      context.fetchCategory();
      deleteData("/api/imageUpload/deleteAllImages");
      history("/banners");
    });
  };

  return (
    <div className="right-content w-100">
      <div className="card shadow border-0 w-100 flex-row p-4 mt-2">
        <h5 className="mb-0">Edit Banner</h5>
        <Breadcrumbs aria-label="breadcrumb" className="ml-auto breadcrumbs_">
          <StyledBreadcrumb component="a" href="#" label="Dashboard" icon={<HomeIcon fontSize="small" />} />
          <StyledBreadcrumb component="a" label="Edit Banner" href="#" deleteIcon={<ExpandMoreIcon />} />
        </Breadcrumbs>
      </div>
      <form className="form" onSubmit={editSlide}>
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
                        <em>None</em>
                      </MenuItem>
                      {context.catData?.categoryList?.map((cat) => (
                        <MenuItem value={cat._id} key={cat._id}>
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
                        <em>None</em>
                      </MenuItem>
                      {subCatData?.map((subCat) => (
                        <MenuItem value={subCat._id} key={subCat._id}>
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
                  {previews.map((img, index) => (
                    <div className="uploadBox" key={index}>
                      <span className="remove" onClick={() => removeImg(index, img)}>
                        <IoCloseSharp />
                      </span>
                      <div className="box">
                        <LazyLoadImage alt="image" effect="blur" className="w-100" src={img} />
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
                          onChange={(e) => onChangeFile(e, "/api/homeBanner/upload")}
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
                <Button type="submit" className="btn-blue btn-lg btn-big w-100">
                  <FaCloudUploadAlt /> &nbsp;{isLoading ? (
                    <CircularProgress color="inherit" className="loader" />
                  ) : (
                    "PUBLISH AND VIEW"
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </form >
    </div >
  );
};

export default EditBanner;
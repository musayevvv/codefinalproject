// ActiveTabs.jsx
import React from "react";
import Button from "@mui/material/Button";
import Rating from "@mui/material/Rating";
import CircularProgress from "@mui/material/CircularProgress";

const ActiveTabs = ({
    activeTabs,
    setActiveTabs,
    productData,
    reviewsData,
    reviews,
    rating,
    isLoading,
    onChangeInput,
    changeRating,
    addReview,
}) => {
    return (
        <div className="card mt-5 p-5 detailsPageTabs">
            <div className="customTabs">
                <ul className="list list-inline">
                    <li className="list-inline-item">
                        <Button className={`${activeTabs === 0 ? "active" : ""}`} onClick={() => setActiveTabs(0)}>
                            Description
                        </Button>
                    </li>
                    <li className="list-inline-item">
                        <Button className={`${activeTabs === 1 ? "active" : ""}`} onClick={() => setActiveTabs(1)}>
                            Additional info
                        </Button>
                    </li>
                    <li className="list-inline-item">
                        <Button className={`${activeTabs === 2 ? "active" : ""}`} onClick={() => setActiveTabs(2)}>
                            Reviews ({reviewsData?.length})
                        </Button>
                    </li>
                </ul>

                <br />

                {activeTabs === 0 && <div className="tabContent">{productData?.description}</div>}

                {activeTabs === 1 && (
                    <div className="tabContent">
                        <div className="table-responsive">
                            <table className="table table-bordered">
                                <tbody>
                                    <tr><th>Frame</th><td><p>{productData?.frame || "Aluminum"}</p></td></tr>
                                    <tr><th>Weight Capacity</th><td><p>{productData?.weightCapacity || "60 LBS"}</p></td></tr>
                                    <tr><th>Color</th><td><p>{productData?.color || "Black, Blue, Red, White"}</p></td></tr>
                                    <tr><th>Size</th><td><p>{productData?.size?.join(", ") || "M, S"}</p></td></tr>
                                    <tr><th>Wheels</th><td><p>{productData?.wheels || "12\" air / wide track slick tread"}</p></td></tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {activeTabs === 2 && (
                    <div className="tabContent">
                        <div className="row">
                            <div className="col-md-8">
                                <h3>Customer questions & answers</h3>
                                <br />
                                {reviewsData?.length !== 0 &&
                                    reviewsData.slice().reverse().map((item, index) => (
                                        <div className="reviewBox mb-4 border-bottom" key={index}>
                                            <div className="info">
                                                <div className="d-flex align-items-center w-100">
                                                    <h5>{item?.customerName}</h5>
                                                    <div className="ml-auto">
                                                        <Rating
                                                            name="half-rating-read"
                                                            value={Number(item?.customerRating) || 0}
                                                            precision={0.5}
                                                            readOnly
                                                            size="small"
                                                        />
                                                    </div>
                                                </div>
                                                <h6 className="text-light">{item?.dateCreated?.split("T")[0]}</h6>
                                                <p>{item?.review}</p>
                                            </div>
                                        </div>
                                    ))}

                                <br className="res-hide" />

                                <form className="reviewForm" onSubmit={addReview}>
                                    <h4>Add a review</h4>
                                    <div className="form-group">
                                        <textarea
                                            className="form-control shadow"
                                            placeholder="Write a Review"
                                            name="review"
                                            value={reviews.review}
                                            onChange={onChangeInput}
                                        ></textarea>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <Rating
                                                    name="rating"
                                                    value={Number(rating)}
                                                    precision={0.5}
                                                    onChange={changeRating}
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <br />
                                    <div className="form-group">
                                        <Button type="submit" className="btn-blue btn-lg btn-big btn-round">
                                            {isLoading ? <CircularProgress color="inherit" className="loader" /> : "Submit Review"}
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ActiveTabs;

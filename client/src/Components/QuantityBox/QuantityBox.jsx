import { FaMinus, FaPlus } from "react-icons/fa6";
import Button from "@mui/material/Button";
import { useContext, useEffect, useState } from "react";
import MyContext from "../../Context/MyContext";
import "./QuantityBox.css";

const QuantityBox = (props) => {
    const [inputVal, setInputVal] = useState(1);
    const context = useContext(MyContext);

    // Başlanğıc dəyəri təyin et
    useEffect(() => {
        if (props?.value !== undefined && props?.value !== null && props?.value !== "") {
            setInputVal(parseInt(props.value));
        }
    }, [props.value]);

    const minus = () => {
        if (inputVal > 1) {
            setInputVal((prev) => prev - 1);
        }
        context.setAlertBox({ open: false });
    };

    const plus = () => {
        const stock = parseInt(props.item.countInStock);
        if (inputVal < stock) {
            setInputVal((prev) => prev + 1);
        } else {
            context.setAlertBox({
                open: true,
                error: true,
                msg: "The quantity is greater than product count in stock",
            });
        }
    };

    // input dəyişəndə parent funksiyalara ötür
    useEffect(() => {
        if (props.quantity) props.quantity(inputVal);
        if (props.selectedItem) props.selectedItem(props.item, inputVal);
    }, [inputVal]);

    return (
        <div className="quantityDrop d-flex align-items-center">
            <Button onClick={minus}>
                <FaMinus />
            </Button>
            <input
                type="text"
                value={inputVal}
                onChange={(e) => {
                    const val = parseInt(e.target.value);
                    if (!isNaN(val) && val > 0) {
                        setInputVal(val);
                    }
                }}
            />
            <Button onClick={plus}>
                <FaPlus />
            </Button>
        </div>
    );
};

export default QuantityBox;

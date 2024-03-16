import React, { Fragment, useState } from 'react';
import "./Header.css";
import { SpeedDial, SpeedDialAction } from "@material-ui/lab";
import Backdrop from "@material-ui/core/Backdrop";
import DashboardIcon from "@material-ui/icons/Dashboard";
import PersonIcon from "@material-ui/icons/Person";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import ListAltIcon from "@material-ui/icons/ListAlt";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import { useNavigate } from 'react-router-dom';
import { useAlert } from "react-alert";
//import { ToastContainer, toast } from 'react-toastify';
//import 'react-toastify/dist/ReactToastify.css';
import { logout } from "../../../actions/userAction.js";
import { useDispatch, useSelector } from 'react-redux';

const UserOptions = ({ user }) => {
    const { cartItems } = useSelector((state) => state.cart);

    const [open, setOpen] = useState(false);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const alert = useAlert();

    const options = [
        { icon: <ListAltIcon style={{ color: "blueviolet" }} />, name: "Orders", func: orders },
        { icon: <PersonIcon style={{ color: "blueviolet" }} />, name: "Profile", func: account },
        {
            icon: (
                <ShoppingCartIcon
                    style={{ color: cartItems.length > 0 ? "tomato" : "blueviolet" }}
                />
            ),
            name: `Cart(${cartItems.length})`,
            func: cart,
        },
        { icon: <ExitToAppIcon style={{ color: "blueviolet" }} />, name: "Logout", func: logoutUser },
    ];

    if (user.role === "admin") {
        options.unshift({               //unshift matlab add at first place of array
            icon: <DashboardIcon style={{ color: "blueviolet" }} />,
            name: "Dashboard",
            func: dashboard,
        });
    }

    function dashboard() {
        navigate(`/admin/dashboard`);
    }

    function orders() {
        navigate("/orders");
    }
    function account() {
        navigate("/account");
    }
    function cart() {
        navigate("/Cart");
    }
    function logoutUser() {
        dispatch(logout());
        alert.success("Logout Successfully");
        //toast.success("LogOut Successfully");
    }


    return (
        <Fragment>
            <Backdrop open={open} style={{ zIndex: "10" }} />
            <SpeedDial
                ariaLabel="SpeedDial tooltip example"
                onClose={() => setOpen(false)}
                onOpen={() => setOpen(true)}
                style={{ zIndex: "11" }}
                open={open}
                direction="down"
                className="speedDial"
                icon={
                    <img
                        className="speedDialIcon"
                        src={user.avatar ? user.avatar.url : "/Profile.png"}
                        alt="Profile"
                    />
                }
            >
                {options.map((item) => (
                    <SpeedDialAction
                        key={item.name}
                        icon={item.icon}
                        tooltipTitle={item.name}
                        onClick={item.func}
                        tooltipOpen={window.innerWidth <= 600 ? true : true}
                    />
                ))}
            </SpeedDial>
            {/* <ToastContainer /> */}
        </Fragment>
    )
}

export default UserOptions
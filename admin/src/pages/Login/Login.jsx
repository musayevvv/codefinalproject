import { useContext, useEffect, useState } from "react";
import Logo from "../../assets/images/logo.png";
import patern from "../../assets/images/pattern.webp";
import {MyContext} from "../../App";
import { MdEmail } from "react-icons/md";
import { RiLockPasswordFill } from "react-icons/ri";
import { IoMdEye, IoMdEyeOff } from "react-icons/io";
import Button from "@mui/material/Button";
import { Link, useNavigate } from "react-router-dom";
import googleIcon from "../../assets/images/googleIcon.png";
import { editData, postData } from "../../utils/api";
import CircularProgress from "@mui/material/CircularProgress";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { firebaseApp } from "../../firebase";
import './Login.css'

const auth = getAuth(firebaseApp);
const googleProvider = new GoogleAuthProvider();

const Login = () => {
  const [inputIndex, setInputIndex] = useState(null);
  const [isShowPassword, setisShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [isOpenVerifyEmailBox, setIsOpenVerifyEmailBox] = useState(false);

  const history = useNavigate();
  const context = useContext(MyContext);

  const [formfields, setFormfields] = useState({
    email: "",
    password: "",
    isAdmin: true,
  });

  useEffect(() => {
    context.setisHideSidebarAndHeader(true);
    const token = localStorage.getItem("token");
    if (token) {
      setIsLogin(true);
      history("/");
    } else {
      history("/login");
    }
  }, []);

  const focusInput = (index) => setInputIndex(index);

  const onchangeInput = (e) => {
    setFormfields((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const signIn = async (e) => {
    e.preventDefault();
    if (!formfields.email) {
      return context.setAlertBox({ open: true, error: true, msg: "email can not be blank!" });
    }

    if (!isOpenVerifyEmailBox && !formfields.password) {
      return context.setAlertBox({ open: true, error: true, msg: "password can not be blank!" });
    }

    if (!isOpenVerifyEmailBox) {
      setIsLoading(true);
      const res = await postData("/api/user/signin", formfields);

      if (res.error !== true) {
        localStorage.setItem("token", res.token);
        const user = {
          name: res.user?.name,
          email: res.user?.email,
          userId: res.user?.id,
          isAdmin: res.user?.isAdmin,
        };
        localStorage.setItem("user", JSON.stringify(user));
        context.setAlertBox({ open: true, error: false, msg: "User Login Successfully!" });
        context.setIsLogin(true);
        setTimeout(() => history("/dashboard"), 2000);
      } else {
        if (res?.isVerify === false) {
          setIsOpenVerifyEmailBox(true);
        }
        context.setAlertBox({ open: true, error: true, msg: res.msg });
      }
      setIsLoading(false);
    } else {
      localStorage.setItem("userEmail", formfields.email);
      const res = await postData("/api/user/verifyAccount/resendOtp", { email: formfields.email });
      if (res?.otp) {
        await editData(`/api/user/verifyAccount/emailVerify/${res.existingUserId}`, {
          email: formfields.email,
          otp: res?.otp,
        });
        setTimeout(() => {
          setIsLoading(true);
          history("/verify-account");
        }, 2000);
      }
    }
  };

  const signInWithGoogle = () => {
    signInWithPopup(auth, googleProvider)
      .then(async (result) => {
        const user = result.user;
        const fields = {
          name: user.displayName,
          email: user.email,
          password: null,
          images: user.photoURL,
          phone: user.phoneNumber,
          isAdmin: true,
        };

        const res = await postData("/api/user/authWithGoogle", fields);
        if (res.error !== true) {
          localStorage.setItem("token", res.token);
          localStorage.setItem("user", JSON.stringify({
            name: res.user?.name,
            email: res.user?.email,
            userId: res.user?.id,
          }));

          context.setAlertBox({ open: true, error: false, msg: res.msg });
          context.setIsLogin(true);
          setTimeout(() => history("/dashboard"), 2000);
        } else {
          context.setAlertBox({ open: true, error: true, msg: res.msg });
        }
      })
      .catch((error) => {
        context.setAlertBox({ open: true, error: true, msg: error.message });
      });
  };

  return (
    <>
      <img src={patern} className="loginPatern" />
      <section className="loginSection">
        <div className="loginBox">
          <Link to="/" className="d-flex align-items-center flex-column logo">
            <img src={Logo} />
          </Link>

          <div className="wrapper mt-3 card border">
            {isOpenVerifyEmailBox && <h2 className="mb-4">Verify Email</h2>}
            <form onSubmit={signIn}>
              <div className={`form-group position-relative ${inputIndex === 0 && "focus"}`}>
                <span className="icon"><MdEmail /></span>
                <input
                  type="text"
                  className="form-control"
                  placeholder="enter your email"
                  onFocus={() => focusInput(0)}
                  onBlur={() => setInputIndex(null)}
                  autoFocus
                  name="email"
                  onChange={onchangeInput}
                />
              </div>

              {!isOpenVerifyEmailBox && (
                <>
                  <div className={`form-group position-relative ${inputIndex === 1 && "focus"}`}>
                    <span className="icon"><RiLockPasswordFill /></span>
                    <input
                      type={isShowPassword ? "text" : "password"}
                      className="form-control"
                      placeholder="enter your password"
                      onFocus={() => focusInput(1)}
                      onBlur={() => setInputIndex(null)}
                      name="password"
                      onChange={onchangeInput}
                    />
                    <span className="toggleShowPassword" onClick={() => setisShowPassword(!isShowPassword)}>
                      {isShowPassword ? <IoMdEyeOff /> : <IoMdEye />}
                    </span>
                  </div>

                  <div className="form-group">
                    <Button type="submit" className="btn-blue btn-lg w-100 btn-big">
                      {isLoading ? <CircularProgress /> : "Sign In"}
                    </Button>
                  </div>

                  <div className="form-group text-center mb-0">
                    <Link to="/forgot-password" className="link">FORGOT PASSWORD</Link>
                    <div className="d-flex align-items-center justify-content-center or mt-3 mb-3">
                      <span className="line"></span><span className="txt">or</span><span className="line"></span>
                    </div>
                    <Button
                      variant="outlined"
                      className="w-100 btn-lg btn-big loginWithGoogle"
                      onClick={signInWithGoogle}
                    >
                      <img src={googleIcon} width="25px" alt="google" /> &nbsp; Sign In with Google
                    </Button>
                  </div>
                </>
              )}

              {isOpenVerifyEmailBox && (
                <Button type="submit" className="btn-blue btn-lg w-100 btn-big">
                  {isLoading ? <CircularProgress /> : "Verify Email"}
                </Button>
              )}
            </form>
          </div>

          {!isOpenVerifyEmailBox && (
            <div className="wrapper mt-3 card border footer p-3">
              <span className="text-center">
                Don't have an account? <Link to="/signUp" className="link color ml-2">Register</Link>
              </span>
            </div>
          )}
        </div>
      </section>
    </>
  );
};

export default Login;

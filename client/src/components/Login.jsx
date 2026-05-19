import React from "react";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";


const Login = () => {
    const [state, setState] = React.useState("login");
    const { setShowUserLogin, setUser, axios, navigate } = useAppContext();

    const [formData, setFormData] = React.useState({
        name: "",
        email: "",
        password: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Handlers
    // Submit handler
    const submitHandler = async (event) => {
        try {
            event.preventDefault();

            const { data } = await axios.post(`/api/users/${state}`, formData);

            if (data.success) {
                navigate("/");
                setUser(data.user);
                toast.success(data.message);
                setShowUserLogin(false);
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            toast.error("An error occurred while logging in");
            console.error("Error in submitHandler", error);
        }
    };



    return (
        <div
            className="fixed flex items-center top-0 bottom-0 right-0 left-0 z-30 justify-center bg-black/60"
            onClick={() => {
                setShowUserLogin(false);
            }}>
            <form
                onSubmit={submitHandler}
                onClick={(e) => e.stopPropagation()}
                className="sm:w-87.5 w-full text-center bg-white border border-primary/20 rounded-2xl px-8 shadow-lg">
                <h1 className="text-text-primary text-3xl mt-10 font-bold">
                    {state === "login" ? "Welcome Back" : "Create Account"}
                </h1>

                <p className="text-text-secondary text-sm mt-2">
                    Please {state === "login" ? "sign in" : "sign up"} to
                    continue
                </p>

                {state !== "login" && (
                    <div className="flex items-center mt-6 w-full bg-white border border-primary/30 h-12 rounded-full overflow-hidden pl-6 gap-2 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            className="text-primary"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round">
                            {" "}
                            <circle cx="12" cy="8" r="5" />{" "}
                            <path d="M20 21a8 8 0 0 0-16 0" />{" "}
                        </svg>
                        <input
                            type="text"
                            name="name"
                            placeholder="Full Name"
                            className="w-full bg-transparent text-text-primary placeholder-text-secondary border-none outline-none"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>
                )}

                <div className="flex items-center w-full mt-4 bg-white border border-primary/30 h-12 rounded-full overflow-hidden pl-6 gap-2 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        className="text-primary"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round">
                        {" "}
                        <path d="m22 7-8.991 5.727a2 2 0 0 1-2.009 0L2 7" />{" "}
                        <rect x="2" y="4" width="20" height="16" rx="2" />{" "}
                    </svg>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email address"
                        className="w-full bg-transparent text-text-primary placeholder-text-secondary border-none outline-none"
                        value={formData.email}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="flex items-center mt-4 w-full bg-white border border-primary/30 h-12 rounded-full overflow-hidden pl-6 gap-2 focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/20">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="14"
                        height="14"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        className="text-primary"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round">
                        {" "}
                        <rect
                            width="18"
                            height="11"
                            x="3"
                            y="11"
                            rx="2"
                            ry="2"
                        />{" "}
                        <path d="M7 11V7a5 5 0 0 1 10 0v4" />{" "}
                    </svg>
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="w-full bg-transparent text-text-primary placeholder-text-secondary border-none outline-none"
                        value={formData.password}
                        onChange={handleChange}
                        required
                    />
                </div>

                <div className="mt-4 text-left">
                    <button className="text-sm text-primary hover:text-accent hover:underline font-medium">
                        Forgot password?
                    </button>
                </div>

                <button
                    type="submit"
                    className="mt-2 w-full h-11 rounded-full text-white bg-primary hover:bg-accent transition font-semibold shadow-md">
                    {state === "login" ? "Login" : "Sign Up"}
                </button>

                <p
                    onClick={() =>
                        setState((prev) =>
                            prev === "login" ? "register" : "login",
                        )
                    }
                    className="text-text-primary text-sm mt-3 mb-11 cursor-pointer">
                    {state === "login"
                        ? "Don't have an account?"
                        : "Already have an account?"}
                    <span className="text-primary hover:text-accent hover:underline ml-1 font-semibold">
                        click here
                    </span>
                </p>
            </form>
        </div>
    );
};

export default Login;

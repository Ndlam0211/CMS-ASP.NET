import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { 
  LogIn, 
  CircleAlert, 
  Sparkles, 
  Eye, 
  UserPlus, 
  HelpCircle 
} from "lucide-react";
import { loginUser, clearAuthError } from "../../store/slices/authSlice";
import { toast } from "react-toastify";

// Login custom schema
const loginSchema = yup.object().shape({
  email: yup.string().email("Please write a valid email").required("Email address is required"),
  password: yup.string().required("Password is required").min(6, "Must be at least 6 characters")
});

export const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Redux Auth States
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  // Check redirect URL query (e.g. if loaded from checkout)
  let redirectTarget = searchParams.get("redirect") || "/";
  if (redirectTarget && !redirectTarget.startsWith("/") && !redirectTarget.startsWith("http")) {
    redirectTarget = "/" + redirectTarget;
  }

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirectTarget);
    }
    return () => {
      dispatch(clearAuthError());
    };
  }, [isAuthenticated, navigate, redirectTarget, dispatch]);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm({
    resolver: yupResolver(loginSchema)
  });

  const onSubmitHandler = async (data) => {
    const result = await dispatch(loginUser({ email: data.email, password: data.password }));
    console.log("Login Result:", result);
    if (loginUser.fulfilled.match(result)) {
      toast.success(
        `Welcome back, ${result.payload.fullName || "User"}!`,
        {
          position: "bottom-right",
          autoClose: 2500,
        },
      );
    } else {
      toast.error(result.payload || "Login credentials rejected");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 flex flex-col justify-center min-h-[60vh]">
      {/* Visual Header */}
      <div className="text-center mb-8">
        <span className="inline-flex items-center gap-1.5 text-[10px] font-bold font-mono tracking-widest text-neutral-400 uppercase bg-neutral-50 px-2.5 py-1 mb-3">
          <Sparkles size={11} className="text-amber-500" /> Curation Session
        </span>
        <h1 className="text-2xl sm:text-3.5xl font-black text-neutral-900 tracking-widest uppercase">
          Login Account
        </h1>
        <p className="text-xs text-neutral-500 mt-1.5 leading-relaxed">
          Sign into your Atelier profile to authorize trackable COD dispatches
          and order logs.
        </p>
      </div>

      <div className="bg-white border border-neutral-150 p-6 sm:p-8 shadow-sm">
        <form
          onSubmit={handleSubmit(onSubmitHandler)}
          className="flex flex-col gap-4"
        >
          {/* Email */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase text-neutral-500 tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              placeholder="e.g. customer@gmail.com"
              {...register("email")}
              className={`border text-xs px-3.5 py-2.5 bg-neutral-50/50 focus:outline-none focus:bg-white focus:border-neutral-900 transition-all ${
                errors.email ? "border-red-400" : "border-neutral-200"
              }`}
            />
            {errors.email && (
              <span className="text-[10px] font-mono text-red-500 font-bold">
                {errors.email.message}
              </span>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold uppercase text-neutral-500 tracking-wider">
                Password
              </label>
              <Link
                to="/forgot-password"
                className="text-[10px] text-neutral-400 hover:text-neutral-900 font-semibold uppercase"
              >
                Forgot?
              </Link>
            </div>
            <input
              type="password"
              placeholder="e.g. ••••••••"
              {...register("password")}
              className={`border text-xs px-3.5 py-2.5 bg-neutral-50/50 focus:outline-none focus:bg-white focus:border-neutral-900 transition-all ${
                errors.password ? "border-red-400" : "border-neutral-200"
              }`}
            />
            {errors.password && (
              <span className="text-[10px] font-mono text-red-500 font-bold">
                {errors.password.message}
              </span>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 p-3 text-red-700 text-xs flex gap-2 items-center leading-normal">
              <CircleAlert size={15} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-neutral-950 text-white font-bold text-xs tracking-widest uppercase h-12 flex items-center justify-center gap-2 hover:bg-neutral-850 disabled:opacity-50 transition-colors mt-2"
          >
            <LogIn size={14} />
            {loading ? "Authenticating..." : "Sign In"}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-neutral-100 text-center flex flex-col gap-2">
          <Link
            to={`/register?redirect=${encodeURIComponent(redirectTarget)}`}
            className="inline-flex items-center justify-center gap-1 px-4 py-2 hover:bg-neutral-50 border border-neutral-150 text-[10px] font-bold uppercase tracking-widest text-neutral-800 transition-colors"
          >
            <UserPlus size={12} /> Don't have an profile? Register
          </Link>
        </div>
      </div>

      {/* Audits credentials hints row */}
      <div className="mt-6 bg-neutral-50 p-4 border border-neutral-150 rounded-none text-[11px] text-neutral-500 leading-normal font-mono flex gap-2">
        <HelpCircle
          size={15}
          className="text-neutral-600 flex-shrink-0 mt-0.5"
        />
        <div>
          <span className="font-bold text-neutral-800">
            CORS Demonstration Mode
          </span>
          : You can log in using typical credentials{" "}
          <span className="underline font-bold text-neutral-700">
            customer@gmail.com
          </span>{" "}
          or{" "}
          <span className="underline font-bold text-neutral-700">
            demo@fashion.com
          </span>{" "}
          with password{" "}
          <span className="underline font-bold text-neutral-700">123456</span>{" "}
          instantly.
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

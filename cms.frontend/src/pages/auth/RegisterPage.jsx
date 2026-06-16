import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { 
  UserPlus, 
  CircleAlert, 
  ArrowLeft,
  ShieldCheck 
} from "lucide-react";
import { registerUser, clearAuthError } from "../../store/slices/authSlice";
import { toast } from "react-toastify";

// Register validation rules schema
const registerSchema = yup.object().shape({
  fullName: yup.string().required("Full Name is required").min(3, "Name must be at least 3 characters"),
  email: yup.string().email("Invalid email address").required("Email address is required"),
  password: yup.string().required("Password is required").min(6, "Password must be at least 6 characters"),
  phone: yup.string().required("Telephone is required").matches(/^[0-9+() \-]{7,15}$/, "Invalid telephone format"),
  address: yup.string().required("Standard shipping address is required").min(10, "Provide full street address to avoid logistics return issues")
});

export const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // Redux Auth States
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

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
    resolver: yupResolver(registerSchema)
  });

  const onSubmitHandler = async (data) => {
    const result = await dispatch(registerUser(data));
    
    if (registerUser.fulfilled.match(result)) {
      toast.success("Account created successfully. Welcome to Atelier!", {
        position: "bottom-right",
        autoClose: 3000
      });
    } else {
      toast.error(result.payload || "Registration error occurred");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 flex flex-col justify-center min-h-[70vh]">
      
      {/* Title */}
      <div className="text-center mb-6">
        <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 tracking-widest uppercase">
          Create Profile
        </h1>
        <p className="text-xs text-neutral-500 mt-1 leading-relaxed">
          Become an Atelier club member today to access capsule releases.
        </p>
      </div>

      <div className="bg-white border border-neutral-150 p-6 sm:p-8">
        <form onSubmit={handleSubmit(onSubmitHandler)} className="flex flex-col gap-4">
          
          {/* Full Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase text-neutral-400 tracking-wider">
              Full Name
            </label>
            <input
              type="text"
              placeholder="Emily Watson"
              {...register("fullName")}
              className={`border text-xs px-3.5 py-2.5 bg-neutral-50/50 focus:outline-none focus:bg-white focus:border-neutral-900 transition-all ${
                errors.fullName ? "border-red-400" : "border-neutral-100"
              }`}
            />
            {errors.fullName && (
              <span className="text-[10px] font-mono text-red-500 font-bold">{errors.fullName.message}</span>
            )}
          </div>

          {/* Email Address */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase text-neutral-400 tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              placeholder="emily@gmail.com"
              {...register("email")}
              className={`border text-xs px-3.5 py-2.5 bg-neutral-50/50 focus:outline-none focus:bg-white focus:border-neutral-900 transition-all ${
                errors.email ? "border-red-400" : "border-neutral-100"
              }`}
            />
            {errors.email && (
              <span className="text-[10px] font-mono text-red-500 font-bold">{errors.email.message}</span>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase text-neutral-400 tracking-wider">
              Password
            </label>
            <input
              type="password"
              placeholder="e.g. •••••••• (At least 6 characters)"
              {...register("password")}
              className={`border text-xs px-3.5 py-2.5 bg-neutral-50/50 focus:outline-none focus:bg-white focus:border-neutral-900 transition-all ${
                errors.password ? "border-red-400" : "border-neutral-100"
              }`}
            />
            {errors.password && (
              <span className="text-[10px] font-mono text-red-500 font-bold">{errors.password.message}</span>
            )}
          </div>

          {/* Telephone */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase text-neutral-400 tracking-wider">
              Telephone Number
            </label>
            <input
              type="tel"
              placeholder="+1 (555) 0192"
              {...register("phone")}
              className={`border text-xs px-3.5 py-2.5 bg-neutral-50/50 focus:outline-none focus:bg-white focus:border-neutral-900 transition-all ${
                errors.phone ? "border-red-400" : "border-neutral-100"
              }`}
            />
            {errors.phone && (
              <span className="text-[10px] font-mono text-red-500 font-bold">{errors.phone.message}</span>
            )}
          </div>

          {/* Shipping Address */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase text-neutral-400 tracking-wider">
              Default Shipping Address
            </label>
            <input
              type="text"
              placeholder="Street Name, Apt, City, Zip Code"
              {...register("address")}
              className={`border text-xs px-3.5 py-2.5 bg-neutral-50/50 focus:outline-none focus:bg-white focus:border-neutral-900 transition-all ${
                errors.address ? "border-red-400" : "border-neutral-100"
              }`}
            />
            {errors.address && (
              <span className="text-[10px] font-mono text-red-500 font-bold">{errors.address.message}</span>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 p-3 text-red-700 text-xs flex gap-2 items-center leading-normal">
              <CircleAlert size={14} className="flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-neutral-900 text-white font-bold text-xs tracking-widest uppercase h-12 flex items-center justify-center gap-2 hover:bg-neutral-800 disabled:opacity-50 transition-colors mt-2"
          >
            <UserPlus size={14} />
            {loading ? "Creating Profile..." : "Register Profile"}
          </button>

        </form>

        <div className="mt-4 pt-4 border-t border-neutral-100 text-center">
          <Link 
            to={`/login?redirect=${encodeURIComponent(redirectTarget)}`}
            className="text-xs font-bold text-neutral-400 hover:text-neutral-950 flex items-center justify-center gap-1.5"
          >
            <ArrowLeft size={12} /> Already have a profile? Sign In
          </Link>
        </div>

      </div>

      <div className="mt-4 p-3 border border-neutral-150 rounded-none bg-neutral-50/50 flex gap-2 items-center text-[10px] text-neutral-400 font-mono">
        <ShieldCheck size={16} className="text-neutral-500 flex-shrink-0" />
        <span>Your member details are held under strict client GDPR/SSL isolation policies.</span>
      </div>

    </div>
  );
};

export default RegisterPage;

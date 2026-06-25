import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { KeyRound, ArrowLeft, CircleAlert } from "lucide-react";
import { toast } from "react-toastify";
import { resetPassword } from "../../store/slices/authSlice";

export const ResetPasswordPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const emailFromQuery = searchParams.get("email") || "";
  const { loading, error } = useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: emailFromQuery,
    },
  });

  const newPassword = watch("newPassword");

  const onSubmitHandler = async (data) => {
    const result = await dispatch(
      resetPassword({
        email: data.email,
        token: data.token,
        newPassword: data.newPassword,
      }),
    );

    if (resetPassword.fulfilled.match(result)) {
      toast.success("Đặt lại mật khẩu thành công");
      navigate("/login");
    } else {
      toast.error(result.payload || "Không thể đặt lại mật khẩu");
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 min-h-[60vh]">
      <div className="text-center mb-8">
        <h1 className="text-2xl font-black text-neutral-900 tracking-widest uppercase">
          Reset Password
        </h1>
        <p className="text-xs text-neutral-500 mt-2">
          Nhập mã xác nhận trong email và mật khẩu mới.
        </p>
      </div>

      <div className="bg-white border border-neutral-150 p-6 sm:p-8 shadow-sm">
        <form
          onSubmit={handleSubmit(onSubmitHandler)}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase text-neutral-500 tracking-wider">
              Email Address
            </label>
            <input
              type="email"
              {...register("email", {
                required: "Email không được để trống",
              })}
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

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase text-neutral-500 tracking-wider">
              Reset Code
            </label>
            <input
              type="text"
              placeholder="Enter 6-digit code"
              {...register("token", {
                required: "Mã xác nhận không được để trống",
              })}
              className={`border text-xs px-3.5 py-2.5 bg-neutral-50/50 focus:outline-none focus:bg-white focus:border-neutral-900 transition-all ${
                errors.token ? "border-red-400" : "border-neutral-200"
              }`}
            />
            {errors.token && (
              <span className="text-[10px] font-mono text-red-500 font-bold">
                {errors.token.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase text-neutral-500 tracking-wider">
              New Password
            </label>
            <input
              type="password"
              placeholder="New password"
              {...register("newPassword", {
                required: "Mật khẩu mới không được để trống",
                minLength: {
                  value: 6,
                  message: "Mật khẩu phải có ít nhất 6 ký tự",
                },
              })}
              className={`border text-xs px-3.5 py-2.5 bg-neutral-50/50 focus:outline-none focus:bg-white focus:border-neutral-900 transition-all ${
                errors.newPassword ? "border-red-400" : "border-neutral-200"
              }`}
            />
            {errors.newPassword && (
              <span className="text-[10px] font-mono text-red-500 font-bold">
                {errors.newPassword.message}
              </span>
            )}
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-bold uppercase text-neutral-500 tracking-wider">
              Confirm Password
            </label>
            <input
              type="password"
              placeholder="Confirm new password"
              {...register("confirmPassword", {
                required: "Vui lòng xác nhận mật khẩu",
                validate: (value) =>
                  value === newPassword || "Mật khẩu xác nhận không khớp",
              })}
              className={`border text-xs px-3.5 py-2.5 bg-neutral-50/50 focus:outline-none focus:bg-white focus:border-neutral-900 transition-all ${
                errors.confirmPassword ? "border-red-400" : "border-neutral-200"
              }`}
            />
            {errors.confirmPassword && (
              <span className="text-[10px] font-mono text-red-500 font-bold">
                {errors.confirmPassword.message}
              </span>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 p-3 text-red-700 text-xs flex gap-2 items-center">
              <CircleAlert size={15} />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-neutral-950 text-white font-bold text-xs tracking-widest uppercase h-12 flex items-center justify-center gap-2 hover:bg-neutral-850 disabled:opacity-50 transition-colors"
          >
            <KeyRound size={14} />
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-neutral-100 text-center">
          <Link
            to="/login"
            className="inline-flex items-center justify-center gap-1 text-[10px] font-bold uppercase tracking-widest text-neutral-700 hover:text-neutral-950"
          >
            <ArrowLeft size={12} /> Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;

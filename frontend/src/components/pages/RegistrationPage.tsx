import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import authValidation, { type UserRegisterFormValues } from "../../validations/auth.validation";
import { userUserRegistrationMutation } from "../../query/services/auth.service";
import { toast } from "sonner";

function RegistrationPage() {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UserRegisterFormValues>({
    resolver: zodResolver(authValidation.userRegistrationSchema),
  });

  const { mutate, isPending } = userUserRegistrationMutation();
  const onSubmit = async (data: UserRegisterFormValues) => {
    mutate(data, {
      onSuccess: () => {
        toast.success("Registration successful");
        reset();
      },
      onError: (err) => {
        toast.error(err.message);
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center  px-4">
      <div className="bg-base-100 p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Create an Account</h2>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {/* Name */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Fullname</span>
            </label>
            <input
              className={`input input-bordered w-full ${errors.username ? "input-error" : ""}`}
              placeholder="Enter your name"
              {...register("name")}
            />
            {errors.name && <span className="text-error text-sm mt-1">{errors.name.message}</span>}
          </div>

          {/* Username */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Username</span>
            </label>
            <input
              className={`input input-bordered w-full ${errors.username ? "input-error" : ""}`}
              placeholder="Enter your username"
              {...register("username")}
            />
            {errors.username && (
              <span className="text-error text-sm mt-1">{errors.username.message}</span>
            )}
          </div>

          {/* Email */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Email</span>
            </label>
            <input
              className={`input input-bordered w-full ${errors.email ? "input-error" : ""}`}
              placeholder="Enter your email"
              {...register("email")}
            />
            {errors.email && (
              <span className="text-error text-sm mt-1">{errors.email.message}</span>
            )}
          </div>

          {/* Password */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              className={`input input-bordered w-full ${errors.password ? "input-error" : ""}`}
              placeholder="Enter password"
              {...register("password")}
            />
            {errors.password && (
              <span className="text-error text-sm mt-1">{errors.password.message}</span>
            )}
          </div>

          {/* Confirm Password */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Confirm Password</span>
            </label>
            <input
              type="password"
              className={`input input-bordered w-full ${
                errors.confirmPassword ? "input-error" : ""
              }`}
              placeholder="Confirm password"
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <span className="text-error text-sm mt-1">{errors.confirmPassword.message}</span>
            )}
          </div>

          {/* Submit */}
          <button type="submit" className="btn btn-primary w-full mt-4" disabled={isPending}>
            {isPending ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        {/* Login link */}
        <p className="text-center text-sm opacity-70 mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-primary font-medium">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

export default RegistrationPage;

import { Link} from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import authValidation from "../../validations/auth.validation";
import { useUserLoginMutation } from "../../query/services/auth.service";
import { toast } from "sonner";
import { queryClient } from "../../App";

type LoginFormValues = z.infer<typeof authValidation.userLoginSchema>;

function LoginPage() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(authValidation.userLoginSchema),
  });
  const { mutate } = useUserLoginMutation();
  
  const onSubmit = (data: LoginFormValues) => {
    mutate(data, {
      onSuccess: () => {
        toast.success("Login successful");
        reset();
        queryClient.invalidateQueries({ queryKey: ["getCurrentUser"] });
      
      },
      onError: (err) => {
        toast.error(err.message);
      },
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center  px-4">
      <div className="bg-base-100 p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Login to your account</h2>

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          {/* Identifier */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Username or Email</span>
            </label>
            <input
              type="text"
              placeholder="Enter username or email"
              className={`input input-bordered w-full ${errors.identifier ? "input-error" : ""}`}
              {...register("identifier")}
            />
            {errors.identifier && (
              <p className="text-error text-sm mt-1">{errors.identifier.message}</p>
            )}
          </div>

          {/* Password */}
          <div className="form-control w-full">
            <label className="label">
              <span className="label-text">Password</span>
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className={`input input-bordered w-full ${errors.password ? "input-error" : ""}`}
              {...register("password")}
            />
            {errors.password && (
              <p className="text-error text-sm mt-1">{errors.password.message}</p>
            )}
          </div>

          {/* Login Button */}
          <button type="submit" className="btn btn-primary w-full mt-4" disabled={isSubmitting}>
            {isSubmitting ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* Signup link */}
        <p className="text-center text-sm opacity-70 mt-4">
          Don't have an account?{" "}
          <Link to="/register" className="text-primary font-medium">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;

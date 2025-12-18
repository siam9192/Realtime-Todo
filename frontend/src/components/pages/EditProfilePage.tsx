import React from "react";
import { useForm } from "react-hook-form";
import type { UpdateUserProfilePayload } from "../../types/user.type";
import { USER_PROPERTY_LENGTH } from "../../utils/constant";
import { useCurrentUserProviderContext } from "../../context/CurrentUserProviderContext";
import { toast } from "sonner";
import { useUpdateUserProfileMutation } from "../../query/services/user.service";
import userValidation from "../../validations/user.validation";

type EditProfileFormValues = UpdateUserProfilePayload;

const EditProfilePage: React.FC = () => {
  const { data, refetch } = useCurrentUserProviderContext();
  const user = data!.data;
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<EditProfileFormValues>({
    defaultValues: {
      name: user.name,
      gender: user.gender,
      profilePhoto: user.profilePhoto,
    },
  });

  const profilePhotoValue = watch("profilePhoto");

  const { mutate, isPending } = useUpdateUserProfileMutation();
  const handleFormSubmit = (data: UpdateUserProfilePayload) => {
    mutate(
      userValidation.updateUserProfileSchema.safeParse(data).data as UpdateUserProfilePayload,
      {
        onSuccess: () => {
          toast.success("Profile updated successfully");
          refetch();
        },
        onError: (err) => {
          toast.error(err.message);
        },
      },
    );
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-base-100 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>

      <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
        {/* Name */}
        <div>
          <label className="label font-medium">Full Name</label>
          <input
            className="input input-bordered w-full"
            {...register("name", {
              required: "Name is required",
              minLength: {
                value: USER_PROPERTY_LENGTH.name.min,
                message: `Name must be at least ${USER_PROPERTY_LENGTH.name.min} characters`,
              },
              maxLength: {
                value: USER_PROPERTY_LENGTH.name.max,
                message: `Name cannot exceed ${USER_PROPERTY_LENGTH.name.max} characters`,
              },
            })}
          />
          {errors.name && <p className="text-error text-sm mt-1">{errors.name.message}</p>}
        </div>

        {/* Gender */}
        <div>
          <label className="label font-medium">Gender</label>
          <select className="select select-bordered w-full" {...register("gender")}>
            <option value="">Unspecified</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Profile Picture */}
        <div>
          <label className="label font-medium">Profile Photo URL</label>
          <input
            type="text"
            className="input input-bordered w-full"
            {...register("profilePhoto")}
          />
          {errors.profilePhoto && (
            <p className="text-error text-sm mt-1">{errors.profilePhoto.message}</p>
          )}
          {profilePhotoValue ? (
            <div className="mt-2">
              <p className="text-sm opacity-70 mb-1">Preview:</p>
              <img
                src={profilePhotoValue}
                alt="Profile Preview"
                className="w-24 h-24 rounded-full object-cover border border-base-300"
              />
            </div>
          ) : null}
        </div>

        {/* Submit */}
        <div className="mt-4">
          <button disabled={isPending} type="submit" className="btn btn-primary w-full">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfilePage;

import  {userApi} from "@/features/auth/api/user";

export const userProvider = {
    loginService: userApi.loginService,
  registerService:userApi.registerService,
  profileService:userApi.profileService,
  profileUpdated:userApi.profileUpdated,
  freezeServices:userApi.freezeServices,
  deleteServices:userApi.deleteServices
};
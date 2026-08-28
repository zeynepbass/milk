import apiClient from "@/shared/api";

export const userApi = {
    loginService(formData) {
    return apiClient.post("/users/login",formData);
  },

  registerService(formData) {
    return apiClient.post("/users/register", formData);
  },
  profileService(){
    return apiClient.get("/users/profile");
  },
  profileUpdated(formData){
    return apiClient.put("/users/updateUser",formData);
  },
  freezeServices(){
    return apiClient.put( "/users/freeze");
  },
  deleteServices(id){
    return apiClient.delete(`/users/${id}`);
  }
};
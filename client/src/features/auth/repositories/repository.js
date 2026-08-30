import {userProvider} from "@/providers/auth.provider"
export async function loginService(formData) {
    const response = await userProvider.loginService(formData);

    return response.data
}
export async function registerService(formData) {
    const response = await userProvider.registerService(formData);
    return response.data
}

export async function profileService() {
    const response = await userProvider.profileService();

    return response.data
}
export async function profileUpdated(formData){

    const response=await userProvider.profileUpdated(formData);
    return response.data
}
export async function freezeServices(){

    const response=await userProvider.freezeServices();
    return response.data
}
export async function deleteServices(id){
    const response=await userProvider.deleteServices(id);
    return response.data
}

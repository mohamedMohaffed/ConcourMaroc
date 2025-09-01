import axios from "axios";

const refreshToken = async () => {
  const refresh = localStorage.getItem("refresh_token"); 
  if (!refresh) return null;

  try {
    const response = await axios.post("http://127.0.0.1:8000/base/api/token/refresh/", {
      refresh,
    });

    const newAccess = response.data.access;
    localStorage.setItem("access_token", newAccess); 
    console.log("✅ Token refreshed successfully");
    window.location.reload();
    return newAccess;
  } catch (error) {
    console.error("❌ Failed to refresh token:", error);
    localStorage.removeItem("access_token");  
    localStorage.removeItem("refresh_token"); 
    return null;
  }
};

export default refreshToken;

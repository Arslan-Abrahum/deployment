import { Navigate, Outlet } from "react-router-dom";
import { cookieStorage } from "../utils/cookieStorage";

const BuyerGuard = () => {
  const token = cookieStorage.getItem(cookieStorage.AUTH_KEYS.TOKEN) || null
  return token ? <Outlet /> : <Navigate to="/signin" replace />;
};

export default BuyerGuard;
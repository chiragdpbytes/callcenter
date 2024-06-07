import { useEffect, useState } from "react";
import useLocalStorage from "./useLocalStorage";
import Axios from "../utils/Axios";

function useTokenFromLocalStorage(initialValue) {
  const [value, setValue] = useLocalStorage("token", initialValue);
  const [isValid, setIsValid] = useState(false);
  // console.log("isValid =>", isValid);
  useEffect(() => {
    checkToken();
  }, [value]);

  async function checkToken() {
    const { data } = await Axios.post("/check-token", { token: value });
    const isTokenValid = data.isValid;
    // console.log("data.isValid", data.isValid);
    // setIsValid(data.data.isValid);
    // console.log("isTokenValid", !!isTokenValid);
    setIsValid(!!isTokenValid);
  }
  return [value, setValue, isValid];
}

export default useTokenFromLocalStorage;

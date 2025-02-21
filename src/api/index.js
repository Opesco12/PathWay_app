import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { endpoints } from "./endpoints";
import keys from "../storage/keys";
import { retrieveUserData } from "../storage/userData";
import { showMessage } from "react-native-flash-message";
import { Redirect, router } from "expo-router";

const BASE_URL = "https://pathway-proxy.vercel.app/api/v1";

const getAuthToken = async () => {
  const data = await retrieveUserData();
  return data?.token;
};

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 30000,
});

const apiCall = async ({
  endpoint,
  method = "GET",
  data = null,
  requiresAuth = true,
  customConfig = {},
} = {}) => {
  try {
    if (!endpoint) {
      throw new Error("Endpoint is required");
    }

    const config = {
      method,
      url: endpoint,
      headers: {
        "Content-Type": "application/json",
      },
      ...customConfig,
    };

    if (data) {
      config.data = data;
    }

    if (requiresAuth) {
      const token = await getAuthToken();
      if (!token) {
        // throw new Error("Authentication required but no token found");
        return router.replace("/(auth)/login");
      }
      config.headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await axiosInstance(config);
    return response.data;
  } catch (error) {
    console.error("API call error:", error);
    console.log(typeof error.status);
    if (error.status === 401) {
      showMessage({
        message: "Session expired, please login again",
        type: "warning",
      });
      return router.replace("/(auth)/login");
    }
    throw error;
  }
};

export const getCountries = async () => {
  try {
    const data = await apiCall({
      endpoint: endpoints.getCountries,
      method: "GET",
      requiresAuth: false,
    });
    return data;
  } catch (error) {
    console.log(error);
    showMessage({
      message: "Unable to fetch countries",
      type: "warning",
    });
  }
};

export const registerNewIndividual = async (info) => {
  try {
    const data = await apiCall({
      method: "POST",
      endpoint: endpoints.RegisterNewIndividual,
      data: info,
      requiresAuth: false,
    });
    return data;
  } catch (error) {
    console.log(info);
    console.log(error);
    if (error.status === 400) {
      showMessage({
        message: `Email address ${info?.email} or phone number has been used or is not available`,
        type: "warning",
      });
    } else {
      showMessage({
        message: "Please try again later",
        type: "warning",
      });
    }
  }
};

export const getClientInfo = async () => {
  try {
    const data = await apiCall({
      endpoint: endpoints.getClientInfo,
      method: "GET",
    });
    return data;
  } catch (error) {
    console.log(error);
    showMessage({
      message: "An error occured while trying to fetch info",
      type: "warning",
    });
  }
};

export const getNextOfKins = async () => {
  try {
    const data = await apiCall({
      endpoint: endpoints.getNextOfKins,
      method: "GET",
    });
    return data;
  } catch (error) {
    console.log(error);
    showMessage({
      message: "An error occured while trying to fetch info",
      type: "warning",
    });
  }
};

export const createNextOfKin = async (info) => {
  try {
    const data = await apiCall({
      endpoint: endpoints.createNextOfKin,
      method: "POST",
      data: info,
    });

    return data;
  } catch (error) {
    console.log(error);
    showMessage({
      message: "An error occured",
      type: "warning",
    });
  }
};

export const login = async (username, password) => {
  try {
    const data = await apiCall({
      endpoint: endpoints.Login,
      method: "POST",
      requiresAuth: false,
      data: { username: username, password: password },
    });
    return data;
  } catch (error) {
    console.log(error);
    if (error.status === 400) {
      showMessage({
        message: "Incorrect Email or password",
        type: "danger",
      });
    } else {
      showMessage({
        message: "Please try again later",
        type: "warning",
      });
    }
  }
};

export const login2fa = async (info) => {
  try {
    const data = await apiCall({
      endpoint: endpoints.Login2Fa,
      method: "POST",
      data: info,
      requiresAuth: false,
    });
    return data;
  } catch (error) {
    console.log(error);
    if (err.status === 400) {
      showMessage({
        message: "Incorrect Security Code",
        type: "danger",
      });
    } else {
      showMessage({
        message: "Please try again later",
        type: "warning",
      });
    }
  }
};

export const activateAccount = async (info) => {
  try {
    const data = await apiCall({
      endpoint: endpoints.ActivateAccount,
      method: "POST",
      data: info,
      requiresAuth: false,
    });
    return data;
  } catch (error) {
    console.log(error);
    if (error.status === 400) {
      setIsIncorrect(true);
      showMessage({
        message: "Incorrect Security Code",
        type: "danger",
      });
    } else {
      showMessage({
        message: "Please try again later",
        type: "warning",
      });
    }
  }
};

export const resnedActivationCode = async (info) => {
  try {
    const data = await apiCall({
      endpoint: endpoints.ResendActivationCode,
      method: "POST",
      data: info,
      requiresAuth: false,
    });
    return data;
  } catch (error) {
    console.log(error);
    if (error.status === 400) {
      showMessage({
        message: "Incorrect Security Code",
        type: "danger",
      });
    } else {
      showMessage({
        message: "Please try again later",
        type: "warning",
      });
    }
  }
};

export const logout = async (token) => {
  try {
    const data = await apiCall({
      method: "POST",
      endpoint: endpoints.Logout,
      data: { token: token },
    });
    return data;
  } catch (error) {}
};

export const changePassword = async (oldPassword, newPassword) => {
  try {
    const data = await apiCall({
      endpoint: endpoints.ChangePassword,
      method: "POST",
      data: { oldPassword: oldPassword, newPassword: newPassword },
    });
    return data;
  } catch (error) {
    console.log(error);
    if (error.status === 400) {
      showMessage({
        message: "Please input your correct password",
        type: "warning",
      });
    } else {
      showMessage({ message: "Unable to change password", type: "warning" });
    }
  }
};

export const resetPasswordRequest = async (email) => {
  try {
    const data = await apiCall({
      endpoint: endpoints.ResetPasswordRequest,
      method: "POST",
      data: { username: email, emailAddress: email },
    });
    return data;
  } catch (error) {
    if (error.status === 400) {
      showMessage({
        message: "Please input a registered email address",
        type: "warning",
      });
    } else {
      showMessage({ message: "An error occured", type: "danger" });
    }
  }
};

export const resetPassword = async (token, password) => {
  try {
    const data = await apiCall({
      endpoint: endpoints.ResetPassword,
      method: "POST",
      data: { token: token, password: password },
    });
    return data;
  } catch (error) {
    if (error.status === 400) {
      showMessage({
        message: "An error occured, Please confirm that the token is correct",
        type: "warning",
      });
    } else {
      showMessage({
        message: "An error occured",
        type: "warning",
      });
    }
  }
};

export const getWalletBalance = async () => {
  try {
    const data = await apiCall({
      endpoint: endpoints.getWalletBalance,
      method: "GET",
      requiresAuth: true,
    });
    return data;
  } catch (error) {
    console.log(error);
    showMessage({
      message: "Unable to fetch wallet balance",
      type: "warning",
    });
  }
};

export const getProducts = async () => {
  try {
    const data = await apiCall({
      endpoint: endpoints.getProducts,
      method: "GET",
      requiresAuth: true,
    });
    return data;
  } catch (error) {
    console.log(error);
    showMessage({
      message: "An error occured",
      type: "warning",
    });
  }
};

export const getVirtualAccounts = async () => {
  try {
    const data = await apiCall({
      endpoint: endpoints.getVirtualAccounts,
      method: "GET",
    });
    return data;
  } catch (error) {
    showMessage({
      message: "Unable to fetch virtual accounts",
      type: "warning",
    });
  }
};

export const getClientPortfolio = async () => {
  try {
    const data = await apiCall({
      endpoint: endpoints.getPortfolio,
      method: "GET",
    });
    return data;
  } catch (error) {
    showMessage({
      message: "Unable to fetch portfolio",
      type: "warning",
    });
  }
};

export const getMutualFundOnlineBalances = async () => {
  try {
    const data = await apiCall({
      endpoint: endpoints.getMutualFundOnlineBalances,
      method: "GET",
    });
    return data;
  } catch (error) {
    showMessage({
      message: "Unable to fetch data",
      type: "warning",
    });
  }
};

export const getMutualFundOnlineBalance = async (portfolioId) => {
  try {
    const data = await apiCall({
      endpoint: `${endpoints.getMutualFundOnlineBalance}/${portfolioId}`,
      method: "GET",
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const getMutualFundStatement = async (portfolioId) => {
  try {
    const date = new Date().toISOString();
    const data = await apiCall({
      endpoint: `${endpoints.getMutualFundStatement}/${portfolioId}/${date}`,
      method: "GET",
    });
    return data;
  } catch (err) {
    console.log(err);
    showMessage({
      message: "Unable to fetch statement",
      type: "warning",
    });
  }
};

export const getTransactions = async (startdate, enddate) => {
  try {
    const data = await apiCall({
      endpoint: `${endpoints.getTransactions}/${startdate}/${enddate}`,
      method: "GET",
    });
    return data;
  } catch (error) {
    showMessage({
      message: "Unable to fetch transactions",
      type: "warning",
    });
  }
};

export const mutualFundSubscription = async ({
  accountNumber,
  portfolioId,
  amount,
}) => {
  if (accountNumber) {
  } else {
    try {
      const data = await apiCall({
        endpoint: endpoints.mutualFundNoAccount,
        method: "POST",
        data: {
          portfolioId: portfolioId,
          amount: amount,
        },
      });
      console.log("The request gave back: ", data);
      return data;
    } catch (error) {
      console.log(error);
      showMessage({
        message: "An error occured",
        type: "warning",
      });
    }
  }
};

export const mutualfundRedemption = async (accountNo, amount) => {
  try {
    console.log("account numer is:", accountNo);
    console.log("amount is : ", amount);
    const data = await apiCall({
      endpoint: endpoints.mutualfundRedemption,
      method: "POST",
      data: {
        mutualfundAccountNo: accountNo,
        amount: amount,
      },
    });
    return data;
  } catch (err) {
    console.log(err);
    showMessage({
      message: "An error occured while processing fund withdrawal",
      type: "warning",
    });
  }
};

export const getFixedIcomeOnlineBalances = async (portfolioId) => {
  try {
    const data = await apiCall({
      endpoint: `${endpoints.getFixedIncomeBalances}/${portfolioId}`,
      method: "GET",
    });
    return data;
  } catch (error) {
    console.log(error);
    showMessage({ message: "An error occured", type: "warning" });
  }
};

export const getLiabilityProducts = async (portfolioId) => {
  try {
    const data = await apiCall({
      endpoint: `${endpoints.getLiabilityProducts}/${portfolioId}`,
      method: "GET",
    });
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const getTenor = async (productId) => {
  try {
    const data = await apiCall({
      endpoint: `${endpoints.getProductTenor}/${productId}`,
      method: "GET",
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};

export const fixedIncomeSubscriptionOrder = async ({
  securityProductId,
  portfolioId,
  currency,
  faceValue,
  tenor,
}) => {
  try {
    const data = await apiCall({
      endpoint: endpoints.fixedIncomeSubscription,
      method: "POST",
      data: {
        securityProductId: securityProductId,
        portfolioId: portfolioId,
        currency: currency,
        faceValue: faceValue,
        tenor: tenor,
      },
    });

    return data;
  } catch (error) {
    console.log(error);
  }
};

export const fixedIncomeRedemptionOrder = async (referenceNo, amount) => {
  try {
    const data = await apiCall({
      endpoint: endpoints.fixedIncomeRedemption,
      method: "POST",
      data: {
        purchaseReferenceNo: referenceNo,
        faceValue: amount,
      },
    });
    return data;
  } catch (error) {
    console.log(error);
    showMessage({
      message: "An error occured while processing fund withdrawal",
      type: "warning",
    });
  }
};

export const getBanks = async () => {
  try {
    const data = await apiCall({
      endpoint: endpoints.getBanks,
      method: "GET",
    });
    return data;
  } catch (error) {
    console.error(error);
    showMessage({
      message: "Unable to fetch banks",
      type: "warning",
    });
  }
};

export const createClientBank = async (requestData) => {
  try {
    const data = await apiCall({
      endpoint: endpoints.createBank,
      method: "POST",
      data: requestData,
    });
    return data;
  } catch (error) {
    console.error(error);
    showMessage({
      message: "Invalid details or error while processing request",
      type: "warning",
    });
  }
};

export const getclientbankaccounts = async () => {
  try {
    const data = await apiCall({
      endpoint: endpoints.getClientBanks,
      method: "GET",
    });
    return data;
  } catch (error) {
    console.error(error);
    showMessage({
      message: "Unable to fetch client bank accounts",
      type: "warning",
    });
  }
};

export const debitWallet = async (requestData) => {
  try {
    const data = await apiCall({
      endpoint: endpoints.withdraw,
      method: "POST",
      data: requestData,
    });
    return data;
  } catch (error) {
    console.error(error);
    showMessage({
      message: "An error occured",
      type: "warning",
    });
  }
};

export const getRelationshipManager = async () => {
  try {
    const data = await apiCall({
      endpoint: endpoints.clientRelationshipManager,
    });
    return data;
  } catch (error) {
    console.error(error);
    showMessage({
      message: "An error occured",
      type: "warning",
    });
  }
};

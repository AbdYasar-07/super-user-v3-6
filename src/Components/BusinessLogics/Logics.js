import axios from "axios";
import Axios from "../../Utils/Axios";



export const roleFilter = (data, condition) => {
  if (data?.length > 0) {
    data = data?.filter((ele) => ele?.name?.includes(condition));
  }
  return data;
};
export const groupFilter = (data, condition) => {
  if (data?.length > 0) {
    data = data?.filter((ele) => ele?.name?.includes(condition));
  }
  return data;
};
export const toMapApplicationNames = (data, clientsinfo) => {
  data?.forEach((ele, index) => {
    let foundedValue = clientsinfo?.find(
      (clientsData) => clientsData?.client_id === ele?.applicationId
    );
    if (foundedValue) {
      data[index]["applicationName"] = foundedValue?.name;
    }
  });
  if (data.length > 0) {
    return data;
  }
};
export const getOSCStoreIDByBPCode = async (bpCode) => {
  const body = JSON.stringify({
    id: 107164,
    filters: [
      {
        name: "SAP BP Code",
        values: `${bpCode}`,
      },
    ],
  });
  const url = "https://service-staging.carrier.com.ph/services/rest/connect/v1.4/analyticsReportResults";
  const response = await Axios(url, "POST", body, null, false, true);
  if (!axios.isAxiosError(response)) {
    return response;
  } else {
    console.error("Error :::", response.cause);
  }
};
export const getAllSystemGroupsFromAuth0 = async (url, accessToken) => {

  if (!url || !accessToken)
    return;

  const response = await Axios(url, 'GET', null, accessToken, false, null);
  if (!axios.isAxiosError(response)) {
    return response;
  } else {
    console.error("Erro while getting groups from the Auth0 system :::", response?.cause?.message);
    return null;
  }

};
export const getShopifyCompaniesId = async () => {
  let data = JSON.stringify({
    query: `query GetThat {
    companies(first: 100) {
      edges {
        node {
          id
          name
          externalId
        }
      }
    }
  }`,
    variables: {}
  });
  let url = `https://phoenix-ph.myshopify.com/admin/api/2023-07/graphql.json`;
  const response = await Axios(url, 'POST', data, null, true, false, true);
  if (!axios.isAxiosError(response)) {
    return response;
  } else {
    console.error("Error while getting shopify company inforamtion :::", response?.cause?.message);
    return null;
  }
};
export const createUserInShopifySystem = async (user) => {
  let data = JSON.stringify({
    "customer": {
      "first_name": user.name,
      "last_name": user.nickname,
      "email": user.email,
      "verified_email": user?.verifiedEmail
    }
  });
  let url = `https://phoenix-ph.myshopify.com/admin/api/2023-07/customers.json`;
  const response = await Axios(url, 'POST', data, null, true, false, true);
  if (!axios.isAxiosError(response)) {
    return response;
  } else {
    if (response?.response?.data['errors']['email']) {
      console.error("Error while creating an user in shopify :::", 'email', response?.response?.data['errors']['email'][0]);
      return `email ${response?.response?.data['errors']['email'][0]}`;
    } else {
      console.error("Error while creating an user in shopify :::", response?.cause?.message[0]);
      return response?.cause?.message;
    }
  }
};
export const updateUserInShopify = async (user, shopifyCustomerId) => {
  let body = {
    "customer": {
      "first_name": user.name,
      "last_name": user.nickname,
      "email": user.email,
      "verified_email": user?.verifiedEmail
    }
  };
  let url = `https://phoenix-ph.myshopify.com/admin/api/2023-07/customers/${shopifyCustomerId}.json`;
  const response = await Axios(url, 'PUT', body, null, true, false, true);
  if (!axios.isAxiosError(response)) {
    console.log("Updated user response from shopify :::", response);
    return response;
  } else {
    console.error("Error while updating user in shopify :::", response?.cause?.message);
    return null;
  }
};
export const checkUserExistsInShopify = async (userEmail) => {
  let url = `https://phoenix-ph.myshopify.com/admin/api/2023-07/customers/search.json?query=email:${userEmail}`;
  const response = await Axios(url, 'GET', null, null, true, false, true);
  if (!axios.isAxiosError(response)) {
    return response.customers[0] ? response.customers[0]?.id : false;
  } else {
    console.error("Error while checking user in shopify :::", response?.cause?.message);
    return null;
  }
};
export const updateUserInAuth0 = async (url, userId, body, token) => {
  let endpoint = `${url}users/${userId}`;
  const response = await Axios(endpoint, 'PATCH', body, token, true, null, null);
  if (!axios.isAxiosError(response)) {
    return true;
  } else {
    console.error("Error while updating user information in Auth0 system :::", response?.cause?.message);
    return false;
  }
};

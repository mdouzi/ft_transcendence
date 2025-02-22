import { GoLogin  } from './utils.js';


export async function refreshAccessToken() 
{
    try 
    {
        const refreshToken = localStorage.getItem("refreshToken");
        // //("refreshToken in refreshAccessToken======", refreshToken);

            const response = await fetch(`/api/token/refresh/`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ refresh: refreshToken }),
        });

        //("status in refreshToken function:", response.status);

        if (!response.ok) 
        {
            // alert("Session expired. Please log in again.");
            GoLogin();
        }
        else
        {
            const data = await response.json();
            //("New access token retrieved successfully.");
            localStorage.setItem("accessToken", data.access);
        }
    } 
    catch (error) 
    {
        console.error("Error occurred while refreshing the access token:", error.message);
        alert("Session expired. Please log in again.");
        GoLogin();
    }
}

export async function SecureApiRequest(endpoint, method = "GET", body = null, is_upload = false) 
{
    let token = localStorage.getItem("accessToken");
    if(!token)
        return null;

    let type = "application/json";

    // if(is_upload)
    //     type = "multipart/form-data";
    let headers = {
        Authorization: `Bearer ${token}`,
        // "Content-Type": type,
    };

    if (!is_upload) 
        headers["Content-Type"] = "application/json";

    let request = {
        method,
        headers,
    };
    //("request in SecureApiRequest:", request);
           
    // if (is_upload) 
    //     delete request.headers["Content-Type"];

    if (body && typeof body !== "string" && is_upload === false) 
        request.body = JSON.stringify(body);
    else if(body) 
        request.body = body;
    try 
    {
        const response = await fetch(`${endpoint}`, request);

        if (response.status === 401) 
        {
            console.warn("Access token expired. Attempting to refresh...");
            await refreshAccessToken();
            token = localStorage.getItem("accessToken");
            headers.Authorization = `Bearer ${token}`;
            request.headers = headers;

            const retryResponse = await fetch(`${endpoint}`, request);

            if (retryResponse.ok) 
            {
                const data = await retryResponse.json();
                //("Request retried successfully after token refresh.");
                return data;
            }
            console.error("accessToken refresh failed.");
            alert("Session expired. Please log in again...");

            const data = await retryResponse.json();
            GoLogin();
            return data.error;
        }
        if (response.ok) 
        {
            //("feth from api");
            const data = await response.json();
            return data;
        } 
        if(!response.ok)
        {
            const data = await response.json();
            //("SecureApiRequest: ", data);

            //("status :", response.status, data.error);
            //("data, ", data);
            return data;
        }
    } 
    catch (error) 
    {
        console.error("Error in SecureApiRequest:", error.message);
        alert("An error occurred. Please try again.");
        throw error;
    }
}



import { useEffect, useState } from "react";
import { BASE_URL, TOKEN } from "../environments/utils";

const usePostRequests = (url: string, bodyData: any = {}, headers: any = {},) => {

    const [data, setData] = useState<any>({});

    async function postRequest() {
        const response = await fetch(BASE_URL + url, {
            method: "POST",
            headers: { ...headers, "Content-Type": "application/json", Authorization: `Bearer ${TOKEN}` },
            body: JSON.stringify({ ...bodyData })
        })
        const fetchedData = await response.json();
        if (fetchedData) {
            setData(fetchedData)
        } else {
            // handle error
        }
    }

    useEffect(() => {
        postRequest();
    }, [url])

    return data;
}

export default usePostRequests;
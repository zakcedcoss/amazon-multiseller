import { useEffect, useState } from "react";
import { BASE_URL, getToken } from "../environments/utils";

const useGetRequests = (url: string, headers: any = {}) => {
    const [data, setData] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState<[boolean, string]>([false, ""])

    async function getRequest() {
        setIsLoading(true);
        const response = await fetch(BASE_URL + url, {
            headers: {
                ...headers, "Content-Type": "application/json", Authorization: `Bearer ${getToken()}`, "Ced-Source-Id": undefined,
                "Ced-Source-Name": "",
                "Ced-Target-Id": "",
                "Ced-Target-Name": ""
            },
        })
        const fetchedData = await response.json();
        if (fetchedData) {
            if (fetchedData.success) {
                setData(fetchedData);
                setIsLoading(false)
                setErrors([false, ""])
            } else {
                // handle error
                setIsLoading(false)
                setErrors([true, fetchedData.message])
                setData([])
            }
        }
    }

    useEffect(() => {
        getRequest();
    }, [url])

    return { data, isLoading, errors };
}

export default useGetRequests;
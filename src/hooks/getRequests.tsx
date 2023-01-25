import { useEffect, useState } from "react";
import { BASE_URL, TOKEN } from "../environments/utils";


const useGetRequests = (url: string, headers: any = {}) => {

    const [data, setData] = useState<any>([]);
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState<[boolean, string]>([false, ""])

    async function getRequest() {
        setIsLoading(true);
        const response = await fetch(BASE_URL + url, {
            method: "GET",
            headers: { ...headers, "Content-Type": "application/json", Authorization: `Bearer ${TOKEN}` },
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
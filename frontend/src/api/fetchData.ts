import { useEffect, useState } from "react"
import apiClient from "./client"


function fetchData(endpoint: string, dependencies: any[] = []) {
    const [data, setData] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<any>(null)

    useEffect(() => {
        async function fetchData() {
            setLoading(true)
            setError(null)
            try {
                const response = await apiClient.get(endpoint)
                setData(response.data)
            }
            catch (error) {
                setError(error)
            }
            finally {
                setLoading(false)
            }
        }
        fetchData()
    }, dependencies)

    return {data, setData, loading, error}
}

export default fetchData
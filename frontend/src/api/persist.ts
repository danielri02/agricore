import apiClient from "./client";


export async function createRows(endpoint: string, newRows: any[]) {
    const response = await apiClient.post(endpoint, newRows)
    return response.data
}

export async function updateRow(endpoint: string, newRow: any) {
    const response = await apiClient.put(`${endpoint}/${newRow.id}`, newRow)
    return response.data
}

export async function deleteRows(endpoint: string, ids: number[]) {
    const response = await apiClient.delete(endpoint, { params: { ids: ids }, paramsSerializer: { indexes: null } })
    return response.data
}


import { useAuth } from "./AuthContext";


export function isAdmin() {
    const { user } = useAuth()
    return user.role == "Admin"
}

export function isOperator() {
    const { user } = useAuth()
    return user.role == "Operator"
}

export function isAuditor() {
    const { user } = useAuth()
    return user.role == "Auditor"
}
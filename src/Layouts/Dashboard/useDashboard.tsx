import { useState } from "react"
import { useNavigate } from "react-router-dom"

/**
 * Hook for the Dashboard component.
 */
export function useDashboard() {
    const [open, setOpen] = useState(false)
    const navigate = useNavigate()


    const toggleDrawer = () => {
        setOpen(!open)
    }

    return {
        open,
        toggleDrawer,
        navigate
    }
}
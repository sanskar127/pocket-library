import React from 'react'
import { TouchableOpacity } from 'react-native'
import { useDispatch } from 'react-redux'
import { addRouteToHistory } from "@/features/localRouterSlice"

interface props {
    children: React.ReactNode
    to: string
    className?: string
    style?: object
}

const LocalLink: React.FC<props> = ({ children, to, className, style }) => {
    const dispatch = useDispatch()

    const handlePress = () => {
        dispatch(addRouteToHistory(to))
    }

    return (
        <TouchableOpacity onPress={handlePress} className={className} style={style}>
            {children}
        </TouchableOpacity>
    )
}

export default LocalLink

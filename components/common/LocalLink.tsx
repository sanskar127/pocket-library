import React from 'react'
import { Pressable } from 'react-native'
import { useDispatch } from 'react-redux'
import { addRouteToHistory } from "@/features/localRouterSlice"

interface props {
    children: React.ReactNode
    to: string
    className?: string
}

const LocalLink: React.FC<props> = ({ children, to, className }) => {
    const dispatch = useDispatch()

    const handlePress = () => {
        dispatch(addRouteToHistory(to))
    }

    return (
        <Pressable onPress={handlePress} className={className}>
            {children}
        </Pressable>
    )
}

export default LocalLink

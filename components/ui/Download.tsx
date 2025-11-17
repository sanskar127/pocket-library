import { ImageInterface, VideoInterface } from '@/types/types'
import { FC, ReactNode } from 'react'
import { Pressable } from 'react-native'

interface props {
    children: ReactNode
    entry: VideoInterface | ImageInterface
}

const Download: FC<props> = ({ children, entry }) => {
    return (
        <Pressable
            // onPress={handleDownload}
            className="mt-2 bg-primary px-4 py-2 rounded-sm w-fit self-start"
        >
            {children}
        </Pressable>
    )
}

export default Download

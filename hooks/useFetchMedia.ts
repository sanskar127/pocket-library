import { useGetMediaMutation } from '@/api/mediaApi'
import { usePathname } from 'expo-router'
import { useEffect } from 'react'

const useFetchMedia = () => {
    const [getMedia, { data, isLoading, isError }] = useGetMediaMutation()
    const fullpath = usePathname()
    const pathname = fullpath?.replace('/dashboard', '')
    const offset = 0
    const limit = 3

    console.log(pathname)

    useEffect(() => {
        // Define an async function inside the effect
        const fetchData = async () => {
            try {
                await getMedia({ pathname, offset, limit }).unwrap()
            } catch (e) {
                // Handle the error
                console.error(e)
            }
        }

        // Call the async function
        fetchData()
    }, [getMedia, pathname])

    return { data, isLoading, isError }
}

export default useFetchMedia

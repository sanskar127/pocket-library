import useLocalRouter from '@/hooks/useLocalRouter';
import { FC, ReactNode } from 'react';

const LocalRouter: FC<{ children: ReactNode }> = ({ children }) => {
    useLocalRouter();

    return (
        <>
            {children}
        </>
    )
}

export default LocalRouter

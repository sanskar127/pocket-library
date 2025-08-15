import { FaAngleLeft } from 'react-icons/fa6'
import { useLocation, useNavigate } from 'react-router'

const Breadcrumbs = () => {
    const { pathname } = useLocation()
    const navigate = useNavigate()

    // Split pathname into parts for nicer display (excluding empty segments)
    const pathParts = pathname.split('/').filter(Boolean)

    return (
        <div className="text-foreground text-xl font-medium flex items-center gap-3 p-3 transition-all">
            <button
                onClick={() => navigate(-1)}
                className={`hover:text-primary transition-colors ${pathname === '/' ? "opacity-0" : "opacity-100"}`}
                aria-label="Go back"
            >
                <FaAngleLeft />
            </button>
            <ol className="flex items-center gap-2">
                <li
                    className="cursor-pointer hover:text-primary"
                    onClick={() => navigate(0)}
                    aria-label="Go to home"
                >
                    Home
                </li>
                {pathParts.map((part, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                        <span className="select-none text-2xl text-gray-400">/</span>
                        <span className="capitalize cursor-default">{decodeURIComponent(part.replace(/-/g, ' '))}</span>
                    </li>
                ))}
            </ol>
        </div>
    )
}

export default Breadcrumbs

import { Link } from "react-router"
import useAuthStore from "../store/useAuthStore"

export default function Home() {
    const token = useAuthStore(state => state.token);

    return(
        <div className="absolute top-1/2 left-1/2 transform -translate-1/2
                        flex flex-col gap-y-6 md:gap-y-8 lg:gap-y-10 items-center w-full
                        p-4">
            <h2 className="text-2xl md:text-3xl lg:text-4xl text-center">
                Dosyalarınızı saklamanın en iyi yolu...
            </h2>
            {!token ? 
                <Link to="/signup">
                    <button className="primary-button">
                        Kayıt ol
                    </button>
                </Link>
                :
                <Link to="/files">
                    <button className="primary-button">
                        Dosyalarım
                    </button>
                </Link>
            }
        </div>
    )
}
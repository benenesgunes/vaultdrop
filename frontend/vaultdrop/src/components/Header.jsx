import { useState } from "react"
import { RxHamburgerMenu } from "react-icons/rx";
import { Link, useNavigate } from "react-router";
import useAuthStore from "../store/useAuthStore";

export default function Header() {
    const [ isNavbarOpen, setIsNavbarOpen ] = useState(false);
    const navigate = useNavigate();

    const logout = useAuthStore(state => state.logout);

    const handleLogout = () => {
        logout();
        console.log("log out successful")
        navigate("/");
    }

    return(
        <>
            <header className="flex items-center justify-center">
                <Link to="/">
                    <h1 className="font-logo p-3 md:p-4 lg:p-5 text-2xl md:text-3xl lg:text-4xl w-fit">
                        VAULTDROP
                    </h1>
                </Link>
                <RxHamburgerMenu onClick={() => {document.getElementById("navbar").classList.toggle("navbarOpen"); setIsNavbarOpen((m) => !m)}} className="text-3xl md:text-4xl lg:text-5xl cursor-pointer fixed top-0 right-0 m-3 md:m-4 lg:m-5 z-[1001]" />
            </header>


            {isNavbarOpen && <div onClick={() => {document.getElementById("navbar").classList.toggle("navbarOpen"); setIsNavbarOpen((m) => !m)}} className="fixed inset-0 z-[998]"></div>}

            {/* navbar */}
            <div id="navbar" className="fixed top-0 right-[-100%] z-[1000] transition-all
                                        w-2/3 md:w-1/2 lg:w-1/3 h-lvh
                                        bg-light-card dark:bg-dark-card shadow-2xl
                                        flex flex-col">
                <h2 className="font-logo text-center text-xl md:text-2xl lg:text-3xl p-3 md:p-5 lg:p-7">
                    VAULTDROP
                </h2>
                <Link className="navbarLink" to="/">
                    Ana Sayfa
                </Link>
                <Link className="navbarLink" to="/files">
                    Dosyalarım
                </Link>
                <p className="navbarLink cursor-pointer" onClick={() => document.getElementById("html").classList.toggle("dark")}>
                    Tema Değiştir
                </p>
                <p className="navbarLink cursor-pointer" onClick={handleLogout}>
                    Çıkış Yap
                </p>
            </div>
        </>
    )
}
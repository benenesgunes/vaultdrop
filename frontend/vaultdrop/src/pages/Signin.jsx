import { Link, useNavigate } from "react-router"
import useAuthStore from "../store/useAuthStore"
import axios from "axios"
import { useEffect, useRef, useState } from "react";

export default function Signin() {
    const [ errorDisplay, setErrorDisplay ] = useState();
    const usernameRef = useRef();
    const passwordRef = useRef();
    const navigate = useNavigate();

    const API_BASE = "http://localhost:5000/api";

    const token = useAuthStore(state => state.token);
    const setToken = useAuthStore(state => state.setToken);

    useEffect(() => {
        if(token) {
            navigate("/");
        }
    }, [])

    const handleLogIn = async () => {
        const username = usernameRef.current.value;
        const password = passwordRef.current.value;

        try {
            const response = await axios.post(`${API_BASE}/auth/login`, { username, password });
            setToken(response.data.token);
            navigate("/");
            console.log("log in successful");
        }
        catch(error) {
            console.log("something went wrong while logging in", error);
            if(error.status === 401) {
                setErrorDisplay("Kullanıcı adı ve parolanızın doğru olduğundan emin olun.")
            }
            else {
                setErrorDisplay("Teknik bir sorun oluştu. Lütfen tekrar deneyin.");
            }
        }
    }

    return(
        <>
            {!token ?
                <div className="w-9/10 md:w-3/5 xl:w-1/2 p-4 md:p-6 lg:p-8 
                                absolute top-1/2 left-1/2 transform -translate-1/2
                                flex flex-col items-center gap-y-7 md:gap-y-9 lg:gap-y-10 lg:gap-x-10">
                    <h1 className="text-2xl md:text-3xl lg:text-3xl font-bold">
                        Giriş Yap
                    </h1>
                    {errorDisplay ? 
                        <p className="text-delete text-center md:text-lg lg:text-xl">{errorDisplay}</p>
                        :
                        null
                    }
                    <input className="input" ref={usernameRef} type="text" placeholder="Kullanıcı adınızı girin" />
                    <input className="input" ref={passwordRef} type="password" placeholder="Parolanızı girin" />
                    <button className="primary-button" onClick={handleLogIn}>
                        Giriş yap
                    </button>
                    <Link to="/signup" className="md:text-lg lg:text-xl text-center border-b-2 border-transparent hover:border-light-text dark:hover:border-dark-text">
                        Hesabınız yok mu? Buradan kayıt olun.
                    </Link>
                </div>
                :
                null
            }
        </>
    )
}
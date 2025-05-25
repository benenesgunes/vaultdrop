import { useEffect, useRef, useState } from "react"
import { Link, useNavigate } from "react-router"
import useAuthStore from "../store/useAuthStore"
import axios from "axios";

export default function Signup() {
    const [ errorDisplay, setErrorDisplay ] = useState();
    const usernameRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const navigate = useNavigate();

    const API_BASE = "http://localhost:5000/api";

    const token = useAuthStore(state => state.token);
    const setToken = useAuthStore(state => state.setToken);

    useEffect(() => {
        if(token !== null) {
            navigate("/");
        }
    }, [])

    const handleRegister = async () => {
        const username = usernameRef.current.value;
        const password = passwordRef.current.value;
        const passwordConfirm = passwordConfirmRef.current.value;

        if(password != passwordConfirm) {
            return setErrorDisplay("Parolaları aynnı girdiğinizden emin olun!");
        }

        try {
            const response = await axios.post(`${API_BASE}/auth/register`, { username, password });
            setToken(response.data.token);
            navigate("/signin");
            console.log("register successful");
        }
        catch(error) {
            console.log("something went wrong while registering", error);
            setErrorDisplay("Teknik bir sorun oluştu. Lütfen tekrar deneyin.");
        }
    }

    return(
        <>
            {!token ?
                <div className="w-9/10 md:w-3/5 xl:w-1/2 p-4 md:p-6 lg:p-8 
                                absolute top-1/2 left-1/2 transform -translate-1/2
                                flex flex-col items-center gap-y-7 md:gap-y-9 lg:gap-y-10 lg:gap-x-10">
                    <h1 className="text-2xl md:text-3xl lg:text-3xl font-bold">
                        Kayıt Ol
                    </h1>
                    {errorDisplay ? 
                        <p className="text-delete text-center md:text-lg lg:text-xl">{errorDisplay}</p>
                        :
                        null
                    }
                    <input className="input" type="text" ref={usernameRef} placeholder="Kullanıcı adınızı girin" />
                    <input className="input" type="password" ref={passwordRef} placeholder="Parolanızı girin" />
                    <input className="input" type="password" ref={passwordConfirmRef} placeholder="Parolanızı tekrar girin" />
                    <button className="primary-button" onClick={handleRegister}>
                        Kayıt ol
                    </button>
                    <Link to="/signin" className="md:text-lg lg:text-xl text-center border-b-2 border-transparent hover:border-light-text dark:hover:border-dark-text">
                        Hesabınız var mı? Buradan giriş yapın.
                    </Link>
                    <p className="text-sm md:text-md lg:text-base text-center">
                        Kayıt olduktan sonra giriş yapmak için giriş yap sayfasına yönlendirileceksiniz.
                    </p>
                </div>
            :
                null
            }       
        </>
    )
}
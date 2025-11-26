    import { useEffect } from "react";
    import axios from "axios";
    import { useAuth } from "../context/AuthContext";

    

    export default function GoogleLoginButton() {
    const { login } = useAuth();
    const handleCredentialResponse = async (response: any) => {
        const googleToken = response.credential;

        const res = await axios.post(
            "http://192.168.100.6:1337/api/auth/google-login",
            { credential: googleToken }
        );

        login(res.data.jwt);
    };

    useEffect(() => {
        console.log("CLIENT ID:", import.meta.env.VITE_GOOGLE_CLIENT_ID);
        if (!window.google) return;

        window.google.accounts.id.initialize({
        client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
        });

        window.google.accounts.id.renderButton(
        document.getElementById("googleLoginBtn")!,
        { theme: "filled_blue", size: "large", width: 280 }
        );
    }, []);

    return <div id="googleLoginBtn"></div>;
    }

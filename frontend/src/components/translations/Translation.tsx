import { useContext } from "react";
import { loadStripe } from "@stripe/stripe-js";
import "./Translation.css";
import { Elements } from "@stripe/react-stripe-js";
import { CheckoutForm } from "../checkout-form/CheckoutForm";
import AuthContext from "../auth/auth/AuthContext";

export default function Translations() {

    const authContext = useContext(AuthContext)

    const isPaying = authContext?.isPay

    const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)


    return (
        <div className="Translations">
            {isPaying && 
                <>
                    transaltion form...
                </>
            }

            {!isPaying && 
                <>
                
                    <Elements stripe={stripePromise} options={{
                        mode: 'payment',
                        amount: 100,
                        currency: 'usd'
                    }}>
                        <CheckoutForm />
                    </Elements>
                </>
            }
        </div>
    )
}
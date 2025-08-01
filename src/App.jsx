import { useEffect, useState } from "react";
import { loadScript } from "@paypal/paypal-js";
import "./App.css";

function App() {
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [googlePayAvailable, setGooglePayAvailable] = useState(false);

  useEffect(() => {
    // Load PayPal SDK with explicit components
    loadScript({
      "client-id":
        "AWgLEpzQOEB41gdS-7p02bTq-en-0tfyXB8OL3sHaWP_4SiAT7jMY9SgMHA7dviyt_YE-LG_lThts350",
      currency: "USD",
      intent: "capture",
      components: "buttons,googlepay",
    })
      .then(() => {
        setPaypalLoaded(true);
        // Check if Google Pay is available
        checkGooglePayAvailability();
      })
      .catch((error) => {
        console.error("Failed to load PayPal SDK:", error);
      });
  }, []);

  const checkGooglePayAvailability = async () => {
    if (window.paypal && window.paypal.Googlepay) {
      try {
        const googlePayConfig = await window.paypal.Googlepay().config();
        if (googlePayConfig.allowedPaymentMethods.length > 0) {
          setGooglePayAvailable(true);
        } else {
          console.log("Google Pay not available: No allowed payment methods");
          setGooglePayAvailable(false);
        }
      } catch (error) {
        console.error("Google Pay availability check failed:", error);
        setGooglePayAvailable(false);
      }
    } else {
      console.log("PayPal Google Pay SDK not loaded");
      setGooglePayAvailable(false);
    }
  };

  const handlePayPalPayment = (orderID) => {
    console.log("PayPal payment completed:", orderID);
    alert("Payment successful! Order ID: " + orderID);
  };

  const handleGooglePayPayment = (orderID) => {
    console.log("Google Pay payment completed:", orderID);
    alert("Google Pay payment successful! Order ID: " + orderID);
  };

  return (
    <div className="app">
      <header className="app-header">
        <div className="header-content">
          <h1>Payment Demo</h1>
          <p>Secure payments with PayPal and Google Pay</p>
        </div>
      </header>

      <main className="payment-container">
        <div className="payment-section">
          <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="order-items">
              <div className="order-item">
                <span>Premium Product</span>
                <span>$19.99</span>
              </div>
              <div className="order-item">
                <span>Shipping</span>
                <span>$2.99</span>
              </div>
              <div className="order-item">
                <span>Tax</span>
                <span>$1.99</span>
              </div>
              <div className="order-total">
                <span>Total</span>
                <span>$24.97</span>
              </div>
            </div>
          </div>

          <div className="payment-options">
            <h3>Choose Payment Method</h3>

            <div className="payment-buttons">
              {paypalLoaded ? (
                <>
                  {/* PayPal Button */}
                  <div className="payment-button-wrapper">
                    <h4>PayPal</h4>
                    <div id="paypal-button-container"></div>
                  </div>

                  {/* Google Pay Button - Only show if available */}
                  {googlePayAvailable && (
                    <div className="payment-button-wrapper">
                      <h4>Google Pay</h4>
                      <div id="google-pay-button-container"></div>
                    </div>
                  )}

                  {/* Alternative payment methods */}
                  <div className="payment-button-wrapper">
                    <h4>Other Payment Methods</h4>
                    <div id="alternative-payment-container"></div>
                  </div>
                </>
              ) : (
                <div className="loading-container">
                  <div className="loading-spinner"></div>
                  <p>Loading payment options...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* PayPal and Google Pay Button Components */}
      {paypalLoaded && (
        <>
          <PayPalButton
            amount="24.97"
            onApprove={handlePayPalPayment}
            fundingSource="paypal"
          />
          {googlePayAvailable && (
            <GooglePayButton
              amount="24.97"
              onApprove={handleGooglePayPayment}
            />
          )}
          <AlternativePaymentButton
            amount="24.97"
            onApprove={handlePayPalPayment}
          />
        </>
      )}
    </div>
  );
}

// PayPal Button Component
function PayPalButton({ amount, onApprove, fundingSource }) {
  useEffect(() => {
    if (window.paypal) {
      window.paypal
        .Buttons({
          fundingSource: fundingSource,
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: amount,
                  },
                  description: "Premium Product Purchase",
                },
              ],
            });
          },
          onApprove: (data, actions) => {
            return actions.order.capture().then((details) => {
              onApprove(details.id);
            });
          },
          onError: (err) => {
            console.error("PayPal error:", err);
            alert("Payment failed. Please try again.");
          },
        })
        .render("#paypal-button-container");
    }
  }, [amount, onApprove, fundingSource]);

  return null;
}

// Google Pay Button Component
function GooglePayButton({ amount, onApprove }) {
  useEffect(() => {
    if (window.paypal && window.paypal.Googlepay) {
      window.paypal
        .Buttons({
          fundingSource: window.paypal.FUNDING.GOOGLEPAY,
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: amount,
                  },
                  description: "Premium Product Purchase",
                },
              ],
            });
          },
          onApprove: (data, actions) => {
            return actions.order.capture().then((details) => {
              onApprove(details.id);
            });
          },
          onError: (err) => {
            console.error("Google Pay error:", err);
            alert("Google Pay payment failed. Please try again.");
          },
        })
        .render("#google-pay-button-container");
    }
  }, [amount, onApprove]);

  return null;
}

// Alternative Payment Button Component (Cards, etc.)
function AlternativePaymentButton({ amount, onApprove }) {
  useEffect(() => {
    if (window.paypal) {
      window.paypal
        .Buttons({
          fundingSource: window.paypal.FUNDING.CARD,
          createOrder: (data, actions) => {
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: amount,
                  },
                  description: "Premium Product Purchase",
                },
              ],
            });
          },
          onApprove: (data, actions) => {
            return actions.order.capture().then((details) => {
              onApprove(details.id);
            });
          },
          onError: (err) => {
            console.error("Card payment error:", err);
            alert("Card payment failed. Please try again.");
          },
        })
        .render("#alternative-payment-container");
    }
  }, [amount, onApprove]);

  return null;
}

export default App;

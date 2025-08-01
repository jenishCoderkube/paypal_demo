import { useEffect, useState } from "react";
import { loadScript } from "@paypal/paypal-js";
import "./App.css";

function App() {
  const [paypalLoaded, setPaypalLoaded] = useState(false);
  const [googlePayAvailable, setGooglePayAvailable] = useState(false);
  const [googlePayConfig, setGooglePayConfig] = useState(null);

  useEffect(() => {
    // Load PayPal SDK with explicit components
    loadScript({
      "client-id":
        "AcEwGrBDYSuXPB9UjZ46gyQ92p-BP4Xqq6Udd7q6SIERBQ4zuDm-dKHVNn5U41akgmpWMs99nb5v80-c",
      currency: "USD",
      intent: "capture",
      components: "buttons,googlepay",
      "disable-funding": "", // Ensure no funding sources are disabled
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
    if (window.paypal) {
      try {
        console.log("Checking Google Pay availability...");

        // Simplified Google Pay config for testing
        setGooglePayAvailable(true);
        setGooglePayConfig({
          apiVersion: 2,
          apiVersionMinor: 0,
          allowedPaymentMethods: [
            {
              type: "CARD",
              parameters: {
                allowedAuthMethods: ["PAN_ONLY", "CRYPTOGRAM_3DS"],
                allowedCardNetworks: ["MASTERCARD", "DISCOVER", "VISA", "AMEX"],
              },
              tokenizationSpecification: {
                type: "PAYMENT_GATEWAY",
                parameters: {
                  gateway: "paypalsb",
                  gatewayMerchantId: "8KBL748K82JQA",
                },
              },
            },
          ],
          merchantInfo: {
            merchantOrigin: "paypledemo.netlify.app",
            merchantId: "BCR2DN4TXSDMVTKM",
          },
        });

        console.log("Google Pay configuration set up successfully");
      } catch (error) {
        console.error("Google Pay availability check failed:", error);
        setGooglePayAvailable(false);
      }
    } else {
      console.log("PayPal SDK not loaded");
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
                    <div
                      id="paypal-button-container"
                      style={{ minHeight: "50px" }}
                    ></div>
                  </div>

                  {/* Google Pay Button - Only show if available */}
                  {googlePayAvailable ? (
                    <div className="payment-button-wrapper">
                      <h4>Google Pay</h4>
                      <div
                        id="google-pay-button-container"
                        style={{ minHeight: "50px", display: "block" }}
                      ></div>
                      {/* Test button to see if basic Google Pay works */}
                      <div
                        id="google-pay-test-container"
                        style={{
                          minHeight: "50px",
                          display: "block",
                          marginTop: "10px",
                        }}
                      ></div>
                    </div>
                  ) : (
                    <div className="payment-button-wrapper">
                      <h4>Google Pay</h4>
                      <p style={{ color: "#666", fontSize: "14px" }}>
                        Google Pay not available on this device/browser
                      </p>
                    </div>
                  )}

                  {/* Alternative payment methods */}
                  <div className="payment-button-wrapper">
                    <h4>Other Payment Methods</h4>
                    <div
                      id="alternative-payment-container"
                      style={{ minHeight: "50px" }}
                    ></div>
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
            <>
              <GooglePayButton
                amount="24.97"
                onApprove={handleGooglePayPayment}
                googlePayConfig={googlePayConfig}
              />
              <TestGooglePayButton
                amount="24.97"
                onApprove={handleGooglePayPayment}
              />
            </>
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
        .render("#paypal-button-container")
        .then(() => {
          console.log("PayPal button rendered successfully");
        })
        .catch((error) => {
          console.error("Failed to render PayPal button:", error);
        });
    }
  }, [amount, onApprove, fundingSource]);

  return null;
}

// Google Pay Button Component
function GooglePayButton({ amount, onApprove, googlePayConfig }) {
  useEffect(() => {
    console.log("GooglePayButton useEffect triggered");
    console.log("window.paypal available:", !!window.paypal);
    console.log("googlePayConfig available:", !!googlePayConfig);

    if (window.paypal && googlePayConfig) {
      console.log("Rendering Google Pay button with config:", googlePayConfig);

      try {
        const button = window.paypal.Buttons({
          fundingSource: window.paypal.FUNDING.GOOGLEPAY,
          style: {
            height: 55, // Ensure button has visible height
          },
          createOrder: (data, actions) => {
            console.log("Creating Google Pay order");
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
            console.log("Google Pay order approved:", data);
            return actions.order.capture().then((details) => {
              console.log("Google Pay payment captured:", details);
              onApprove(details.id);
            });
          },
          onError: (err) => {
            console.error("Google Pay error:", err);
            alert("Google Pay payment failed. Please try again.");
          },
          onCancel: (data) => {
            console.log("Google Pay payment cancelled:", data);
          },
          onInit: (data, actions) => {
            console.log("Google Pay button initialized:", data);
          },
        });

        console.log("Checking button eligibility...");
        const isEligible = button.isEligible();
        console.log("Button eligibility result:", isEligible);

        if (isEligible) {
          console.log("Google Pay button is eligible - rendering");
          button
            .render("#google-pay-button-container")
            .then(() => {
              console.log("Google Pay button rendered successfully");
              const container = document.getElementById(
                "google-pay-button-container"
              );
              console.log(
                "Google Pay button container content:",
                container.innerHTML
              );
            })
            .catch((error) => {
              console.error("Failed to render Google Pay button:", error);
              const container = document.getElementById(
                "google-pay-button-container"
              );
              if (container) {
                container.innerHTML =
                  '<p style="color: #666; font-size: 14px;">Google Pay button failed to render</p>';
              }
            });
        } else {
          console.log(
            "Google Pay button is not eligible on this device/browser"
          );
          const container = document.getElementById(
            "google-pay-button-container"
          );
          if (container) {
            container.innerHTML =
              '<p style="color: #666; font-size: 14px;">Google Pay not available on this device/browser</p>';
          }
        }
      } catch (error) {
        console.error("Error creating Google Pay button:", error);
        const container = document.getElementById(
          "google-pay-button-container"
        );
        if (container) {
          container.innerHTML =
            '<p style="color: #666; font-size: 14px;">Error creating Google Pay button</p>';
        }
      }
    } else {
      console.log("Cannot render Google Pay button - missing dependencies");
      const container = document.getElementById("google-pay-button-container");
      if (container) {
        container.innerHTML =
          '<p style="color: #666; font-size: 14px;">Google Pay dependencies missing</p>';
      }
    }
  }, [amount, onApprove, googlePayConfig]);

  return null;
}

// Test Google Pay Button Component (Simplified)
function TestGooglePayButton({ amount, onApprove }) {
  useEffect(() => {
    console.log("TestGooglePayButton useEffect triggered");

    if (window.paypal) {
      console.log("Creating test Google Pay button...");

      try {
        const testButton = window.paypal.Buttons({
          fundingSource: window.paypal.FUNDING.GOOGLEPAY,
          style: {
            height: 55, // Ensure button has visible height
          },
          createOrder: (data, actions) => {
            console.log("Creating test Google Pay order");
            return actions.order.create({
              purchase_units: [
                {
                  amount: {
                    value: amount,
                  },
                  description: "Test Purchase",
                },
              ],
            });
          },
          onApprove: (data, actions) => {
            console.log("Test Google Pay order approved:", data);
            return actions.order.capture().then((details) => {
              console.log("Test Google Pay payment captured:", details);
              onApprove(details.id);
            });
          },
          onError: (err) => {
            console.error("Test Google Pay error:", err);
            const container = document.getElementById(
              "google-pay-test-container"
            );
            if (container) {
              container.innerHTML =
                '<p style="color: #666; font-size: 14px;">Test Google Pay button failed to render</p>';
            }
          },
        });

        console.log("Test button eligibility:", testButton.isEligible());

        testButton
          .render("#google-pay-test-container")
          .then(() => {
            console.log("Test Google Pay button rendered successfully");
            const container = document.getElementById(
              "google-pay-test-container"
            );
            console.log(
              "Test Google Pay button container content:",
              container.innerHTML
            );
          })
          .catch((error) => {
            console.error("Failed to render test Google Pay button:", error);
            const container = document.getElementById(
              "google-pay-test-container"
            );
            if (container) {
              container.innerHTML =
                '<p style="color: #666; font-size: 14px;">Test Google Pay button failed to render</p>';
            }
          });
      } catch (error) {
        console.error("Error creating test Google Pay button:", error);
        const container = document.getElementById("google-pay-test-container");
        if (container) {
          container.innerHTML =
            '<p style="color: #666; font-size: 14px;">Error creating test Google Pay button</p>';
        }
      }
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
        .render("#alternative-payment-container")
        .then(() => {
          console.log("Alternative payment button rendered successfully");
        })
        .catch((error) => {
          console.error("Failed to render alternative payment button:", error);
        });
    }
  }, [amount, onApprove]);

  return null;
}

export default App;

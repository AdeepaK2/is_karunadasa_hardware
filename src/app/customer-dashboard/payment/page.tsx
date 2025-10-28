"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useApp } from "@/contexts/AppContext";
import { ArrowLeft, Lock, CreditCard, Smartphone, Building, AlertCircle } from "lucide-react";

interface CreditCardForm {
  cardNumber: string;
  expiryDate: string;
  cvv: string;
  cardholderName: string;
}

interface MobilePaymentForm {
  phoneNumber: string;
  provider: string;
}

interface BankTransferForm {
  accountNumber: string;
  bankName: string;
  branchCode: string;
}

export default function PaymentPage() {
  const { clearCart } = useApp();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [paymentMethod, setPaymentMethod] = useState(searchParams.get("method") || "credit-card");
  const [orderData, setOrderData] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  
  // Form states
  const [creditCardForm, setCreditCardForm] = useState<CreditCardForm>({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    cardholderName: "",
  });

  const [mobilePaymentForm, setMobilePaymentForm] = useState<MobilePaymentForm>({
    phoneNumber: "",
    provider: "frimi",
  });

  const [bankTransferForm, setBankTransferForm] = useState<BankTransferForm>({
    accountNumber: "",
    bankName: "",
    branchCode: "",
  });

  useEffect(() => {
    const storedOrder = localStorage.getItem("checkout-order");
    if (storedOrder) {
      setOrderData(JSON.parse(storedOrder));
    } else {
      router.push("/customer-dashboard/checkout");
    }
  }, [router]);

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return match;
    }
  };

  const formatExpiryDate = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4);
    }
    return v;
  };

  const handleCreditCardChange = (field: keyof CreditCardForm, value: string) => {
    if (field === "cardNumber") {
      value = formatCardNumber(value);
    } else if (field === "expiryDate") {
      value = formatExpiryDate(value);
    } else if (field === "cvv") {
      value = value.replace(/[^0-9]/gi, "").substring(0, 4);
    }
    setCreditCardForm(prev => ({ ...prev, [field]: value }));
  };

  const handleMobilePaymentChange = (field: keyof MobilePaymentForm, value: string) => {
    setMobilePaymentForm(prev => ({ ...prev, [field]: value }));
  };

  const handleBankTransferChange = (field: keyof BankTransferForm, value: string) => {
    setBankTransferForm(prev => ({ ...prev, [field]: value }));
  };

  const validateCreditCard = () => {
    const { cardNumber, expiryDate, cvv, cardholderName } = creditCardForm;
    return cardNumber.replace(/\s/g, "").length >= 13 && 
           expiryDate.length === 5 && 
           cvv.length >= 3 && 
           cardholderName.trim().length > 0;
  };

  const validateMobilePayment = () => {
    const { phoneNumber, provider } = mobilePaymentForm;
    return phoneNumber.trim().length >= 10 && provider.trim().length > 0;
  };

  const validateBankTransfer = () => {
    const { accountNumber, bankName, branchCode } = bankTransferForm;
    return accountNumber.trim().length > 0 && 
           bankName.trim().length > 0 && 
           branchCode.trim().length > 0;
  };

  const handleProcessPayment = async () => {
    setIsProcessing(true);

    // Validate based on payment method
    let isValid = false;
    switch (paymentMethod) {
      case "credit-card":
        isValid = validateCreditCard();
        break;
      case "mobile-payment":
        isValid = validateMobilePayment();
        break;
      case "bank-transfer":
        isValid = validateBankTransfer();
        break;
      case "cash-on-delivery":
        isValid = true;
        break;
    }

    if (!isValid) {
      alert("Please fill in all required payment information.");
      setIsProcessing(false);
      return;
    }

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Create order
    const finalOrder = {
      ...orderData,
      orderId: `ORD-${Date.now()}`,
      paymentStatus: paymentMethod === "cash-on-delivery" ? "pending" : "completed",
      paymentDetails: paymentMethod === "credit-card" ? {
        last4: creditCardForm.cardNumber.slice(-4),
        cardType: "Credit Card"
      } : paymentMethod === "mobile-payment" ? {
        provider: mobilePaymentForm.provider,
        phoneNumber: mobilePaymentForm.phoneNumber
      } : paymentMethod === "bank-transfer" ? {
        bankName: bankTransferForm.bankName,
        accountNumber: bankTransferForm.accountNumber.slice(-4)
      } : {
        method: "Cash on Delivery"
      }
    };

    localStorage.setItem("completed-order", JSON.stringify(finalOrder));
    localStorage.removeItem("checkout-order");
    clearCart();
    
    setIsProcessing(false);
    router.push("/customer-dashboard/payment-success");
  };

  if (!orderData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Payment
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Payment Form */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <Lock className="w-5 h-5 text-green-600" />
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Secure Payment
              </h2>
            </div>

            {paymentMethod === "credit-card" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Cardholder Name *
                  </label>
                  <input
                    type="text"
                    value={creditCardForm.cardholderName}
                    onChange={(e) => handleCreditCardChange("cardholderName", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="John Doe"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Card Number *
                  </label>
                  <div className="relative">
                    <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={creditCardForm.cardNumber}
                      onChange={(e) => handleCreditCardChange("cardNumber", e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Expiry Date *
                    </label>
                    <input
                      type="text"
                      value={creditCardForm.expiryDate}
                      onChange={(e) => handleCreditCardChange("expiryDate", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="MM/YY"
                      maxLength={5}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      CVV *
                    </label>
                    <input
                      type="text"
                      value={creditCardForm.cvv}
                      onChange={(e) => handleCreditCardChange("cvv", e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="123"
                      maxLength={4}
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === "mobile-payment" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Mobile Payment Provider *
                  </label>
                  <select
                    value={mobilePaymentForm.provider}
                    onChange={(e) => handleMobilePaymentChange("provider", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="frimi">FriMi</option>
                    <option value="ezcash">eZ Cash</option>
                    <option value="mcash">mCash</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="tel"
                      value={mobilePaymentForm.phoneNumber}
                      onChange={(e) => handleMobilePaymentChange("phoneNumber", e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="077 123 4567"
                    />
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-800 dark:text-blue-200">
                        Payment Instructions
                      </p>
                      <p className="text-xs text-blue-700 dark:text-blue-300 mt-1">
                        You will receive an SMS with payment instructions to complete the transaction.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === "bank-transfer" && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Bank Name *
                  </label>
                  <select
                    value={bankTransferForm.bankName}
                    onChange={(e) => handleBankTransferChange("bankName", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="">Select Bank</option>
                    <option value="Commercial Bank">Commercial Bank</option>
                    <option value="People's Bank">People's Bank</option>
                    <option value="Bank of Ceylon">Bank of Ceylon</option>
                    <option value="Sampath Bank">Sampath Bank</option>
                    <option value="HNB">Hatton National Bank</option>
                    <option value="DFCC Bank">DFCC Bank</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Account Number *
                  </label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={bankTransferForm.accountNumber}
                      onChange={(e) => handleBankTransferChange("accountNumber", e.target.value)}
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Your account number"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Branch Code *
                  </label>
                  <input
                    type="text"
                    value={bankTransferForm.branchCode}
                    onChange={(e) => handleBankTransferChange("branchCode", e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Branch code"
                  />
                </div>

                <div className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-800 dark:text-yellow-200">
                        Bank Transfer Instructions
                      </p>
                      <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">
                        Please transfer LKR {orderData.total.toFixed(2)} to our bank account. Order will be processed after payment confirmation.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === "cash-on-delivery" && (
              <div className="bg-green-50 dark:bg-green-900/20 p-6 rounded-lg text-center">
                <div className="w-16 h-16 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-green-600 dark:text-green-400">₨</span>
                </div>
                <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
                  Cash on Delivery
                </h3>
                <p className="text-sm text-green-700 dark:text-green-300">
                  You will pay LKR {orderData.total.toFixed(2)} when your order is delivered to your doorstep.
                </p>
              </div>
            )}

            {/* Process Payment Button */}
            <button
              onClick={handleProcessPayment}
              disabled={isProcessing}
              className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-4 rounded-lg mt-6 transition-colors flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  Processing...
                </>
              ) : paymentMethod === "cash-on-delivery" ? (
                "Confirm Order"
              ) : (
                `Pay LKR ${orderData.total.toFixed(2)}`
              )}
            </button>
          </div>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 sticky top-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Order Summary
            </h3>
            
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Items ({orderData.items.length})</span>
                <span className="font-medium">LKR {orderData.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Delivery</span>
                <span className="font-medium">
                  {orderData.deliveryFee === 0 ? "Free" : `LKR ${orderData.deliveryFee.toFixed(2)}`}
                </span>
              </div>
              <div className="border-t border-gray-200 dark:border-gray-700 pt-2 mt-2">
                <div className="flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span className="text-green-600 dark:text-green-400">LKR {orderData.total.toFixed(2)}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400 text-center">
                🔒 Your payment information is secure and encrypted
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
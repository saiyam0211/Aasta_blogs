import { useState, useEffect } from 'react';

// Declare Razorpay types
declare global {
  interface Window {
    Razorpay: any;
  }
}

interface InvestmentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const MAX_PAYMENT_PER_TRANSACTION = Number(import.meta.env.VITE_MAX_PAYMENT_PER_TRANSACTION || 50000);

export const InvestmentModal = ({ isOpen, onClose }: InvestmentModalProps) => {
  const [investmentAmount, setInvestmentAmount] = useState('');
  const [investorName, setInvestorName] = useState('');
  const [investorEmail, setInvestorEmail] = useState('');
  const [investorPhone, setInvestorPhone] = useState('');
  const [investorLinkedIn, setInvestorLinkedIn] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [paymentQueue, setPaymentQueue] = useState<number[]>([]);
  const [currentPaymentIndex, setCurrentPaymentIndex] = useState(0);
  const [currentChunkAmount, setCurrentChunkAmount] = useState(0);
  const [awaitingConfirmation, setAwaitingConfirmation] = useState(false);
  const [showSplitConfirmationModal, setShowSplitConfirmationModal] = useState(false);
  const [totalInvestmentSelected, setTotalInvestmentSelected] = useState(0);

  const quickAmounts = [5000, 10000, 25000, 50000, 100000, 250000];

  // Razorpay Key ID - Replace with your actual Razorpay Key ID from environment variables
  // For production, use: import.meta.env.VITE_RAZORPAY_KEY_ID
  const RAZORPAY_KEY_ID = import.meta.env.VITE_RAZORPAY_KEY_ID || '';

  // Lock body scroll while modal is open
  useEffect(() => {
    if (isOpen) {
      const previousOverflow = document.body.style.overflow;
      const previousTouchAction = (document.body.style as any).touchAction;
      document.body.style.overflow = 'hidden';
      (document.body.style as any).touchAction = 'none';
      return () => {
        document.body.style.overflow = previousOverflow;
        (document.body.style as any).touchAction = previousTouchAction;
      };
    }
  }, [isOpen]);

  // Prevent browser alerts from Razorpay errors
  useEffect(() => {
    if (isOpen) {
      // Override window.alert temporarily to prevent Razorpay alerts
      const originalAlert = window.alert;
      window.alert = function(message: string) {
        // Instead of showing alert, set error state
        if (message.toLowerCase().includes('payment') || message.toLowerCase().includes('failed') || message.toLowerCase().includes('error')) {
          setError(message);
          return;
        }
        // For other alerts, use original (though we shouldn't have any)
        originalAlert(message);
      };

      return () => {
        // Restore original alert when modal closes
        window.alert = originalAlert;
      };
    }
  }, [isOpen]);

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Validate LinkedIn URL
  const validateLinkedInUrl = (url: string): boolean => {
    if (!url) return true; // Optional field
    const linkedInPattern = /^(https?:\/\/)?(www\.)?(linkedin\.com\/in\/|linkedin\.com\/pub\/)[\w-]+\/?$/;
    return linkedInPattern.test(url);
  };

  // Create Razorpay order (calls backend API)
  const createRazorpayOrder = async (amount: number) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://aasta-main-website.onrender.com';
    
    try {
      const response = await fetch(`${backendUrl}/api/payments/create-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount * 100, // Amount in paise
          currency: 'INR',
          receipt: `inv_${Date.now()}`,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data.orderId || data.id;
      } else {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `Failed to create order: ${response.status}`);
      }
    } catch (error: any) {
      console.error('Error creating Razorpay order:', error);
      throw new Error(error.message || 'Failed to create payment order. Please ensure the backend server is running.');
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setInvestmentAmount('');
    setInvestorName('');
    setInvestorEmail('');
    setInvestorPhone('');
    setInvestorLinkedIn('');
    setError('');
    setPaymentQueue([]);
    setCurrentPaymentIndex(0);
    setCurrentChunkAmount(0);
    setAwaitingConfirmation(false);
    setShowSplitConfirmationModal(false);
    setTotalInvestmentSelected(0);
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleConfirmPayment = () => {
    if (!paymentQueue.length) return;
    setError('');
    setShowSplitConfirmationModal(false);
    processSplitPayment(paymentQueue, currentPaymentIndex);
  };

  const handleCancelSplit = () => {
    setShowSplitConfirmationModal(false);
    setAwaitingConfirmation(false);
    setPaymentQueue([]);
    setCurrentPaymentIndex(0);
    setCurrentChunkAmount(0);
    setError('Split payment was cancelled. You can adjust the amount or try again.');
  };

  const processSplitPayment = async (queue: number[], index: number) => {
    if (!RAZORPAY_KEY_ID) {
      setError('Payment gateway is not configured. Please set VITE_RAZORPAY_KEY_ID.');
      return;
    }

    const chunkAmount = queue[index];
    setCurrentPaymentIndex(index);
    setCurrentChunkAmount(chunkAmount);
    setAwaitingConfirmation(false);
    setLoading(true);
    setError('');

    try {
      const orderId = await createRazorpayOrder(chunkAmount);

      const options = {
        key: RAZORPAY_KEY_ID,
        amount: chunkAmount * 100, // Amount in paise
        currency: 'INR',
        name: 'AASTA',
        description: `Investment of ₹${chunkAmount.toLocaleString('en-IN')}`,
        order_id: orderId,
        handler: async function (response: any) {
          setLoading(false);

          const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://aasta-main-website.onrender.com';
          try {
            const verifyResponse = await fetch(`${backendUrl}/api/payments/verify`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                investorName,
                investorEmail,
                investorPhone: investorPhone || '',
                investorLinkedIn: investorLinkedIn || '',
                investmentAmount: chunkAmount,
              }),
            });

            const verifyData = await verifyResponse.json();
            
            if (!verifyResponse.ok) {
              const errorMessage = verifyData.message || verifyData.error || 'Failed to verify payment';
              console.error('Payment verification failed:', errorMessage);
              setError(errorMessage);
              setAwaitingConfirmation(true);
              if (queue.length > 1) {
                setShowSplitConfirmationModal(true);
              }
              return;
            }

            console.log('Payment verified and saved:', verifyData);
            window.dispatchEvent(new Event('investment-updated'));

            const nextIndex = index + 1;
            if (nextIndex < queue.length) {
              setCurrentPaymentIndex(nextIndex);
              setCurrentChunkAmount(queue[nextIndex]);
              setAwaitingConfirmation(true);
              if (queue.length > 1) {
                setShowSplitConfirmationModal(true);
              }
            } else {
              setSubmitted(true);
              setPaymentQueue([]);
              setCurrentChunkAmount(0);
              setAwaitingConfirmation(false);
              setShowSplitConfirmationModal(false);
            }
          } catch (error: any) {
            console.error('Error verifying payment:', error);
            setError(error?.message || 'Failed to verify payment. Please contact support.');
            setAwaitingConfirmation(true);
            if (queue.length > 1) {
              setShowSplitConfirmationModal(true);
            }
          }
        },
        prefill: {
          name: investorName,
          email: investorEmail,
          contact: investorPhone,
        },
        theme: {
          color: '#fcfab2',
        },
        modal: {
          ondismiss: function() {
            setLoading(false);
            setError('Payment was cancelled. You can resume to complete the remaining amount.');
            if (queue.length > 1) {
              setAwaitingConfirmation(true);
              setShowSplitConfirmationModal(true);
            } else {
              setAwaitingConfirmation(false);
              setPaymentQueue([]);
              setCurrentChunkAmount(0);
            }
          },
        },
        config: {
          display: {
            blocks: {
              banks: {
                name: 'All payment methods',
                instruments: [
                  { method: 'card' },
                  { method: 'netbanking' },
                  { method: 'wallet' },
                  { method: 'upi' },
                ],
              },
            },
            sequence: ['block.banks'],
            preferences: {
              show_default_blocks: true,
            },
          },
        },
      };

      const razorpay = new window.Razorpay(options);

      razorpay.on('payment.failed', function (errorResponse: any) {
        setLoading(false);
        const errorMessage = errorResponse.error?.description || errorResponse.error?.reason || 'Payment failed. Please try again.';
        setError(errorMessage);
        console.error('Payment failed:', errorResponse.error);
        if (queue.length > 1) {
          setAwaitingConfirmation(true);
          setShowSplitConfirmationModal(true);
        } else {
          setAwaitingConfirmation(false);
          setPaymentQueue([]);
          setCurrentChunkAmount(0);
        }
      });

      razorpay.on('error', function (error: any) {
        setLoading(false);
        const errorMessage = error.error?.description || error.error?.reason || 'An error occurred during payment. Please try again.';
        setError(errorMessage);
        console.error('Razorpay error:', error);
        if (queue.length > 1) {
          setAwaitingConfirmation(true);
          setShowSplitConfirmationModal(true);
        } else {
          setAwaitingConfirmation(false);
          setPaymentQueue([]);
          setCurrentChunkAmount(0);
        }
      });

      razorpay.open();
    } catch (error: any) {
      console.error('Payment error:', error);
      setLoading(false);
      const errorMessage = error?.message || 'An error occurred. Please try again.';
      setError(errorMessage);
      if (queue.length > 1) {
        setAwaitingConfirmation(true);
        setShowSplitConfirmationModal(true);
      } else {
        setAwaitingConfirmation(false);
        setPaymentQueue([]);
        setCurrentChunkAmount(0);
      }

      if (errorMessage.includes('backend') || errorMessage.includes('Failed to fetch')) {
        setError('Backend server is not running. Please start the backend server on port 5000 and try again.');
      }
    }
  };

  const handlePayment = () => {
    if (!RAZORPAY_KEY_ID) {
      setError('Payment gateway is not configured. Please set VITE_RAZORPAY_KEY_ID.');
      return;
    }

    const amount = parseFloat(investmentAmount);
    
    if (!amount || amount < 300) {
      setError('Minimum investment amount is ₹300');
      return;
    }

    if (!validateLinkedInUrl(investorLinkedIn)) {
      setError('Please enter a valid LinkedIn URL (e.g., linkedin.com/in/yourname)');
      return;
    }

    if (!window.Razorpay) {
      setError('Payment gateway is not available. Please refresh the page and try again.');
      return;
    }

    const queue: number[] = [];
    let remaining = amount;
    while (remaining > 0) {
      const chunk = Math.min(remaining, MAX_PAYMENT_PER_TRANSACTION);
      queue.push(chunk);
      remaining -= chunk;
    }

    setPaymentQueue(queue);
    setCurrentPaymentIndex(0);
    setCurrentChunkAmount(queue[0] || 0);
    setError('');
    setTotalInvestmentSelected(amount);

    if (queue.length === 1) {
      setAwaitingConfirmation(false);
      processSplitPayment(queue, 0);
    } else {
      setAwaitingConfirmation(true);
      setShowSplitConfirmationModal(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handlePayment();
  };

  const splitInProgress = paymentQueue.length > 0 && !submitted;
  const isSplitPayment = paymentQueue.length > 1;
  const totalSteps = paymentQueue.length || 1;

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fadeIn">
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black/80 backdrop-blur-md transition-opacity"
          onClick={handleClose}
        />

        {/* Modal Content */}
        <div className="investment-modal relative z-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-gradient-to-br from-card-bg via-card-bg/95 to-card-bg/90 rounded-[2rem] sm:rounded-[3rem] p-6 sm:p-8 lg:p-12 border-4 border-primary/40 shadow-2xl animate-slideUp [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 w-12 h-12 bg-primary/20 hover:bg-primary/40 rounded-full flex items-center justify-center text-primary transition-all hover:scale-110 active:scale-95 shadow-lg"
          aria-label="Close modal"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {!submitted && (
          <div className="text-center mb-8">
            <h2 className="font-dela text-3xl sm:text-4xl md:text-5xl text-primary mb-4 bg-gradient-to-r from-primary to-primary/80 bg-clip-text">
              MAKE YOUR INVESTMENT
            </h2>
            <p className="text-white/80 text-base sm:text-lg">
              You’re not just Donating — you’re becoming part of our story. We need a few details to remember you as an early believer.
            </p>
          </div>
        )}

        {submitted ? (
          <div className="text-center py-12 animate-fadeIn">
            <div className="w-24 h-24 bg-gradient-to-br from-primary/30 to-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <svg className="w-12 h-12 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h3 className="font-dela text-3xl sm:text-4xl text-primary mb-4">Thank You for Your Donation!</h3>
            <p className="text-white/80 text-lg mb-6">
            Your generous donation is a powerful investment in our mission.
            </p>
            
            {/* Quotes */}
            <div className="max-w-2xl mx-auto space-y-4 mb-6">
              <div className="bg-primary/10 border-l-4 border-primary rounded-lg p-4 text-left">
                <p className="text-white/90 text-base italic mb-2">
                  "The best investment you can make is in yourself and in causes that matter."
                </p>
                <p className="text-primary/80 text-sm">— Warren Buffett</p>
              </div>
            </div>
            
            <p className="text-white/60 text-sm mb-6">
              Our team will contact you shortly with further details. Welcome to the AASTA family!
            </p>
            <button
              onClick={handleClose}
              className="bg-primary text-black font-bold px-6 py-3 rounded-full hover:scale-105 transition-transform"
            >
              Close and Continue Exploring
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Investment Amount */}
            <div className="space-y-3">
              <label className="block text-white font-bold mb-3 text-sm sm:text-base flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Select Investment Amount (₹)
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
                {quickAmounts.map((amount) => (
                  <button
                    key={amount}
                    type="button"
                    disabled={splitInProgress || loading}
                    onClick={() => {
                      setInvestmentAmount(amount.toString());
                      setError('');
                    }}
                    className={`py-3 px-4 rounded-xl border-2 font-bold transition-all transform hover:scale-105 active:scale-95 ${
                      investmentAmount === amount.toString()
                        ? 'bg-primary text-black border-primary shadow-lg shadow-primary/50 scale-105'
                        : 'bg-background/50 text-white border-white/20 hover:border-primary/50 hover:bg-background/70'
                    } ${splitInProgress || loading ? 'opacity-50 cursor-not-allowed hover:scale-100 active:scale-100' : ''}`}
                  >
                    ₹{amount.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>
              <input
                type="number"
                value={investmentAmount}
                onChange={(e) => {
                  setInvestmentAmount(e.target.value);
                  setError('');
                }}
                placeholder="Enter custom amount"
                className="w-full bg-background/50 border-2 border-white/20 rounded-xl px-4 py-3.5 text-white placeholder-white/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                min="300"
                disabled={splitInProgress || loading}
                required
              />
            </div>

            {/* Full Name */}
            <div className="space-y-2">
              <label className="block text-white font-bold mb-2 text-sm sm:text-base flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Full Name
              </label>
              <input
                type="text"
                value={investorName}
                onChange={(e) => setInvestorName(e.target.value)}
                placeholder="Enter your full name"
                className="w-full bg-background/50 border-2 border-white/20 rounded-xl px-4 py-3.5 text-white placeholder-white/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                disabled={splitInProgress || loading}
                required
              />
            </div>

            {/* Email Address */}
            <div className="space-y-2">
              <label className="block text-white font-bold mb-2 text-sm sm:text-base flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Address
              </label>
              <input
                type="email"
                value={investorEmail}
                onChange={(e) => setInvestorEmail(e.target.value)}
                placeholder="Enter your email"
                className="w-full bg-background/50 border-2 border-white/20 rounded-xl px-4 py-3.5 text-white placeholder-white/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                disabled={splitInProgress || loading}
                required
              />
            </div>

            {/* Phone Number */}
            {/* <div className="space-y-2">
              <label className="block text-white font-bold mb-2 text-sm sm:text-base flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                Phone Number
              </label>
              <input
                type="tel"
                value={investorPhone}
                onChange={(e) => setInvestorPhone(e.target.value)}
                placeholder="Enter your phone number"
                className="w-full bg-background/50 border-2 border-white/20 rounded-xl px-4 py-3.5 text-white placeholder-white/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                disabled={splitInProgress || loading}
              />
            </div> */}

            {/* LinkedIn URL */}
            <div className="space-y-2">
              <label className="block text-white font-bold mb-2 text-sm sm:text-base flex items-center gap-2">
                <svg className="w-5 h-5 text-primary" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                </svg>
                LinkedIn Profile URL <span className="text-white/50 text-xs font-normal">(Optional)</span>
              </label>
              <input
                type="url"
                value={investorLinkedIn}
                onChange={(e) => {
                  setInvestorLinkedIn(e.target.value);
                  setError('');
                }}
                placeholder="https://linkedin.com/in/yourname"
                className="w-full bg-background/50 border-2 border-white/20 rounded-xl px-4 py-3.5 text-white placeholder-white/50 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
                disabled={splitInProgress || loading}
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-500/20 border-2 border-red-500/50 rounded-xl p-4 flex items-start gap-3 animate-shake">
                <svg className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div className="flex-1">
                  <p className="text-red-300 font-semibold text-sm mb-1">Payment Error</p>
                  <p className="text-red-200 text-sm">{error}</p>
                </div>
                <button
                  onClick={() => setError('')}
                  className="text-red-400 hover:text-red-300 transition-colors flex-shrink-0"
                  aria-label="Dismiss error"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            )}

            {/* Payment Button */}
            <button
              type="submit"
              disabled={loading || splitInProgress}
              className="w-full bg-gradient-to-r from-[#fcfab2] to-[#f5f18a] border-b-8 border-r-4 border-t-2 border-black rounded-full py-5 sm:py-6 px-8 text-black font-black text-lg sm:text-xl hover:scale-105 active:scale-95 transition-transform disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 shadow-2xl shadow-primary/30 flex items-center justify-center gap-3"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <span>Processing Payment...</span>
                </>
              ) : (isSplitPayment && splitInProgress) ? (
                <>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Split Payment Active</span>
                </>
              ) : (
                <>
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  <span>Proceed to Payment</span>
                </>
              )}
            </button>

            {/* Security Note */}
            <p className="text-white/50 text-xs text-center flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Secure payment powered by Razorpay
            </p>
          </form>
        )}
        </div>
      </div>

      {showSplitConfirmationModal && awaitingConfirmation && isSplitPayment && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={handleCancelSplit}></div>
          <div className="relative z-10 w-full max-w-md bg-gradient-to-br from-card-bg to-card-bg/90 border-2 border-primary/40 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-4 text-center">
            <p className="text-primary font-bold text-lg">Split Payment Confirmation</p>
            <p className="text-white/80 text-sm sm:text-base">
              Your total of ₹{totalInvestmentSelected.toLocaleString('en-IN')} will be processed in
              chunks of up to ₹{MAX_PAYMENT_PER_TRANSACTION.toLocaleString('en-IN')}. We&apos;re ready for
              step {currentPaymentIndex + 1} of {totalSteps}, amounting to ₹{currentChunkAmount.toLocaleString('en-IN')}.
            </p>
            <p className="text-white/60 text-xs">
              Confirm to open the secure Razorpay checkout for this installment.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={handleCancelSplit}
                className="w-full sm:w-auto bg-white/10 text-white border border-white/20 rounded-full px-4 py-2 text-sm font-semibold hover:bg-white/20 transition-all"
              >
                Change Amount
              </button>
              <button
                type="button"
                onClick={handleConfirmPayment}
                disabled={loading}
                className="w-full sm:w-auto bg-primary text-black font-bold px-5 py-2 rounded-full hover:scale-105 transition-transform disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Confirm & Pay ₹{currentChunkAmount.toLocaleString('en-IN')}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

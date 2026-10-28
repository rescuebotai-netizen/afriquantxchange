import React from 'react';

interface PocketWalletWidgetProps {
  balance?: string;
  stripeCardNumber?: string;
  wiseCardNumber?: string;
  paypalCardNumber?: string;
}

export function PocketWalletWidget({
  balance = "$248,920.50",
  stripeCardNumber = "4532 •••• •••• 8891",
  wiseCardNumber = "5412 •••• •••• 4402",
  paypalCardNumber = "3782 •••• •••• 9103",
}: PocketWalletWidgetProps) {
  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="wallet">
        <div className="wallet-back" />

        {/* Card 1: Stripe (Institutional USD) */}
        <div className="card stripe">
          <div className="card-inner">
            <div className="card-top">
              <div className="chip" />
              <span className="font-mono font-bold text-xs tracking-wider">AFRIQUANTX</span>
            </div>
            <div className="card-bottom">
              <div>
                <span className="label">INSTITUTIONAL USD</span>
                <span className="value">ALEX THOMPSON</span>
              </div>
              <div className="card-number-wrapper">
                <span className="hidden-stars">•••• ••••</span>
                <span className="card-number">{stripeCardNumber}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: Wise (African Local Settlement) */}
        <div className="card wise">
          <div className="card-inner">
            <div className="card-top">
              <div className="chip" />
              <span className="font-mono font-bold text-xs tracking-wider">AQX SETTLE</span>
            </div>
            <div className="card-bottom">
              <div>
                <span className="label">LOCAL CURRENCY DEPOSIT</span>
                <span className="value">AFRICA / ASIA / EU</span>
              </div>
              <div className="card-number-wrapper">
                <span className="hidden-stars">•••• ••••</span>
                <span className="card-number">{wiseCardNumber}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card 3: Paypal (Whop Card Gateway) */}
        <div className="card paypal">
          <div className="card-inner">
            <div className="card-top">
              <div className="chip" />
              <span className="font-mono font-extrabold text-xs tracking-wider text-[#003087]">WHOP V5</span>
            </div>
            <div className="card-bottom">
              <div>
                <span className="label">REAL-TIME WHOP CARD</span>
                <span className="value text-[#003087]">VIP DEBIT & CREDIT</span>
              </div>
              <div className="card-number-wrapper">
                <span className="hidden-stars">•••• ••••</span>
                <span className="card-number text-[#003087]">{paypalCardNumber}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Front Pocket */}
        <div className="pocket">
          <svg viewBox="0 0 280 160" width="280" height="160" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M0 40C0 17.9086 17.9086 0 40 0H240C262.091 0 280 17.9086 280 40V100C280 133.137 253.137 160 220 160H60C26.8629 160 0 133.137 0 100V40Z" fill="#0f172a" />
            <path d="M0 40C0 17.9086 17.9086 0 40 0H240C262.091 0 280 17.9086 280 40V45C280 45 200 80 140 80C80 80 0 45 0 45V40Z" fill="#1e293b" />
            <path d="M0 45C0 45 80 80 140 80C200 80 280 45 280 45V100C280 133.137 253.137 160 220 160H60C26.8629 160 0 133.137 0 100V45Z" fill="#090d16" />
          </svg>

          <div className="pocket-content">
            <span className="balance-stars">••••••••</span>
            <span className="balance-real">{balance}</span>

            <div className="eye-icon-wrapper">
              <svg className="eye-icon eye-slash" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24" />
                <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68" />
                <path d="M6.61 6.61A13.52 13.52 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61" />
                <line x1="2" x2="22" y1="2" y2="22" />
              </svg>
              <svg className="eye-icon eye-open" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

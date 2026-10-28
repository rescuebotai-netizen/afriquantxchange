import React, { useState } from 'react';
import { InvestorSettings } from './settings/InvestorSettings';
import { CompanySettings } from './settings/CompanySettings';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Fingerprint, CheckCircle2 } from 'lucide-react';
import { BiometricAuthModal } from './BiometricAuthModal';

export function Settings({ userRole, onRoleChange, setActiveTab }: { userRole: 'admin' | 'investor' | 'company', onRoleChange: (role: 'admin' | 'investor' | 'company') => void, setActiveTab: (tab: string) => void }) {
  const [isBiometricModalOpen, setIsBiometricModalOpen] = useState(false);
  const [biometricStatusMsg, setBiometricStatusMsg] = useState<string | null>(null);

  return (
    <div className="max-w-6xl mx-auto space-y-8 relative pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-white">Settings</h1>
          <p className="text-zinc-400 mt-1">Manage your account, compliance, and preferences.</p>
        </div>

        {/* FIDO2 Biometrics Button */}
        <div className="flex items-center gap-3">
          {biometricStatusMsg && (
            <span className="text-xs text-emerald-400 font-mono font-medium flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/20 px-3 py-1.5 rounded-xl">
              <CheckCircle2 className="w-3.5 h-3.5" /> {biometricStatusMsg}
            </span>
          )}
          <button
            onClick={() => setIsBiometricModalOpen(true)}
            title="Hardware Biometric Security & Passkey Authentication (WebAuthn / FIDO2)"
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-neutral-900 border border-emerald-500/30 text-white hover:bg-emerald-500 hover:text-black transition-all duration-300 shadow-xl text-xs font-mono group cursor-pointer"
          >
            <Fingerprint className="w-4 h-4 text-emerald-400 group-hover:text-black group-hover:scale-110 transition-transform" />
            <span className="font-semibold tracking-wider">FIDO2 Biometrics</span>
          </button>
        </div>
      </div>

      {userRole === 'company' ? <CompanySettings setActiveTab={setActiveTab} /> : <InvestorSettings setActiveTab={setActiveTab} />}

      {/* Hardware Biometric Security Gate Modal */}
      <BiometricAuthModal
        isOpen={isBiometricModalOpen}
        actionTitle="Institutional Passkey & Biometric Enrollment"
        actionDescription="Secure hardware authentication using Web Authentication API (WebAuthn / FIDO2) with biometric sensor or hardware security key."
        onSuccess={(result) => {
          setIsBiometricModalOpen(false);
          setBiometricStatusMsg(`Verified via ${result.methodUsed}`);
        }}
        onCancel={() => setIsBiometricModalOpen(false)}
      />
    </div>
  );
}

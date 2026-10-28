import React, { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { User, Shield, CreditCard, Bell, Lock, AlertCircle, CheckCircle2, TrendingUp, FileText, Key, ScanFace, Fingerprint } from 'lucide-react';
import { WhopIntegrationCard } from '../WhopIntegrationCard';
import { BiometricAuthModal } from '../BiometricAuthModal';
import { BiometricService } from '../../services/biometricService';

export function InvestorSettings({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const [showBioModal, setShowBioModal] = useState(false);
  const [bioSuccessMsg, setBioSuccessMsg] = useState<string | null>(null);

  const [profileData, setProfileData] = useState(() => {
    const saved = localStorage.getItem('investorProfile');
    return saved ? JSON.parse(saved) : {
      name: 'Alex Investor',
      email: 'alex@example.com',
      phone: '+1 (555) 000-0000',
      location: 'San Francisco, CA',
      type: 'Retail',
    };
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    localStorage.setItem('investorProfile', JSON.stringify(profileData));
    setTimeout(() => setIsSaving(false), 500);
  };

  return (
    <div className="space-y-6">
      {/* AI Insights & Health Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-blue-500/10 border-blue-500/20 lg:col-span-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-400 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> AI Insight
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-300">Your risk profile suggests exploring Series B opportunities in the AI sector. <button onClick={() => setActiveTab('marketplace')} className="text-blue-400 hover:underline">View matches</button></p>
          </CardContent>
        </Card>
        
        <Card className="bg-zinc-900/50 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold text-white">85%</span>
              <Badge variant="outline" className="text-emerald-400 border-emerald-400/20 bg-emerald-400/10">Strong</Badge>
            </div>
            <Progress value={85} className="h-2" />
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/50 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              <div>
                <p className="text-white font-medium">Verified</p>
                <p className="text-xs text-zinc-500">KYC & AML cleared</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/50 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Security</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold text-white">100%</span>
              <Badge variant="outline" className="text-emerald-400 border-emerald-400/20 bg-emerald-400/10">Secure</Badge>
            </div>
            <Progress value={100} className="h-2" />
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/50 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Financial Setup</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <CreditCard className="w-8 h-8 text-emerald-400" />
              <div>
                <p className="text-white font-medium">Ready</p>
                <p className="text-xs text-zinc-500">Bank linked</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 bg-zinc-900/50 border border-white/10 p-1 rounded-xl h-auto">
          <TabsTrigger value="profile" className="data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-lg py-2.5"><User className="w-4 h-4 mr-2 hidden sm:block" /> Profile</TabsTrigger>
          <TabsTrigger value="compliance" className="data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-lg py-2.5"><Shield className="w-4 h-4 mr-2 hidden sm:block" /> Compliance</TabsTrigger>
          <TabsTrigger value="financial" className="data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-lg py-2.5"><CreditCard className="w-4 h-4 mr-2 hidden sm:block" /> Financial</TabsTrigger>
          <TabsTrigger value="integrations" className="data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-lg py-2.5"><Key className="w-4 h-4 mr-2 hidden sm:block text-orange-400" /> Integrations</TabsTrigger>
          <TabsTrigger value="notifications" className="data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-lg py-2.5"><Bell className="w-4 h-4 mr-2 hidden sm:block" /> Alerts</TabsTrigger>
          <TabsTrigger value="security" className="data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-lg py-2.5"><Lock className="w-4 h-4 mr-2 hidden sm:block" /> Security</TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="mt-6 space-y-6">
          <Card className="bg-zinc-900/50 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Personal Information</CardTitle>
              <CardDescription>Update your personal details and contact information.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-zinc-400">Full Name</Label>
                  <Input id="name" value={profileData.name} onChange={e => setProfileData({...profileData, name: e.target.value})} className="bg-black/40 border-white/10 text-white" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-zinc-400">Email</Label>
                  <Input id="email" type="email" value={profileData.email} onChange={e => setProfileData({...profileData, email: e.target.value})} className="bg-black/40 border-white/10 text-white" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-zinc-400">Phone</Label>
                  <Input id="phone" type="tel" value={profileData.phone} onChange={e => setProfileData({...profileData, phone: e.target.value})} className="bg-black/40 border-white/10 text-white" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location" className="text-zinc-400">Location</Label>
                  <Input id="location" value={profileData.location} onChange={e => setProfileData({...profileData, location: e.target.value})} className="bg-black/40 border-white/10 text-white" />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSave} disabled={isSaving} className="bg-white text-black hover:bg-zinc-200">
                {isSaving ? 'Saving...' : 'Save Changes'}
              </Button>
            </CardFooter>
          </Card>

          <Card className="bg-zinc-900/50 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Investment Profile</CardTitle>
              <CardDescription>Help us tailor opportunities to your goals.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-zinc-400">Investor Type</Label>
                  <select value={profileData.type} onChange={e => setProfileData({...profileData, type: e.target.value})} className="w-full h-9 rounded-md border border-white/10 bg-black/40 px-3 py-1 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                    <option value="Retail">Retail</option>
                    <option value="HNWI">High Net Worth Individual (HNWI)</option>
                    <option value="Institutional">Institutional</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-400">Risk Profile (AI Calibrated)</Label>
                  <div className="flex items-center gap-2 h-9 px-3 rounded-md bg-black/40 border border-white/10 text-sm text-white">
                    <Badge variant="outline" className="text-orange-400 border-orange-400/20 bg-orange-400/10">Moderate-High</Badge>
                    <span className="text-zinc-500 text-xs ml-auto">Auto-updated based on activity</span>
                  </div>
                </div>
              </div>
              <div className="space-y-2 mt-4">
                <Label className="text-zinc-400">Preferred Sectors</Label>
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">Artificial Intelligence</Badge>
                  <Badge className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">Fintech</Badge>
                  <Badge className="bg-blue-500/20 text-blue-400 hover:bg-blue-500/30">Biotech</Badge>
                  <Badge variant="outline" className="text-zinc-400 border-dashed border-zinc-600 hover:text-white cursor-pointer">+ Add Sector</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="mt-6 space-y-6">
          <Card className="bg-zinc-900/50 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Verification & KYC</CardTitle>
              <CardDescription>Manage your compliance documents and status.</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border-white/10">
                  <AccordionTrigger className="text-white hover:no-underline hover:text-blue-400">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span>Identity Verification</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-400">
                    <div className="space-y-4 pt-2">
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-sm text-blue-400">
                        <strong>Why this is required:</strong> Government regulations require us to verify the identity of all investors to prevent fraud and money laundering (AML/KYC).
                      </div>
                      <p className="text-sm">Your passport was verified on Oct 10, 2025.</p>
                      <div className="flex items-center gap-4 p-3 rounded-lg bg-black/40 border border-white/5">
                        <FileText className="w-8 h-8 text-zinc-500" />
                        <div className="flex-1">
                          <p className="text-sm text-white font-medium">passport_front.jpg</p>
                          <p className="text-xs text-zinc-500">2.4 MB</p>
                        </div>
                        <Button variant="outline" size="sm" className="border-white/10 text-white">Update</Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2" className="border-white/10">
                  <AccordionTrigger className="text-white hover:no-underline hover:text-blue-400">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span>Proof of Address</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-400">
                    <div className="space-y-4 pt-2">
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-sm text-blue-400">
                        <strong>Why this is required:</strong> We need to confirm your residency to ensure compliance with local tax laws and investment regulations.
                      </div>
                      <p className="text-sm pt-2">Utility bill verified on Oct 10, 2025.</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3" className="border-white/10">
                  <AccordionTrigger className="text-white hover:no-underline hover:text-blue-400">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-400" />
                      <span>Source of Funds Declaration</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-400">
                    <div className="space-y-4 pt-2">
                      <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3 text-sm text-blue-400">
                        <strong>Why this is required:</strong> To comply with international anti-money laundering (AML) directives, we must verify the legitimate origin of your investment capital.
                      </div>
                      <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm">
                        Action Required: Please update your source of funds declaration for the current fiscal year.
                      </div>
                      <Button className="bg-amber-500 text-black hover:bg-amber-600">Complete Declaration</Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Financial Tab */}
        <TabsContent value="financial" className="mt-6 space-y-6">
          <Card className="bg-zinc-900/50 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Payment Methods</CardTitle>
              <CardDescription>Manage your linked accounts and wallets.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl border border-white/10 bg-black/40 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 bg-zinc-800 rounded flex items-center justify-center border border-white/5">
                    <span className="text-xs font-bold text-white">BANK</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Chase Checking</p>
                    <p className="text-xs text-zinc-500">**** 4567</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-emerald-400 border-emerald-400/20 bg-emerald-400/10">Active</Badge>
              </div>
              <Button variant="outline" className="w-full border-dashed border-white/20 text-zinc-400 hover:text-white hover:bg-white/5">
                + Link New Bank Account
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="mt-6 space-y-6">
          <Card className="bg-zinc-900/50 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Notification Preferences</CardTitle>
              <CardDescription>Choose what updates you want to receive.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-white text-base">Investment Opportunities</Label>
                  <p className="text-sm text-zinc-500">Alerts for new startups matching your profile.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-white text-base">Portfolio Performance</Label>
                  <p className="text-sm text-zinc-500">Weekly summaries of your investments.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-white text-base">Market Intelligence</Label>
                  <p className="text-sm text-zinc-500">AI-driven market signals and sector trends.</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-white text-base">Compliance Alerts</Label>
                  <p className="text-sm text-zinc-500">Important notices about your account status.</p>
                </div>
                <Switch defaultChecked disabled />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="mt-6 space-y-6">
          <Card className="bg-gradient-to-r from-blue-950/40 via-zinc-900/60 to-purple-950/40 border-blue-500/30">
            <CardHeader>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <Badge variant="outline" className="text-blue-400 border-blue-500/30 bg-blue-500/10 text-xs font-mono mb-2">
                    6/6 INSTITUTIONAL PROTOCOLS ACTIVE
                  </Badge>
                  <CardTitle className="text-white text-lg">Institutional Integrations Hub</CardTitle>
                  <CardDescription className="text-zinc-300">
                    Direct access to FIX 4.4 Engine, TradingView Advanced Canvas, Telegram/Discord Alert Webhooks, Fireblocks MPC Custody, and Cloud Data Room Sync.
                  </CardDescription>
                </div>
                <Button 
                  onClick={() => setActiveTab('integrations')}
                  className="bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs"
                >
                  Open Full Integrations Hub →
                </Button>
              </div>
            </CardHeader>
          </Card>
          <WhopIntegrationCard />
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="mt-6 space-y-6">
          <Card className="bg-zinc-900/50 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Security & Access</CardTitle>
              <CardDescription>Protect your account with Biometrics and 2FA.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Biometric SDK Hardware Integration */}
              <div className="p-4 rounded-2xl bg-black/40 border border-emerald-500/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <ScanFace className="w-5 h-5 text-emerald-400" />
                    <Label className="text-white text-base font-bold">Biometric Hardware Passkey (SDK)</Label>
                    <Badge variant="outline" className="text-emerald-400 border-emerald-500/30 bg-emerald-500/10 text-[10px] font-mono">
                      WebAuthn FIDO2
                    </Badge>
                  </div>
                  <p className="text-xs text-zinc-400 max-w-md">
                    Authenticate high-value withdrawals and algorithmic trade execution using Face ID, Touch ID, or FIDO2 hardware keys.
                  </p>
                  {bioSuccessMsg && (
                    <p className="text-xs text-emerald-400 font-mono font-bold mt-1">{bioSuccessMsg}</p>
                  )}
                </div>
                <Button
                  onClick={() => setShowBioModal(true)}
                  className="bg-emerald-500 hover:bg-emerald-600 text-black font-extrabold text-xs uppercase tracking-wider py-2 px-4 rounded-xl flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)] shrink-0"
                >
                  <Fingerprint className="w-4 h-4" />
                  Test Biometric Sensor
                </Button>
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="space-y-0.5">
                  <Label className="text-white text-base">Two-Factor Authentication (2FA)</Label>
                  <p className="text-sm text-zinc-500">Secure your account with an authenticator app.</p>
                </div>
                <Button variant="outline" className="border-emerald-500/50 text-emerald-400 hover:bg-emerald-500/10">Enabled</Button>
              </div>
              <div className="space-y-4 pt-4 border-t border-white/10">
                <Label className="text-white text-base">Recent Login Activity</Label>
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <p className="text-white">MacBook Pro - Chrome</p>
                      <p className="text-zinc-500">San Francisco, CA • IP: 192.168.1.1</p>
                    </div>
                    <span className="text-emerald-400">Current Session</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <div>
                      <p className="text-white">iPhone 14 - Safari</p>
                      <p className="text-zinc-500">San Francisco, CA • IP: 10.0.0.5</p>
                    </div>
                    <span className="text-zinc-500">2 hours ago</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <BiometricAuthModal
        isOpen={showBioModal}
        actionTitle="Biometric Hardware Test"
        actionDescription="Verify your identity using Face ID / Touch ID hardware passkey."
        onSuccess={(res) => {
          setShowBioModal(false);
          setBioSuccessMsg(`✅ Verified via ${res.methodUsed} at ${new Date(res.timestamp).toLocaleTimeString()}`);
        }}
        onCancel={() => setShowBioModal(false)}
      />
    </div>
  );
}

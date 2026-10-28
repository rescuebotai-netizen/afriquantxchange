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
import { Building2, Shield, CreditCard, Bell, Lock, AlertCircle, CheckCircle2, TrendingUp, FileText, Users, User, Key } from 'lucide-react';
import { WhopIntegrationCard } from '../WhopIntegrationCard';

export function CompanySettings({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const [profileData, setProfileData] = useState(() => {
    const saved = localStorage.getItem('companyProfile');
    return saved ? JSON.parse(saved) : {
      companyName: 'AfriQuant X Ltd.',
      regNumber: '12345678',
      jurisdiction: 'Delaware, USA',
      status: 'Active (Series A)',
      description: 'AfriQuant X is building the next generation of neural interfaces for cognitive enhancement.',
    };
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    localStorage.setItem('companyProfile', JSON.stringify(profileData));
    setTimeout(() => setIsSaving(false), 500);
  };

  return (
    <div className="space-y-6">
      {/* AI Insights & Health Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-purple-500/10 border-purple-500/20 lg:col-span-4">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-400 flex items-center gap-2">
              <TrendingUp className="w-4 h-4" /> AI Insight
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-300">Your profile completeness is 78% — improve visibility by adding audited financials. <button onClick={() => setActiveTab('company-profile')} className="text-purple-400 hover:underline">Upload now</button></p>
          </CardContent>
        </Card>
        
        <Card className="bg-zinc-900/50 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-2">
              <span className="text-2xl font-bold text-white">78%</span>
              <Badge variant="outline" className="text-amber-400 border-amber-400/20 bg-amber-400/10">Action Needed</Badge>
            </div>
            <Progress value={78} className="h-2 bg-amber-500/20 [&>div]:bg-amber-500" />
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/50 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Compliance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <AlertCircle className="w-8 h-8 text-amber-400" />
              <div>
                <p className="text-white font-medium">Pending Review</p>
                <p className="text-xs text-zinc-500">UBO verification required</p>
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
              <span className="text-2xl font-bold text-white">60%</span>
              <Badge variant="outline" className="text-amber-400 border-amber-400/20 bg-amber-400/10">Enable 2FA</Badge>
            </div>
            <Progress value={60} className="h-2 bg-amber-500/20 [&>div]:bg-amber-500" />
          </CardContent>
        </Card>

        <Card className="bg-zinc-900/50 border-white/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-zinc-400">Financial Setup</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              <div>
                <p className="text-white font-medium">Active</p>
                <p className="text-xs text-zinc-500">Escrow linked</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 bg-zinc-900/50 border border-white/10 p-1 rounded-xl h-auto">
          <TabsTrigger value="profile" className="data-[state=active]:bg-white/10 data-[state=active]:text-white rounded-lg py-2.5"><Building2 className="w-4 h-4 mr-2 hidden sm:block" /> Profile</TabsTrigger>
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
              <CardTitle className="text-white">Company Information</CardTitle>
              <CardDescription>Manage your business details and public profile.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-zinc-400">Registered Name</Label>
                  <Input id="companyName" value={profileData.companyName} onChange={e => setProfileData({...profileData, companyName: e.target.value})} className="bg-black/40 border-white/10 text-white" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="regNumber" className="text-zinc-400">Registration Number</Label>
                  <Input id="regNumber" value={profileData.regNumber} onChange={e => setProfileData({...profileData, regNumber: e.target.value})} className="bg-black/40 border-white/10 text-white" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jurisdiction" className="text-zinc-400">Jurisdiction</Label>
                  <Input id="jurisdiction" value={profileData.jurisdiction} onChange={e => setProfileData({...profileData, jurisdiction: e.target.value})} className="bg-black/40 border-white/10 text-white" />
                </div>
                <div className="space-y-2">
                  <Label className="text-zinc-400">Fundraising Status</Label>
                  <select value={profileData.status} onChange={e => setProfileData({...profileData, status: e.target.value})} className="w-full h-9 rounded-md border border-white/10 bg-black/40 px-3 py-1 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
                    <option value="Active (Series A)">Active (Series A)</option>
                    <option value="Closed">Closed</option>
                    <option value="Upcoming (Seed)">Upcoming (Seed)</option>
                  </select>
                </div>
              </div>
              <div className="space-y-2 mt-4">
                <Label className="text-zinc-400">Company Description</Label>
                <textarea 
                  className="w-full min-h-[100px] rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm text-white focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  value={profileData.description}
                  onChange={e => setProfileData({...profileData, description: e.target.value})}
                />
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
              <CardTitle className="text-white">Executive Team</CardTitle>
              <CardDescription>Manage key personnel and ownership structure.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl border border-white/10 bg-black/40 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center border border-white/5">
                    <User className="w-5 h-5 text-zinc-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Jane Founder</p>
                    <p className="text-xs text-zinc-500">CEO & Co-founder</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-emerald-400 border-emerald-400/20 bg-emerald-400/10">Verified</Badge>
              </div>
              <Button variant="outline" className="w-full border-dashed border-white/20 text-zinc-400 hover:text-white hover:bg-white/5">
                + Add Team Member
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Compliance Tab */}
        <TabsContent value="compliance" className="mt-6 space-y-6">
          <Card className="bg-zinc-900/50 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Due Diligence & Documents</CardTitle>
              <CardDescription>Upload and manage your corporate compliance documents.</CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1" className="border-white/10">
                  <AccordionTrigger className="text-white hover:no-underline hover:text-purple-400">
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span>Business Registration</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-400">
                    <div className="space-y-4 pt-2">
                      <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3 text-sm text-purple-400">
                        <strong>Why this is required:</strong> We must verify the legal existence and standing of your company before allowing you to raise capital on the platform.
                      </div>
                      <p className="text-sm">Certificate of Incorporation verified.</p>
                      <div className="flex items-center gap-4 p-3 rounded-lg bg-black/40 border border-white/5">
                        <FileText className="w-8 h-8 text-zinc-500" />
                        <div className="flex-1">
                          <p className="text-sm text-white font-medium">cert_incorp.pdf</p>
                          <p className="text-xs text-zinc-500">1.2 MB</p>
                        </div>
                        <Button variant="outline" size="sm" className="border-white/10 text-white">Update</Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-2" className="border-white/10">
                  <AccordionTrigger className="text-white hover:no-underline hover:text-purple-400">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-400" />
                      <span>Financial Statements</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-400">
                    <div className="space-y-4 pt-2">
                      <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3 text-sm text-purple-400">
                        <strong>Why this is required:</strong> Investors require transparency into your financial health. Audited statements significantly improve your profile's trust score.
                      </div>
                      <div className="p-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-sm">
                        Action Required: Please upload your latest audited financials to improve your profile score.
                      </div>
                      <Button className="bg-amber-500 text-black hover:bg-amber-600">Upload Documents</Button>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="item-3" className="border-white/10">
                  <AccordionTrigger className="text-white hover:no-underline hover:text-purple-400">
                    <div className="flex items-center gap-3">
                      <AlertCircle className="w-5 h-5 text-amber-400" />
                      <span>Director & UBO Verification</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="text-zinc-400">
                    <div className="space-y-4 pt-2">
                      <div className="bg-purple-500/10 border border-purple-500/20 rounded-lg p-3 text-sm text-purple-400">
                        <strong>Why this is required:</strong> Anti-Money Laundering (AML) regulations mandate that we identify and verify the Ultimate Beneficial Owners (UBOs) holding 25% or more of the company.
                      </div>
                      <p className="text-sm">Ultimate Beneficial Owners (UBO) must complete KYC.</p>
                      <Button className="bg-amber-500 text-black hover:bg-amber-600">Start Verification</Button>
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
              <CardTitle className="text-white">Corporate Banking & Escrow</CardTitle>
              <CardDescription>Manage your fundraising accounts and disbursement controls.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl border border-white/10 bg-black/40 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 bg-zinc-800 rounded flex items-center justify-center border border-white/5">
                    <span className="text-xs font-bold text-white">BANK</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Silicon Valley Bank</p>
                    <p className="text-xs text-zinc-500">Corporate Checking **** 8899</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-emerald-400 border-emerald-400/20 bg-emerald-400/10">Verified</Badge>
              </div>
              <div className="p-4 rounded-xl border border-white/10 bg-black/40 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-8 bg-purple-500/20 rounded flex items-center justify-center border border-purple-500/30">
                    <span className="text-xs font-bold text-purple-400">ESCROW</span>
                  </div>
                  <div>
                    <p className="text-white font-medium">Series A Escrow Wallet</p>
                    <p className="text-xs text-zinc-500">Receiving funds</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-blue-400 border-blue-400/20 bg-blue-400/10">Active</Badge>
              </div>
              <Button variant="outline" className="w-full border-dashed border-white/20 text-zinc-400 hover:text-white hover:bg-white/5">
                + Setup New Escrow Account
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications Tab */}
        <TabsContent value="notifications" className="mt-6 space-y-6">
          <Card className="bg-zinc-900/50 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Notification Preferences</CardTitle>
              <CardDescription>Choose what updates your team receives.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-white text-base">Investor Interest & Engagement</Label>
                  <p className="text-sm text-zinc-500">Alerts when investors view your profile or request access.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-white text-base">Funding Milestones</Label>
                  <p className="text-sm text-zinc-500">Updates on capital raised and escrow status.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label className="text-white text-base">Compliance Deadlines</Label>
                  <p className="text-sm text-zinc-500">Reminders for required document submissions.</p>
                </div>
                <Switch defaultChecked disabled />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Integrations Tab */}
        <TabsContent value="integrations" className="mt-6 space-y-6">
          <WhopIntegrationCard />
        </TabsContent>

        {/* Security Tab */}
        <TabsContent value="security" className="mt-6 space-y-6">
          <Card className="bg-zinc-900/50 border-white/10">
            <CardHeader>
              <CardTitle className="text-white">Team Access & Roles</CardTitle>
              <CardDescription>Manage who has access to your company account.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 rounded-xl border border-white/10 bg-black/40 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center border border-white/5">
                    <User className="w-5 h-5 text-zinc-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">Jane Founder (You)</p>
                    <p className="text-xs text-zinc-500">jane@neurogrowth.ai</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-purple-400 border-purple-400/20 bg-purple-400/10">Owner</Badge>
              </div>
              <div className="p-4 rounded-xl border border-white/10 bg-black/40 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-zinc-800 rounded-full flex items-center justify-center border border-white/5">
                    <User className="w-5 h-5 text-zinc-400" />
                  </div>
                  <div>
                    <p className="text-white font-medium">John Finance</p>
                    <p className="text-xs text-zinc-500">john@neurogrowth.ai</p>
                  </div>
                </div>
                <Badge variant="outline" className="text-blue-400 border-blue-400/20 bg-blue-400/10">Finance Admin</Badge>
              </div>
              <Button variant="outline" className="w-full border-dashed border-white/20 text-zinc-400 hover:text-white hover:bg-white/5">
                + Invite Team Member
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

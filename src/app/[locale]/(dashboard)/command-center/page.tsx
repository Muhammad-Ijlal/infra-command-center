"use client"

import { useState } from "react"
import { useTranslations } from 'next-intl'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FileText, Clock, CheckCircle2, Send, Plus, Users, Pencil } from "lucide-react"
import { mockContracts } from "@/data/mock-contracts"
import { mockAssets } from "@/data/mock-assets"
import { mockContractors } from "@/data/mock-contractors"
import { Contract } from "@/types/contract"
import { Contractor } from "@/types/contractor"

export default function CommandCenterPage() {
  const t = useTranslations('commandCenter')
  const tCommon = useTranslations('common')
  const [contracts, setContracts] = useState<Contract[]>(mockContracts)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    asset_id: '',
    contractor_id: '',
    description: '',
    response_time: '4',
    completion_time: '10'
  })

  const handleCreateContract = () => {
    const newContract: Contract = {
      contract_id: `CTR-${String(contracts.length + 1).padStart(3, '0')}`,
      title: formData.title,
      type: 'tender',
      status: 'draft',
      asset_id: formData.asset_id,
      contractor_id: formData.contractor_id,
      contractor_name: mockContractors.find(c => c.contractor_id === formData.contractor_id)?.name,
      description: formData.description,
      sla_terms: {
        response_time: parseInt(formData.response_time),
        completion_time: parseInt(formData.completion_time),
        quality_standards: ['ASTM D6433', 'QCS 2014'],
        warranty_period: 24
      },
      created_date: new Date().toISOString().split('T')[0],
      approvals: []
    }
    
    setContracts([...contracts, newContract])
    setShowCreateDialog(false)
    setFormData({
      title: '',
      asset_id: '',
      contractor_id: '',
      description: '',
      response_time: '4',
      completion_time: '10'
    })
  }

  const handleAutoGenerate = () => {
    const asset = mockAssets.find(a => a.asset_id === formData.asset_id)
    if (asset) {
      setFormData(prev => ({
        ...prev,
        title: `${asset.name} - Maintenance and Repair`,
        description: `Comprehensive maintenance and repair works for ${asset.name}. Includes inspection, defect remediation, and preventive maintenance activities.`
      }))
    }
  }

  const handleUpdateStatus = (contractId: string, newStatus: Contract['status']) => {
    setContracts(prev =>
      prev.map(c =>
        c.contract_id === contractId ? { ...c, status: newStatus } : c
      )
    )
  }

  const getSuitableContractors = (contractorIds: string[]): Contractor[] => {
    return contractorIds
      .map(id => mockContractors.find(c => c.contractor_id === id))
      .filter((c): c is Contractor => c !== undefined)
  }

  const handleSendApprovalRequest = (approverName: string) => {
    // In a real app, this would send an email/notification to the approver
    alert(`Approval request sent to ${approverName}`)
  }

  const getStatusBadge = (status: Contract['status']) => {
    switch (status) {
      case 'active':
        return { variant: 'default' as const, className: '' }
      case 'approved':
        return { variant: 'default' as const, className: 'bg-green-600 text-white' }
      case 'sent_to_contractor':
        return { variant: 'default' as const, className: 'bg-blue-600 text-white' }
      case 'pending_approval':
        return { variant: 'default' as const, className: 'bg-yellow-600 text-white' }
      case 'draft':
        return { variant: 'outline' as const, className: '' }
      case 'completed':
        return { variant: 'default' as const, className: 'bg-gray-600 text-white' }
      default:
        return { variant: 'outline' as const, className: '' }
    }
  }

  // Separate contracts and tenders
  const contractsOnly = contracts.filter(c => c.type === 'direct_award' || c.type === 'framework')
  const tendersOnly = contracts.filter(c => c.type === 'tender')

  const draftCount = contracts.filter(c => c.status === 'draft').length
  const pendingCount = contracts.filter(c => c.status === 'pending_approval').length
  const activeCount = contracts.filter(c => c.status === 'active' || c.status === 'sent_to_contractor').length
  
  const tenderDraftCount = tendersOnly.filter(t => t.status === 'draft').length
  const tenderPendingCount = tendersOnly.filter(t => t.status === 'pending_approval').length
  const tenderActiveCount = tendersOnly.filter(t => t.status === 'approved' || t.status === 'sent_to_contractor').length
  
  const contractActiveCount = contractsOnly.filter(c => c.status === 'active').length
  const contractCompletedCount = contractsOnly.filter(c => c.status === 'completed').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground mt-1">
          {t('subtitle')}
        </p>
      </div>

      {/* Tabs for Contracts and Tenders */}
      <Tabs defaultValue="contracts" className="space-y-6">
        <TabsList className="grid w-full max-w-md grid-cols-2">
          <TabsTrigger value="contracts">{t('contracts')}</TabsTrigger>
          <TabsTrigger value="tenders">{t('tenders')}</TabsTrigger>
        </TabsList>

        {/* Contracts Tab */}
        <TabsContent value="contracts" className="space-y-6">
          {/* Contract Summary Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('draftContracts')}</CardTitle>
                <FileText className="h-4 w-4 text-gray-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{draftCount}</div>
                <p className="text-xs text-muted-foreground">{t('beingPrepared')}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('pendingApproval')}</CardTitle>
                <Clock className="h-4 w-4 text-yellow-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
                <p className="text-xs text-muted-foreground">{t('awaitingReview')}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{t('activeContracts')}</CardTitle>
                <CheckCircle2 className="h-4 w-4 text-green-600" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">{activeCount}</div>
                <p className="text-xs text-muted-foreground">{t('inExecution')}</p>
              </CardContent>
            </Card>
          </div>

          {/* Contract Registry */}
          <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t('contractRegistry')}</CardTitle>
              <CardDescription>
                {t('allContracts')}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-green-50 text-green-700">
                {t('active')}: {contractActiveCount}
              </Badge>
              <Badge variant="outline" className="bg-gray-50">
                {t('completed')}: {contractCompletedCount}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {contractsOnly.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('contractId')}</TableHead>
                  <TableHead>{t('itemTitle')}</TableHead>
                  <TableHead>{t('type')}</TableHead>
                  <TableHead>{t('contractor')}</TableHead>
                  <TableHead>{t('status')}</TableHead>
                  <TableHead>{t('startDate')}</TableHead>
                  <TableHead>{t('endDate')}</TableHead>
                  <TableHead>{t('value')}</TableHead>
                  <TableHead>{t('actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contractsOnly.map((contract) => (
                  <TableRow key={contract.contract_id}>
                    <TableCell className="font-medium">{contract.contract_id}</TableCell>
                    <TableCell>{contract.title}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">{contract.type.replace(/_/g, ' ')}</Badge>
                    </TableCell>
                    <TableCell>{contract.contractor_name || t('notAssigned')}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={getStatusBadge(contract.status).variant} 
                        className={`capitalize ${getStatusBadge(contract.status).className}`}
                      >
                        {contract.status.replace(/_/g, ' ')}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">
                      {contract.start_date ? new Date(contract.start_date).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell className="text-sm">
                      {contract.end_date ? new Date(contract.end_date).toLocaleDateString() : '-'}
                    </TableCell>
                    <TableCell>
                      {contract.value ? `${contract.value.toLocaleString()} QAR` : '-'}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setSelectedContract(contract)}
                        >
                          {t('view')}
                        </Button>
                        {contract.status === 'pending_approval' && (
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => {/* TODO: Implement edit functionality */}}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {t('noContractsFound')}
            </div>
          )}
        </CardContent>
      </Card>
        </TabsContent>

        {/* Tenders Tab */}
        <TabsContent value="tenders" className="space-y-6">
          {/* Tender Summary Cards */}
          <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('draftTenders')}</CardTitle>
            <FileText className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{tenderDraftCount}</div>
            <p className="text-xs text-muted-foreground">{t('beingPrepared')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('pendingTenders')}</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{tenderPendingCount}</div>
            <p className="text-xs text-muted-foreground">{t('awaitingApproval')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{t('activeTenders')}</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{tenderActiveCount}</div>
            <p className="text-xs text-muted-foreground">{t('openForBidding')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tender Registry */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>{t('tenderRegistry')}</CardTitle>
              <CardDescription>
                {t('allTenders')}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Badge variant="outline" className="bg-gray-50">
                {t('draft')}: {tenderDraftCount}
              </Badge>
              <Badge variant="outline" className="bg-yellow-50 text-yellow-700">
                {t('pending')}: {tenderPendingCount}
              </Badge>
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                {t('active')}: {tenderActiveCount}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {tendersOnly.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t('tenderId')}</TableHead>
                  <TableHead>{t('itemTitle')}</TableHead>
                  <TableHead>{t('suitableContractors')}</TableHead>
                  <TableHead>{t('status')}</TableHead>
                  <TableHead>{t('createdDate')}</TableHead>
                  <TableHead>{t('value')}</TableHead>
                  <TableHead>{t('actions')}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tendersOnly.map((tender) => {
                  const suitableContractors = tender.suitable_contractors 
                    ? getSuitableContractors(tender.suitable_contractors)
                    : []
                  
                  return (
                    <TableRow key={tender.contract_id}>
                      <TableCell className="font-medium">{tender.contract_id}</TableCell>
                      <TableCell>{tender.title}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Users className="h-4 w-4 text-blue-600" />
                          <span className="text-sm font-medium text-blue-600">
                            {suitableContractors.length} {t('matched')}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant={getStatusBadge(tender.status).variant} 
                          className={`capitalize ${getStatusBadge(tender.status).className}`}
                        >
                          {tender.status.replace(/_/g, ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(tender.created_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {tender.value ? `${tender.value.toLocaleString()} QAR` : '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedContract(tender)}
                          >
                            {t('view')}
                          </Button>
                          {tender.status === 'pending_approval' && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {/* TODO: Implement edit functionality */}}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                          )}
                          {tender.status === 'draft' && (
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleUpdateStatus(tender.contract_id, 'pending_approval')}
                            >
                              {t('submit')}
                            </Button>
                          )}
                          {tender.status === 'approved' && (
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => handleUpdateStatus(tender.contract_id, 'sent_to_contractor')}
                            >
                              {t('send')}
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              {t('noTendersFound')}
            </div>
          )}
        </CardContent>
      </Card>
        </TabsContent>
      </Tabs>

      {/* Create Contract Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{t('createNewContract')}</DialogTitle>
            <DialogDescription>
              {t('fillDetails')}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="asset">{t('asset')} *</Label>
                <Select value={formData.asset_id} onValueChange={(value) => setFormData(prev => ({ ...prev, asset_id: value }))}>
                  <SelectTrigger id="asset">
                    <SelectValue placeholder={t('selectAsset')} />
                  </SelectTrigger>
                  <SelectContent>
                    {mockAssets.map(asset => (
                      <SelectItem key={asset.asset_id} value={asset.asset_id}>
                        {asset.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="contractor">{t('contractor')}</Label>
                <Select value={formData.contractor_id} onValueChange={(value) => setFormData(prev => ({ ...prev, contractor_id: value }))}>
                  <SelectTrigger id="contractor">
                    <SelectValue placeholder={t('selectContractor')} />
                  </SelectTrigger>
                  <SelectContent>
                    {mockContractors.map(contractor => (
                      <SelectItem key={contractor.contractor_id} value={contractor.contractor_id}>
                        {contractor.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="title">{t('contractTitle')} *</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleAutoGenerate}
                  disabled={!formData.asset_id}
                >
                  {t('autoGenerate')}
                </Button>
              </div>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder={t('enterTitle')}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">{t('description')}</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full min-h-[100px] px-3 py-2 text-sm border rounded-md"
                placeholder={t('enterDescription')}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="response">{t('responseTimeHours')}</Label>
                <Input
                  id="response"
                  type="number"
                  value={formData.response_time}
                  onChange={(e) => setFormData(prev => ({ ...prev, response_time: e.target.value }))}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="completion">{t('completionTimeDays')}</Label>
                <Input
                  id="completion"
                  type="number"
                  value={formData.completion_time}
                  onChange={(e) => setFormData(prev => ({ ...prev, completion_time: e.target.value }))}
                />
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                {tCommon('cancel')}
              </Button>
              <Button
                onClick={handleCreateContract}
                disabled={!formData.title || !formData.asset_id}
              >
                {t('createContract')}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* View Contract Dialog */}
      <Dialog open={!!selectedContract} onOpenChange={() => setSelectedContract(null)}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('contractDetails')}</DialogTitle>
            <DialogDescription>{selectedContract?.contract_id}</DialogDescription>
          </DialogHeader>

          {selectedContract && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">{selectedContract.title}</h3>
                <p className="text-sm text-muted-foreground">{selectedContract.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">{t('type')}</p>
                  <Badge className="capitalize">{selectedContract.type}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('status')}</p>
                  <Badge 
                    variant={getStatusBadge(selectedContract.status).variant}
                    className={getStatusBadge(selectedContract.status).className}
                  >
                    {selectedContract.status.replace(/_/g, ' ')}
                  </Badge>
                </div>
                {selectedContract.type !== 'tender' && (
                  <div>
                    <p className="text-sm text-muted-foreground">{t('contractor')}</p>
                    <p className="font-medium">{selectedContract.contractor_name || t('notAssigned')}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-muted-foreground">{t('value')}</p>
                  <p className="font-medium">
                    {selectedContract.value ? `${selectedContract.value.toLocaleString()} QAR` : t('tbd')}
                  </p>
                </div>
              </div>

              {/* Suitable Contractors for Tenders */}
              {selectedContract.type === 'tender' && selectedContract.suitable_contractors && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    {t('suitableContractors')}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t('aiMatchedContractors')}
                  </p>
                  <div className="space-y-3">
                    {getSuitableContractors(selectedContract.suitable_contractors).map((contractor) => (
                      <div 
                        key={contractor.contractor_id}
                        className="border rounded-lg p-4 bg-blue-50/50 dark:bg-blue-950/20"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h5 className="font-semibold">{contractor.name}</h5>
                              <Badge variant="outline" className="bg-white">
                                ⭐ {contractor.rating}
                              </Badge>
                              <Badge 
                                variant="outline" 
                                className={
                                  contractor.sla_compliance === 'excellent' ? 'bg-green-50 text-green-700 border-green-200' :
                                  contractor.sla_compliance === 'good' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                  'bg-gray-50'
                                }
                              >
                                {contractor.sla_compliance}
                              </Badge>
                            </div>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
                              <div>
                                <span className="text-muted-foreground">{t('avgResponseTime')}:</span>
                                <span className="font-medium ml-1">{contractor.avg_response_time}h</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">{t('capacity')}:</span>
                                <span className="font-medium ml-1">{contractor.capacity}%</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">{t('activeContracts')}:</span>
                                <span className="font-medium ml-1">{contractor.active_contracts}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">{t('completed')}:</span>
                                <span className="font-medium ml-1">{contractor.completed_contracts}</span>
                              </div>
                            </div>
                            <div className="mt-2">
                              <span className="text-sm text-muted-foreground">{t('capabilities')}:</span>
                              <div className="flex flex-wrap gap-1 mt-1">
                                {contractor.scope.map((scope) => (
                                  <Badge key={scope} variant="secondary" className="text-xs">
                                    {scope.replace(/_/g, ' ')}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {selectedContract.sla_terms && (
                <div>
                  <h4 className="font-semibold mb-2">{t('slaTerms')}</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">{t('responseTime')}</p>
                      <p>{selectedContract.sla_terms.response_time} {t('hours')}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{t('completionTime')}</p>
                      <p>{selectedContract.sla_terms.completion_time} {t('days')}</p>
                    </div>
                  </div>
                </div>
              )}

              {selectedContract.approvals && selectedContract.approvals.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">{t('approvals')}</h4>
                  <div className="space-y-3">
                    {selectedContract.approvals.map((approval, idx) => (
                      <div key={idx} className="flex items-center justify-between border rounded-lg p-3 bg-muted/30">
                        <div className="flex-1">
                          <p className="font-medium">{approval.approver_name}</p>
                          <p className="text-sm text-muted-foreground">{approval.approver_role}</p>
                          {approval.comments && (
                            <p className="text-sm text-muted-foreground mt-1 italic">"{approval.comments}"</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={approval.status === 'approved' ? 'default' : approval.status === 'rejected' ? 'destructive' : 'secondary'}>
                            {approval.status}
                          </Badge>
                          {approval.status === 'pending' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSendApprovalRequest(approval.approver_name)}
                              className="gap-2"
                            >
                              <Send className="h-3 w-3" />
                              {t('sendRequest')}
                            </Button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex justify-end">
                <Button onClick={() => setSelectedContract(null)}>{tCommon('close')}</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}


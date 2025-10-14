"use client"

import { useState, useEffect } from "react"
import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
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
import { FileText, Clock, CheckCircle2, Send, Users, Pencil, FileSignature, Gavel } from "lucide-react"
import { SummaryCard } from "@/components/summary-card"
import { mockContracts } from "@/data/mock-contracts"
import { mockTenders } from "@/data/mock-tenders"
import { mockAssets } from "@/data/mock-assets"
import { mockContractors } from "@/data/mock-contractors"
import { Contract } from "@/types/contract"
import { Tender } from "@/types/tender"
import { Contractor } from "@/types/contractor"

export default function CommandCenterPage() {
  const t = useTranslations('commandCenter')
  const tCommon = useTranslations('common')
  const searchParams = useSearchParams()
  const [contracts, setContracts] = useState<Contract[]>(mockContracts)
  const [tenders, setTenders] = useState<Tender[]>(mockTenders)
  const [showCreateDialog, setShowCreateDialog] = useState(false)
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null)
  const [selectedTender, setSelectedTender] = useState<Tender | null>(null)
  const [activeTab, setActiveTab] = useState<'contracts' | 'tenders'>('contracts')
  const [formData, setFormData] = useState({
    title: '',
    asset_id: '',
    contractor_id: '',
    description: '',
    response_time: '4',
    completion_time: '10'
  })

  // Handle URL parameters to automatically open contract/tender modal
  useEffect(() => {
    const contractId = searchParams.get('contract')
    const tenderId = searchParams.get('tender')
    
    if (contractId) {
      const contract = contracts.find(c => c.contract_id === contractId)
      if (contract) {
        setSelectedContract(contract)
        setSelectedTender(null) // Clear tender selection
        setActiveTab('contracts') // Set contracts tab as active
      }
    } else if (tenderId) {
      // Check separate tender data structure
      const tender = tenders.find(t => t.tender_id === tenderId)
      if (tender) {
        setSelectedTender(tender)
        setSelectedContract(null) // Clear contract selection
        setActiveTab('tenders') // Set tenders tab as active
      }
    }
  }, [searchParams, contracts, tenders])

  const handleCreateContract = () => {
    const newContract: Contract = {
      contract_id: `CTR-${String(contracts.length + 1).padStart(3, '0')}`,
      title: formData.title,
      type: 'direct_award',
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

  const handleCloseContract = () => {
    setSelectedContract(null)
    // Clear query parameters
    const url = new URL(window.location.href)
    url.searchParams.delete('contract')
    window.history.replaceState({}, '', url.pathname + url.search)
  }

  const handleCloseTender = () => {
    setSelectedTender(null)
    // Clear query parameters
    const url = new URL(window.location.href)
    url.searchParams.delete('tender')
    window.history.replaceState({}, '', url.pathname + url.search)
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
      case 'commissioned':
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

  const getTenderStatusBadge = (status: string) => {
    switch (status) {
      case 'published':
        return { variant: 'default' as const, className: 'bg-blue-100 text-blue-800' }
      case 'submission_period':
        return { variant: 'default' as const, className: 'bg-green-100 text-green-800' }
      case 'evaluation':
        return { variant: 'default' as const, className: 'bg-yellow-100 text-yellow-800' }
      case 'awarded':
        return { variant: 'default' as const, className: 'bg-purple-100 text-purple-800' }
      case 'cancelled':
        return { variant: 'destructive' as const, className: 'bg-red-100 text-red-800' }
      case 'draft':
        return { variant: 'outline' as const, className: 'bg-gray-100 text-gray-800' }
      case 'pending_approval':
        return { variant: 'default' as const, className: 'bg-yellow-600 text-white' }
      default:
        return { variant: 'outline' as const, className: '' }
    }
  }

  const getComplianceColor = (compliance: Contractor['sla_compliance']) => {
    switch (compliance) {
      case 'excellent':
        return 'bg-green-600'
      case 'good':
        return 'bg-blue-600'
      case 'fair':
        return 'bg-yellow-600'
      case 'poor':
        return 'bg-red-600'
      default:
        return 'bg-gray-600'
    }
  }

  // Separate contracts and tenders
  const contractsOnly = contracts.filter(c => 
    (c.type === 'direct_award' || c.type === 'framework') && 
    c.status !== 'completed' // Hide completed contracts (for resolved detections)
  )
  // Use separate tender data structure instead of contract-based tenders
  const tendersOnly = tenders

  const draftCount = contracts.filter(c => c.status === 'draft').length
  const pendingCount = 4 //contracts.filter(c => c.status === 'pending_approval').length
  const activeCount = 16 //contracts.filter(c => c.status === 'active' || c.status === 'commissioned').length

  const tenderDraftCount = tendersOnly.filter(t => t.status === 'pending_approval').length
  const tenderPendingCount = 9 //tendersOnly.filter(t => t.status === 'published').length
  const tenderActiveCount = 2 //tendersOnly.filter(t => t.status === 'submission_period' || t.status === 'evaluation').length
  
  const contractActiveCount = contractsOnly.filter(c => c.status === 'active').length
  const contractCompletedCount = contractsOnly.filter(c => c.status === 'completed').length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-title tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground mt-1">
          {t('subtitle')}
        </p>
      </div>

      {/* Tabs for Contracts and Tenders */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'contracts' | 'tenders')} className="flex flex-col items-start gap-4">
        <TabsList className="grid w-full grid-cols-1 items-stretch gap-2 sm:grid-cols-2 md:gap-4 lg:flex">
          <TabsTrigger 
            value="contracts" 
            className="flex w-full flex-row gap-2 p-3"
          >
            <FileSignature className="h-5 w-5 stroke-1" />
            <div className="flex flex-col gap-1">
              <h3 className="font-semibold">{t('contracts')}</h3>
              <p className="text-muted-foreground text-xs">
                Manage active contracts and agreements
              </p>
            </div>
          </TabsTrigger>
          <TabsTrigger 
            value="tenders" 
            className="flex w-full flex-row gap-2 p-3"
          >
            <Gavel className="h-5 w-5 stroke-1" />
            <div className="flex flex-col gap-1">
              <h3 className="font-semibold">{t('tenders')}</h3>
              <p className="text-muted-foreground text-xs">
                Handle tender processes and bidding
              </p>
            </div>
          </TabsTrigger>
        </TabsList>

        {/* Contracts Tab */}
        <TabsContent value="contracts" className="w-full space-y-6">
          {/* Contract Summary Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <SummaryCard
              icon={<FileText className="h-4 w-4 text-muted-foreground" />}
              label={t('draftContracts')}
              value={draftCount}
              description={t('beingPrepared')}
            />
            <SummaryCard
              icon={<Clock className="h-4 w-4 text-yellow-600" />}
              label={t('pendingApproval')}
              value={pendingCount}
              description={t('awaitingReview')}
            />
            <SummaryCard
              icon={<CheckCircle2 className="h-4 w-4 text-green-600" />}
              label={t('activeContracts')}
              value={activeCount}
              description={t('inExecution')}
            />
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
                      <Badge variant="outline" className="capitalize" size="large_status">{contract.type.replace(/_/g, ' ')}</Badge>
                    </TableCell>
                    <TableCell>{contract.contractor_name || t('notAssigned')}</TableCell>
                    <TableCell>
                      <Badge 
                        variant={getStatusBadge(contract.status).variant} 
                        className={`capitalize ${getStatusBadge(contract.status).className}`}
                        size="xl_status"
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
        <TabsContent value="tenders" className="w-full space-y-6">
          {/* Tender Summary Cards */}
          <div className="grid gap-4 md:grid-cols-3">
            <SummaryCard
              icon={<FileText className="h-4 w-4 text-muted-foreground" />}
              label={t('draftTenders')}
              value={tenderDraftCount}
              description={t('beingPrepared')}
            />
            <SummaryCard
              icon={<Clock className="h-4 w-4 text-yellow-600" />}
              label={t('pendingTenders')}
              value={tenderPendingCount}
              description={t('awaitingApproval')}
            />
            <SummaryCard
              icon={<Users className="h-4 w-4 text-blue-600" />}
              label={t('activeTenders')}
              value={tenderActiveCount}
              description={t('openForBidding')}
            />
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
                    <TableRow key={tender.tender_id}>
                      <TableCell className="font-medium">{tender.tender_id}</TableCell>
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
                          variant={getTenderStatusBadge(tender.status).variant} 
                          className={`capitalize ${getTenderStatusBadge(tender.status).className}`}
                          size="xl_status"
                        >
                          {tender.status.replace(/_/g, ' ')}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">
                        {new Date(tender.created_date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {tender.estimated_value ? `${tender.estimated_value.toLocaleString()} ${tender.currency}` : '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setSelectedTender(tender)}
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
                          {tender.status === 'pending_approval' && (
                            <Button
                              size="sm"
                              variant="default"
                              onClick={() => {/* TODO: Implement tender publish functionality */}}
                            >
                              {t('submit')}
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

      {/* View Contract Dialog */}
      <Dialog open={!!selectedContract} onOpenChange={(open) => !open && handleCloseContract()}>
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
                  <Badge variant="outline" className="capitalize" size="table">{selectedContract.type.replace(/_/g, ' ')}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('status')}</p>
                  <Badge 
                    variant={getStatusBadge(selectedContract.status).variant}
                    className={`capitalize ${getStatusBadge(selectedContract.status).className}`}
                    size="status"
                  >
                    {selectedContract.status.replace(/_/g, ' ')}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('contractor')}</p>
                  <p className="font-medium">{selectedContract.contractor_name || t('notAssigned')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('value')}</p>
                  <p className="font-medium">
                    {selectedContract.value ? `${selectedContract.value.toLocaleString()} QAR` : t('tbd')}
                  </p>
                </div>
              </div>

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
                            <p className="text-sm text-muted-foreground mt-1 italic">&ldquo;{approval.comments}&rdquo;</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={approval.status === 'approved' ? 'default' : approval.status === 'rejected' ? 'destructive' : 'secondary'} className="capitalize" size="status">
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

      {/* View Tender Dialog */}
      <Dialog open={!!selectedTender} onOpenChange={(open) => !open && handleCloseTender()}>
        <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t('tenderDetails')}</DialogTitle>
            <DialogDescription>{selectedTender?.tender_id}</DialogDescription>
          </DialogHeader>

          {selectedTender && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">{selectedTender.title}</h3>
                <p className="text-sm text-muted-foreground">{selectedTender.description}</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">{t('type')}</p>
                  <Badge variant="outline" className="capitalize" size="large_status">{selectedTender.type}</Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('status')}</p>
                  <Badge 
                    variant={getTenderStatusBadge(selectedTender.status).variant}
                    className={`capitalize ${getTenderStatusBadge(selectedTender.status).className}`}
                    size="xl_status"
                  >
                    {selectedTender.status.replace(/_/g, ' ')}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('submissionDeadline')}</p>
                  <p className="font-medium">
                    {new Date(selectedTender.submission_deadline).toLocaleDateString()}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('estimatedValue')}</p>
                  <p className="font-medium">
                    {selectedTender.estimated_value ? `${selectedTender.estimated_value.toLocaleString()} ${selectedTender.currency}` : t('tbd')}
                  </p>
                </div>
              </div>

              {/* Requirements */}
              <div>
                <h4 className="font-semibold mb-2">{t('requirements')}</h4>
                <ul className="list-disc list-inside space-y-1 text-sm">
                  {selectedTender.requirements.map((req, index) => (
                    <li key={index}>{req}</li>
                  ))}
                </ul>
              </div>

              {/* Suitable Contractors */}
              {selectedTender.suitable_contractors && (
                <div className="border-t pt-4">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    {t('suitableContractors')}
                  </h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t('aiMatchedContractors')}
                  </p>
                  <div className="space-y-3">
                    {getSuitableContractors(selectedTender.suitable_contractors).map((contractor) => (
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
                                  <Badge key={scope} variant="secondary" className="text-xs" size="sm">
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

              {selectedTender.sla_terms && (
                <div>
                  <h4 className="font-semibold mb-2">{t('slaTerms')}</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">{t('responseTime')}</p>
                      <p>{selectedTender.sla_terms.response_time} {t('hours')}</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">{t('completionTime')}</p>
                      <p>{selectedTender.sla_terms.completion_time} {t('days')}</p>
                    </div>
                  </div>
                </div>
              )}

              {selectedTender.approvals && selectedTender.approvals.length > 0 && (
                <div>
                  <h4 className="font-semibold mb-2">{t('approvals')}</h4>
                  <div className="space-y-3">
                    {selectedTender.approvals.map((approval, idx) => (
                      <div key={idx} className="flex items-center justify-between border rounded-lg p-3 bg-muted/30">
                        <div className="flex-1">
                          <p className="font-medium">{approval.approver_name}</p>
                          <p className="text-sm text-muted-foreground">{approval.approver_role}</p>
                          {approval.comments && (
                            <p className="text-sm text-muted-foreground mt-1 italic">&ldquo;{approval.comments}&rdquo;</p>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant={approval.status === 'approved' ? 'default' : approval.status === 'rejected' ? 'destructive' : 'secondary'} className="capitalize" size="status">
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
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}


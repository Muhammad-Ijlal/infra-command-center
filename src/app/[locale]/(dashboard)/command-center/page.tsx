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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FileText, Clock, CheckCircle2, Send, Plus } from "lucide-react"
import { mockContracts } from "@/data/mock-contracts"
import { mockAssets } from "@/data/mock-assets"
import { mockContractors } from "@/data/mock-contractors"
import { Contract } from "@/types/contract"

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

  const draftCount = contracts.filter(c => c.status === 'draft').length
  const pendingCount = contracts.filter(c => c.status === 'pending_approval').length
  const activeCount = contracts.filter(c => c.status === 'active' || c.status === 'sent_to_contractor').length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
          <p className="text-muted-foreground mt-1">
            {t('subtitle')}
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          {t('createContract')}
        </Button>
      </div>

      {/* Summary Cards */}
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

      {/* Contracts Table */}
      <Card>
        <CardHeader>
          <CardTitle>{t('contractRegistry')}</CardTitle>
          <CardDescription>
            {t('allContracts')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('contractId')}</TableHead>
                <TableHead>{t('title')}</TableHead>
                <TableHead>{t('type')}</TableHead>
                <TableHead>{t('contractor')}</TableHead>
                <TableHead>{t('status')}</TableHead>
                <TableHead>{t('createdDate')}</TableHead>
                <TableHead>{t('value')}</TableHead>
                <TableHead>{t('actions')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contracts.map((contract) => (
                <TableRow key={contract.contract_id}>
                  <TableCell className="font-medium">{contract.contract_id}</TableCell>
                  <TableCell>{contract.title}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="capitalize">{contract.type}</Badge>
                  </TableCell>
                  <TableCell>{contract.contractor_name || '-'}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={getStatusBadge(contract.status).variant} 
                      className={`capitalize ${getStatusBadge(contract.status).className}`}
                    >
                      {contract.status.replace(/_/g, ' ')}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(contract.created_date).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    {contract.value ? contract.value.toLocaleString() : '-'}
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
                      {contract.status === 'draft' && (
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleUpdateStatus(contract.contract_id, 'pending_approval')}
                        >
                          {t('submit')}
                        </Button>
                      )}
                      {contract.status === 'pending_approval' && (
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleUpdateStatus(contract.contract_id, 'approved')}
                        >
                          {t('approve')}
                        </Button>
                      )}
                      {contract.status === 'approved' && (
                        <Button
                          size="sm"
                          variant="default"
                          onClick={() => handleUpdateStatus(contract.contract_id, 'sent_to_contractor')}
                        >
                          {t('send')}
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Workflow Info */}
      <Card>
        <CardHeader>
          <CardTitle>{t('contractWorkflow')}</CardTitle>
          <CardDescription>{t('approvalProcess')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                <FileText className="h-6 w-6 text-gray-600" />
              </div>
              <p className="text-sm font-medium">{t('draft')}</p>
              <p className="text-xs text-muted-foreground">{t('createContract')}</p>
            </div>
            <div className="hidden md:block text-muted-foreground">→</div>
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
              <p className="text-sm font-medium">{t('pendingApprovalStep')}</p>
              <p className="text-xs text-muted-foreground">{t('reviewRequired')}</p>
            </div>
            <div className="hidden md:block text-muted-foreground">→</div>
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                <CheckCircle2 className="h-6 w-6 text-green-600" />
              </div>
              <p className="text-sm font-medium">{t('approved')}</p>
              <p className="text-xs text-muted-foreground">{t('readyToSend')}</p>
            </div>
            <div className="hidden md:block text-muted-foreground">→</div>
            <div className="flex flex-col items-center text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                <Send className="h-6 w-6 text-blue-600" />
              </div>
              <p className="text-sm font-medium">{t('sent')}</p>
              <p className="text-xs text-muted-foreground">{t('toContractor')}</p>
            </div>
          </div>
        </CardContent>
      </Card>

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
                <div>
                  <p className="text-sm text-muted-foreground">{t('contractor')}</p>
                  <p className="font-medium">{selectedContract.contractor_name || t('notAssigned')}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t('value')}</p>
                  <p className="font-medium">
                    {selectedContract.value ? `${selectedContract.value.toLocaleString()} SAR` : t('tbd')}
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
                  <div className="space-y-2">
                    {selectedContract.approvals.map((approval, idx) => (
                      <div key={idx} className="flex items-center justify-between border-b pb-2">
                        <div>
                          <p className="font-medium">{approval.approver_name}</p>
                          <p className="text-sm text-muted-foreground">{approval.approver_role}</p>
                        </div>
                        <Badge variant={approval.status === 'approved' ? 'default' : 'secondary'}>
                          {approval.status}
                        </Badge>
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


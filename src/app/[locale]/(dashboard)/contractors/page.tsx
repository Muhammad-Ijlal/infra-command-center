"use client"

import { useState } from "react"
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Star, Trophy, TrendingUp } from "lucide-react"
import { SummaryCard } from "@/components/summary-card"
import { mockContractors } from "@/data/mock-contractors"
import { Contractor, ContractorMatch } from "@/types/contractor"

export default function ContractorsPage() {
  const [contractors] = useState<Contractor[]>(mockContractors)
  const [matchedContractors, setMatchedContractors] = useState<ContractorMatch[] | null>(null)
  const [showMatchDialog, setShowMatchDialog] = useState(false)

  const handleAIMatch = () => {
    // Simulate AI matching with random scores
    const matches: ContractorMatch[] = contractors
      .map((contractor) => ({
        contractor,
        match_score: Math.floor(Math.random() * 30) + 70, // 70-100
        availability: contractor.capacity > 70 ? 'limited' : contractor.capacity > 40 ? 'available' : 'available',
        estimated_response: `${contractor.avg_response_time}h`,
        estimated_cost: Math.floor(Math.random() * 150000) + 50000
      }))
      .sort((a, b) => b.match_score - a.match_score)
      .slice(0, 3) as ContractorMatch[]

    setMatchedContractors(matches)
    setShowMatchDialog(true)
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

  const excellentCount = 17 //contractors.filter(c => c.sla_compliance === 'excellent').length
  const avgResponseTime = Math.round(contractors.reduce((acc, c) => acc + c.avg_response_time, 0) / contractors.length)
  const avgCapacity = Math.round(contractors.reduce((acc, c) => acc + c.capacity, 0) / contractors.length)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-title tracking-tight">Contractor Management</h1>
          <p className="text-muted-foreground mt-1">
            Contractor database with AI-powered matching and performance tracking
          </p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <SummaryCard
          icon={<Trophy className="h-4 w-4 text-yellow-600" />}
          label="Excellent SLA"
          value={excellentCount}
          description="Top performing contractors"
        />
        <SummaryCard
          icon={<TrendingUp className="h-4 w-4 text-blue-600" />}
          label="Avg Response Time"
          value={`${avgResponseTime}h`}
          description="Across all contractors"
        />
        <SummaryCard
          icon={<Star className="h-4 w-4 text-green-600" />}
          label="Avg Capacity"
          value={`${avgCapacity}%`}
          description="Available capacity"
        />
      </div>

      {/* Contractors Table */}
      <Card>
        <CardHeader>
          <CardTitle>Contractor Directory</CardTitle>
          <CardDescription>
            Comprehensive contractor database with performance metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Scope</TableHead>
                <TableHead>SLA Compliance</TableHead>
                <TableHead>Response Time</TableHead>
                <TableHead>Capacity</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Active Contracts</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {contractors.map((contractor) => (
                <TableRow key={contractor.contractor_id}>
                  <TableCell className="font-medium">{contractor.name}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {contractor.scope.slice(0, 2).map((s) => (
                        <Badge key={s} variant="outline" className="text-xs capitalize" size="default">
                          {s.replace(/_/g, ' ')}
                        </Badge>
                      ))}
                      {contractor.scope.length > 2 && (
                        <Badge variant="outline" className="text-xs" size="sm">
                          +{contractor.scope.length - 2}
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge className={`${getComplianceColor(contractor.sla_compliance)} text-white capitalize`} size="large_status">
                      {contractor.sla_compliance}
                    </Badge>
                  </TableCell>
                  <TableCell>{contractor.avg_response_time}h</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div
                          className="h-2 rounded-full bg-blue-600"
                          style={{ width: `${contractor.capacity}%` }}
                        />
                      </div>
                      <span className="text-sm">{contractor.capacity}%</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">{contractor.rating}</span>
                    </div>
                  </TableCell>
                  <TableCell>{contractor.active_contracts}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Performance Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Leaderboard</CardTitle>
          <CardDescription>Top contractors by rating and SLA compliance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {contractors
              .sort((a, b) => b.rating - a.rating)
              .slice(0, 5)
              .map((contractor, index) => (
                <div
                  key={contractor.contractor_id}
                  className="flex items-center justify-between border-b pb-3 last:border-0"
                >
                  <div className="flex items-center gap-4">
                    <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
                      index === 0 ? 'bg-yellow-100 text-yellow-700' :
                      index === 1 ? 'bg-gray-100 text-gray-700' :
                      index === 2 ? 'bg-orange-100 text-orange-700' :
                      'bg-blue-50 text-blue-700'
                    }`}>
                      <span className="font-bold">{index + 1}</span>
                    </div>
                    <div>
                      <p className="font-medium">{contractor.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {contractor.completed_contracts} completed contracts
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge className={`${getComplianceColor(contractor.sla_compliance)} text-white capitalize`} size="large_status">
                      {contractor.sla_compliance}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-bold">{contractor.rating}</span>
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </CardContent>
      </Card>

      {/* AI Match Dialog */}
      <Dialog open={showMatchDialog} onOpenChange={setShowMatchDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>AI Contractor Matching Results</DialogTitle>
            <DialogDescription>
              Top 3 contractors matched based on scope, availability, and performance
            </DialogDescription>
          </DialogHeader>

          {matchedContractors && (
            <div className="space-y-4">
              {matchedContractors.map((match, index) => (
                <Card key={match.contractor.contractor_id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                          index === 0 ? 'bg-yellow-100 text-yellow-700' :
                          index === 1 ? 'bg-gray-100 text-gray-700' :
                          'bg-orange-100 text-orange-700'
                        }`}>
                          <Trophy className="h-5 w-5" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{match.contractor.name}</CardTitle>
                          <CardDescription>Match Score: {match.match_score}%</CardDescription>
                        </div>
                      </div>
                      <Badge className={`${getComplianceColor(match.contractor.sla_compliance)} text-white text-sm capitalize`} size="large_status">
                        {match.contractor.sla_compliance}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Estimated Response</p>
                        <p className="font-medium">{match.estimated_response}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Availability</p>
                        <Badge variant={match.availability === 'available' ? 'default' : 'secondary'} size="status">
                          {match.availability}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Rating</p>
                        <div className="flex items-center gap-1">
                          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          <span className="font-medium">{match.contractor.rating}</span>
                        </div>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Estimated Cost</p>
                        <p className="font-medium">
                          {match.estimated_cost?.toLocaleString()} SAR
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setShowMatchDialog(false)}>
                  Close
                </Button>
                <Button onClick={() => setShowMatchDialog(false)}>
                  Proceed to Contract
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}


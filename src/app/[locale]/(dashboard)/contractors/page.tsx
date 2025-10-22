"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Star, Trophy, TrendingUp, Award, Shield, AlertTriangle, CheckCircle } from "lucide-react"
import { SummaryCard } from "@/components/summary-card"
import { mockContractors } from "@/data/mock-contractors"
import { Contractor } from "@/types/contractor"

export default function ContractorsPage() {
  const [contractors] = useState<Contractor[]>(mockContractors)

  const getComplianceIcon = (compliance: Contractor['sla_compliance']) => {
    switch (compliance) {
      case 'excellent':
        return <Award className="h-4 w-4 text-muted-foreground" />
      case 'good':
        return <Shield className="h-4 w-4 text-muted-foreground" />
      case 'fair':
        return <AlertTriangle className="h-4 w-4 text-muted-foreground" />
      case 'poor':
        return <AlertTriangle className="h-4 w-4 text-muted-foreground" />
      default:
        return <CheckCircle className="h-4 w-4 text-muted-foreground" />
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
                    <div className="flex items-center gap-2">
                      {getComplianceIcon(contractor.sla_compliance)}
                      <span className="text-sm font-medium capitalize">{contractor.sla_compliance}</span>
                    </div>
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
                    <div className="flex items-center gap-2">
                      {getComplianceIcon(contractor.sla_compliance)}
                      <span className="text-sm font-medium capitalize">{contractor.sla_compliance}</span>
                    </div>
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
    </div>
  )
}


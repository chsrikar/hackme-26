import React, { useState } from 'react';
import { BarChart3, TrendingUp, AlertTriangle, Utensils, Calendar } from 'lucide-react';
import PageWrapper from '../components/layout/PageWrapper';
import AttendanceChart from '../components/reports/AttendanceChart';
import PassFrequencyTable from '../components/reports/PassFrequencyTable';
import FoodStatsCard from '../components/reports/FoodStatsCard';
import ExportButton from '../components/reports/ExportButton';
import {
  MOCK_REPORT_TRENDS,
  MOCK_PASS_FREQUENCY_REPORT,
  MOCK_FOOD_DEMAND_TREND
} from '../data/mockRoster';

export default function ReportsPage() {
  const [selectedDayTab, setSelectedDayTab] = useState('both');

  const attendanceExportData = MOCK_REPORT_TRENDS.map((t) => ({
    Date: t.date,
    PresentCount: t.present,
    AbsentCount: t.absent,
    CheckInRate: `${t.rate}%`
  }));

  const passExportData = MOCK_PASS_FREQUENCY_REPORT.map((p) => ({
    Team: p.team,
    Participant: p.participant,
    BadgeCode: p.rollNo,
    Washroom: p.washroom,
    FoodPickup: p.food,
    RestBreak: p.rest,
    LeftVenue: p.leftVenue,
    TotalPasses: p.total
  }));

  const foodExportData = MOCK_FOOD_DEMAND_TREND.map((f) => ({
    TimeInterval: f.time,
    OrdersPlaced: f.orders,
    Delivered: f.delivered
  }));

  return (
    <PageWrapper>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Page Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 800 }}>Hackathon Analytics & Reports</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.92rem', marginTop: '2px' }}>
              Attendance velocity, movement pass abuse detection, and midnight catering demand curves.
            </p>
          </div>
        </div>

        {/* Section 1: Attendance Trends across Hackathon Days */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">
                <TrendingUp size={18} style={{ color: 'var(--color-primary)' }} />
                <span>Attendance & Check-In Velocity</span>
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Cohort active check-in percentage across event milestones
              </p>
            </div>

            <ExportButton
              data={attendanceExportData}
              filename="hackathon_attendance_trends.csv"
              label="Export Attendance CSV"
            />
          </div>

          <AttendanceChart data={MOCK_REPORT_TRENDS} />
        </div>

        {/* Section 2: Pass Frequency by Type & Team */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">
                <AlertTriangle size={18} style={{ color: 'var(--status-warning-solid)' }} />
                <span>Pass Frequency & Late-Night Left-Venue Patterns</span>
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Flags teams with frequent movement or multiple Left-Venue passes for safety check-ins
              </p>
            </div>

            <ExportButton
              data={passExportData}
              filename="hackathon_pass_frequency_by_team.csv"
              label="Export Passes CSV"
            />
          </div>

          <PassFrequencyTable data={MOCK_PASS_FREQUENCY_REPORT} />
        </div>

        {/* Section 3: Food Request Volume Over Time */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div>
              <h3 className="admin-card-title">
                <Utensils size={18} style={{ color: '#3b82f6' }} />
                <span>Midnight Catering & Beverage Demand Curve</span>
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Hourly meal order fulfillment showing midnight snack & 3 AM coffee rushes
              </p>
            </div>

            <ExportButton
              data={foodExportData}
              filename="hackathon_food_demand_volume.csv"
              label="Export Food Demand CSV"
            />
          </div>

          <FoodStatsCard data={MOCK_FOOD_DEMAND_TREND} />
        </div>
      </div>
    </PageWrapper>
  );
}

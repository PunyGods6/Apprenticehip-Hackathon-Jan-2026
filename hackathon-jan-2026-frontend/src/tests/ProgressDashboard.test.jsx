import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ProgressDashboard from '../components/ProgressDashboard';

describe('ProgressDashboard', () => {
  describe('Calculation Tests - Total OTJ Hours', () => {
    it('should display total OTJ hours correctly', () => {
      const entries = [
        { isOffTheJob: true, totalHours: 2, date: '2026-01-20' },
        { isOffTheJob: true, totalHours: 3, date: '2026-01-21' },
        { isOffTheJob: false, totalHours: 5, date: '2026-01-22' },
      ];

      render(
        <ProgressDashboard
          totalOTJHours={5}  // 2 + 3
          entries={entries}
          weeklyTarget={6}
          totalTarget={312}
        />
      );

      expect(screen.getByText('5.0h')).toBeInTheDocument();
    });

    it('should handle zero OTJ hours', () => {
      const entries = [];

      render(
        <ProgressDashboard
          totalOTJHours={0}
          entries={entries}
          weeklyTarget={6}
          totalTarget={312}
        />
      );

      // Check in the Total OTJ Hours card specifically
      expect(screen.getByText('Total OTJ Hours')).toBeInTheDocument();
      expect(screen.getByText('of 312h target')).toBeInTheDocument();
    });

    it('should display correct target hours', () => {
      const entries = [];

      render(
        <ProgressDashboard
          totalOTJHours={0}
          entries={entries}
          weeklyTarget={6}
          totalTarget={312}
        />
      );

      expect(screen.getByText('of 312h target')).toBeInTheDocument();
    });
  });

  describe('Calculation Tests - Variance', () => {
    it('should show ahead of target when hours exceed weekly target', () => {
      const entries = [
        { isOffTheJob: true, totalHours: 8, date: '2026-01-20' },
      ];

      render(
        <ProgressDashboard
          totalOTJHours={8}
          entries={entries}
          weeklyTarget={6}
          totalTarget={312}
        />
      );

      // Variance = 8 - 6 = +2h
      expect(screen.getByText('+2.0h')).toBeInTheDocument();
      expect(screen.getByText('Ahead of target!')).toBeInTheDocument();
    });

    it('should show behind target when hours are less than weekly target', () => {
      const entries = [
        { isOffTheJob: true, totalHours: 2, date: '2026-01-20' },
      ];

      render(
        <ProgressDashboard
          totalOTJHours={2}
          entries={entries}
          weeklyTarget={6}
          totalTarget={312}
        />
      );

      // Variance = 2 - 6 = -4h
      expect(screen.getByText('-4.0h')).toBeInTheDocument();
      expect(screen.getByText('Behind target')).toBeInTheDocument();
    });
  });

  describe('Calculation Tests - Progress Percentage', () => {
    it('should calculate progress percentage correctly', () => {
      const entries = [
        { isOffTheJob: true, totalHours: 31, date: '2026-01-20' },
      ];

      render(
        <ProgressDashboard
          totalOTJHours={31}
          entries={entries}
          weeklyTarget={6}
          totalTarget={312}
        />
      );

      // Component displays with 1 decimal place: 9.9%
      expect(screen.getByText(/9\.9%/)).toBeInTheDocument();
    });

    it('should handle 100% completion', () => {
      const entries = [
        { isOffTheJob: true, totalHours: 312, date: '2026-01-20' },
      ];

      render(
        <ProgressDashboard
          totalOTJHours={312}
          entries={entries}
          weeklyTarget={6}
          totalTarget={312}
        />
      );

      // Component displays as 100.0%
      expect(screen.getByText(/100\.0%/)).toBeInTheDocument();
    });
  });

  describe('Display Tests', () => {
    it('should display total entries count', () => {
      const entries = [
        { isOffTheJob: true, totalHours: 2, date: '2026-01-20' },
        { isOffTheJob: true, totalHours: 3, date: '2026-01-21' },
        { isOffTheJob: false, totalHours: 1, date: '2026-01-22' },
      ];

      render(
        <ProgressDashboard
          totalOTJHours={5}
          entries={entries}
          weeklyTarget={6}
          totalTarget={312}
        />
      );

      // Should show 3 total entries
      expect(screen.getByText('3')).toBeInTheDocument();
      // Should show 2 off-the-job entries
      expect(screen.getByText('2 off-the-job')).toBeInTheDocument();
    });

    it('should display weekly target correctly', () => {
      const entries = [];

      render(
        <ProgressDashboard
          totalOTJHours={0}
          entries={entries}
          weeklyTarget={6}
          totalTarget={312}
        />
      );

      expect(screen.getByText('Target: 6h/week')).toBeInTheDocument();
    });
  });

  describe('Holiday Mode Integration', () => {
    it('should show neutral state when holiday mode is enabled', () => {
      const entries = [
        { isOffTheJob: true, totalHours: 2, date: '2026-01-20' },
      ];

      render(
        <ProgressDashboard
          totalOTJHours={2}
          entries={entries}
          weeklyTarget={6}
          totalTarget={312}
          holidayMode={true}
        />
      );

      // Should show holiday icon instead of warning
      expect(screen.getByText('🏖️')).toBeInTheDocument();
      // Should show "On holiday" instead of "Behind target"
      expect(screen.getByText('On holiday')).toBeInTheDocument();
      // Should show em dash instead of variance hours
      expect(screen.getByText('—')).toBeInTheDocument();
    });

    it('should show normal variance when holiday mode is disabled', () => {
      const entries = [
        { isOffTheJob: true, totalHours: 2, date: '2026-01-20' },
      ];

      render(
        <ProgressDashboard
          totalOTJHours={2}
          entries={entries}
          weeklyTarget={6}
          totalTarget={312}
          holidayMode={false}
        />
      );

      // Should show warning icon
      expect(screen.getByText('⚠️')).toBeInTheDocument();
      // Should show negative variance
      expect(screen.getByText('-4.0h')).toBeInTheDocument();
      expect(screen.getByText('Behind target')).toBeInTheDocument();
    });

    it('should not penalize for being behind target when on holiday', () => {
      const entries = [
        { isOffTheJob: true, totalHours: 0, date: '2026-01-20' },
      ];

      render(
        <ProgressDashboard
          totalOTJHours={0}
          entries={entries}
          weeklyTarget={6}
          totalTarget={312}
          holidayMode={true}
        />
      );

      // Should NOT show "Behind target"
      expect(screen.queryByText('Behind target')).not.toBeInTheDocument();
      // Should show "On holiday" instead
      expect(screen.getByText('On holiday')).toBeInTheDocument();
    });
  });
});

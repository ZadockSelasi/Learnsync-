/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminRoute } from './components/AdminRoute';
import { Layout } from './components/Layout';
import { AdminLayout } from './components/AdminLayout';

// Pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Onboarding from './pages/Onboarding';
import Dashboard from './pages/Dashboard';
import Roadmap from './pages/Roadmap';
import Quiz from './pages/Quiz';
import Flashcards from './pages/Flashcards';
import Planner from './pages/Planner';
import Chatbot from './pages/Chatbot';
import Settings from './pages/Settings';
import CareerHub from './pages/CareerHub';
import CareerProfile from './pages/CareerProfile';
import CareerOpportunities from './pages/CareerOpportunities';
import CareerCompanies from './pages/CareerCompanies';
import CVBuilder from './pages/CVBuilder';
import SkillGapAnalysis from './pages/SkillGapAnalysis';
import StickyNotes from './pages/StickyNotes';
import CompanyRegistration from './pages/CompanyRegistration';

// Admin Pages
import AdminUsers from './pages/admin/AdminUsers';
import AdminPerformance from './pages/admin/AdminPerformance';
import AdminCompanies from './pages/admin/AdminCompanies';

export default function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="study-buddy-theme">
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/company/register" element={<CompanyRegistration />} />
            
            {/* Protected Routes */}
            <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/roadmap" element={<Roadmap />} />
              <Route path="/planner" element={<Planner />} />
              <Route path="/quiz" element={<Quiz />} />
              <Route path="/flashcards" element={<Flashcards />} />
              <Route path="/chat" element={<Chatbot />} />
              <Route path="/career" element={<CareerHub />} />
              <Route path="/career/profile" element={<CareerProfile />} />
              <Route path="/career/opportunities" element={<CareerOpportunities />} />
              <Route path="/career/companies" element={<CareerCompanies />} />
              <Route path="/career/cv-builder" element={<CVBuilder />} />
              <Route path="/career/skill-gap" element={<SkillGapAnalysis />} />
              <Route path="/notes" element={<StickyNotes />} />
              <Route path="/settings" element={<Settings />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<AdminRoute><AdminLayout /></AdminRoute>}>
              <Route path="/admin" element={<Navigate to="/admin/users" replace />} />
              <Route path="/admin/users" element={<AdminUsers />} />
              <Route path="/admin/performance" element={<AdminPerformance />} />
              <Route path="/admin/companies" element={<AdminCompanies />} />
              <Route path="/admin/settings" element={<Settings />} />
            </Route>

            {/* Onboarding Route (Protected but no Layout) */}
            <Route path="/onboarding" element={<ProtectedRoute><Onboarding /></ProtectedRoute>} />
            
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

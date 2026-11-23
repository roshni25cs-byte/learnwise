import React, { useState } from 'react';
import Navbar from '../components/layout/Navbar';
import PerformanceSummaryCard from '../components/dashboard/PerformanceSummaryCard';
import DistributionCard from '../components/dashboard/DistributionCard';
import LearningGoalsCard from '../components/dashboard/LearningGoalsCard';
import ActiveModuleBanner from '../components/dashboard/ActiveModuleBanner';
import BloomsActionGrid from '../components/dashboard/BloomsActionGrid';
import AICommandBar from '../components/dashboard/AICommandBar';
import BloomsMasterySidebar from '../components/dashboard/BloomsMasterySidebar';

// Modals
import AIQuestionStudioModal from '../components/modals/AIQuestionStudioModal';
import AnalyticsModal from '../components/modals/AnalyticsModal';
import ExamInterfaceModal from '../components/modals/ExamInterfaceModal';
import AdminApprovalModal from '../components/modals/AdminApprovalModal';

export default function DashboardPage() {
  const [isAIStudioOpen, setIsAIStudioOpen] = useState(false);
  const [isAnalyticsOpen, setIsAnalyticsOpen] = useState(false);
  const [isExamOpen, setIsExamOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedBloomLevel, setSelectedBloomLevel] = useState(null);

  const handleBloomSelect = (bloomItem) => {
    setSelectedBloomLevel(bloomItem);
    setIsAIStudioOpen(true);
  };

  const handleQuickPrompt = (prompt, level) => {
    setSelectedBloomLevel({ level });
    setIsAIStudioOpen(true);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Soft Organic Tech Aesthetics matching uploaded image */}
      <div className="absolute top-10 left-10 w-96 h-96 rounded-full bg-emerald-200/30 blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-cyan-200/40 blur-3xl pointer-events-none -z-10"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full bg-blue-100/30 blur-3xl pointer-events-none -z-10"></div>

      {/* Main Container / Laptop Frame Aesthetic matching the user's uploaded mockup */}
      <div className="w-full max-w-[1440px] organic-laptop-frame rounded-[2.5rem] p-6 sm:p-8 backdrop-blur-xl border border-white/80 transition-all duration-300">
        
        {/* Top Header / Navigation Bar matching UI mockup */}
        <Navbar
          onOpenAIStudio={() => setIsAIStudioOpen(true)}
          onOpenAnalytics={() => setIsAnalyticsOpen(true)}
          onOpenAdmin={() => setIsAdminOpen(true)}
        />

        {/* 3-Column Modern Academic Layout exactly matching the user's uploaded screenshot */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* LEFT COLUMN (4 of 12 cols on desktop) */}
          <div className="lg:col-span-4 space-y-6">
            <PerformanceSummaryCard onExploreCLO={() => setIsAnalyticsOpen(true)} />
            <DistributionCard onViewDetails={() => setIsAnalyticsOpen(true)} />
            <LearningGoalsCard />
          </div>

          {/* CENTER COLUMN (5 of 12 cols on desktop) */}
          <div className="lg:col-span-5 space-y-6">
            <ActiveModuleBanner onNewAssessment={() => setIsExamOpen(true)} />
            <BloomsActionGrid onSelectLevel={handleBloomSelect} />
            <AICommandBar onQuickPrompt={handleQuickPrompt} />
          </div>

          {/* RIGHT COLUMN (3 of 12 cols on desktop) */}
          <div className="lg:col-span-3 h-full">
            <BloomsMasterySidebar
              onSelectLevel={handleBloomSelect}
              onOpenAnalytics={() => setIsAnalyticsOpen(true)}
            />
          </div>

        </div>

      </div>

      {/* Footer Branding */}
      <div className="mt-4 text-center text-xs text-slate-500 font-medium">
        <p>LearnWise Education Platform • Bloom's Taxonomy Cognitive Mastery Engine • FastAPI & Gemini API</p>
      </div>

      {/* Interactive Modals */}
      <AIQuestionStudioModal
        isOpen={isAIStudioOpen}
        onClose={() => setIsAIStudioOpen(false)}
        initialLevel={selectedBloomLevel}
      />

      <AnalyticsModal
        isOpen={isAnalyticsOpen}
        onClose={() => setIsAnalyticsOpen(false)}
      />

      <ExamInterfaceModal
        isOpen={isExamOpen}
        onClose={() => setIsExamOpen(false)}
        onComplete={(report) => {
          // Can persist report or refresh stats
        }}
      />

      <AdminApprovalModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
      />
    </div>
  );
}

"use client";
import { useState, useEffect, useRef } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const TOUR_KEY = "schedulepro_dashboard_tour_completed";

interface TourStep {
  target: string;
  title: string;
  content: string;
  placement?: "top" | "bottom" | "left" | "right";
}

const steps: TourStep[] = [
  {
    target: "#dashboard-stats",
    title: "Business Performance",
    content: "See your business performance at a glance: revenue, appointments, clients, and completion rate.",
    placement: "bottom",
  },
  {
    target: "#dashboard-appointments",
    title: "Today's Appointments",
    content: "View and manage today's appointments with client and staff details.",
    placement: "top",
  },
  {
    target: "#dashboard-quick-actions",
    title: "Quick Actions",
    content: "Quickly schedule appointments, add clients, or manage your services from here.",
    placement: "left",
  },
  {
    target: "#dashboard-recent-activity",
    title: "Recent Activity",
    content: "Track recent activity and important updates for your business.",
    placement: "left",
  },
];

export default function DashboardTour() {
  const [isActive, setIsActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 });
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window !== "undefined" && !localStorage.getItem(TOUR_KEY)) {
      // Small delay to ensure DOM is ready
      setTimeout(() => setIsActive(true), 1000);
    }
  }, []);

  useEffect(() => {
    if (isActive && currentStep < steps.length) {
      const targetElement = document.querySelector(steps[currentStep].target);
      if (targetElement) {
        const rect = targetElement.getBoundingClientRect();
        const placement = steps[currentStep].placement || "bottom";
        
        let top = 0;
        let left = 0;
        
        switch (placement) {
          case "top":
            top = rect.top - 20;
            left = rect.left + rect.width / 2;
            break;
          case "bottom":
            top = rect.bottom + 20;
            left = rect.left + rect.width / 2;
            break;
          case "left":
            top = rect.top + rect.height / 2;
            left = rect.left - 20;
            break;
          case "right":
            top = rect.top + rect.height / 2;
            left = rect.right + 20;
            break;
        }
        
        setTooltipPosition({ top, left });
        
        // Scroll element into view
        targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [isActive, currentStep]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    handleFinish();
  };

  const handleFinish = () => {
    localStorage.setItem(TOUR_KEY, "true");
    setIsActive(false);
  };

  if (!isActive || currentStep >= steps.length) {
    return null;
  }

  const currentStepData = steps[currentStep];

  return (
    <>
      {/* Overlay */}
      <div
        ref={overlayRef}
        className="fixed inset-0 bg-black/50 z-[9999]"
        onClick={handleSkip}
      >
        {/* Highlight the target element */}
        <div
          className="absolute border-4 border-blue-500 rounded-lg pointer-events-none"
          style={{
            top: tooltipPosition.top - 100,
            left: tooltipPosition.left - 200,
            width: "400px",
            height: "100px",
          }}
        />
      </div>

      {/* Tooltip */}
      <Card
        className="fixed z-[10000] w-80 shadow-lg"
        style={{
          top: tooltipPosition.top,
          left: Math.max(20, Math.min(tooltipPosition.left - 160, window.innerWidth - 340)),
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h3 className="font-semibold text-sm text-blue-600">
                Step {currentStep + 1} of {steps.length}
              </h3>
              <h4 className="font-medium text-base mt-1">{currentStepData.title}</h4>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 -mt-1"
              onClick={handleSkip}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          
          <p className="text-sm text-muted-foreground mb-4">
            {currentStepData.content}
          </p>
          
          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              {currentStep > 0 && (
                <Button variant="outline" size="sm" onClick={handlePrevious}>
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={handleSkip}>
                Skip Tour
              </Button>
              <Button size="sm" onClick={handleNext}>
                {currentStep === steps.length - 1 ? "Finish" : "Next"}
                {currentStep < steps.length - 1 && <ChevronRight className="h-4 w-4 ml-1" />}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </>
  );
}

// components/PageLayout.tsx
import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

interface PageLayoutProps {
  children: ReactNode;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  title?: string;
  subtitle?: string;
  headerActions?: ReactNode;
  underlineColor?: string;
  onNotificationClick?: () => void;
  hideContentTitle?: boolean;
}

function PageLayout({
  children,
  sidebarOpen,
  setSidebarOpen,
  title,
  subtitle,
  headerActions,
  underlineColor,
  onNotificationClick,
  hideContentTitle
}: PageLayoutProps) {
  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 right-10 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 left-20 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" style={{ animationDelay: "2s" }}></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob" style={{ animationDelay: "4s" }}></div>
      </div>

      <Sidebar isOpen={sidebarOpen} />

      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        <Navbar
          onMenuClick={() => setSidebarOpen(!sidebarOpen)}
          pageTitle={title}
          underlineColor={underlineColor || "bg-gradient-to-r from-blue-500 to-purple-600"}
          onNotificationClick={onNotificationClick}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="p-6 md:p-8 max-w-7xl mx-auto w-full">
            {((title && !hideContentTitle) || subtitle || headerActions) && (
              <div className="mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    {title && !hideContentTitle && (
                      <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                        {title}
                      </h1>
                    )}
                    {subtitle && (
                      <p className="text-gray-600 text-lg">{subtitle}</p>
                    )}
                  </div>
                  {headerActions && (
                    <div className="flex-shrink-0">
                      {headerActions}
                    </div>
                  )}
                </div>
              </div>
            )}

            {children}
          </div>
        </main>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
      `}</style>
    </div>
  );
}

export default PageLayout;

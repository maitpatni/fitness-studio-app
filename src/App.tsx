import { useEffect } from "react";
import { HashRouter, Navigate, Route, Routes, useLocation } from "./lib/router";
import { PhoneShell } from "./components/shell";
import { StoreProvider, useStore } from "./lib/store";
import { Login, OnboardingFlow, Splash } from "./pages/Auth";
import { Home } from "./pages/Home";
import { Book, SessionList } from "./pages/Book";
import { SessionDetail } from "./pages/SessionDetail";
import { Training } from "./pages/Training";
import { Progress } from "./pages/Progress";
import { Membership } from "./pages/Membership";
import { Help, Notifications, Profile } from "./pages/Profile";
import { TrainerDetail, Trainers } from "./pages/Trainers";

/** Members must be signed in; a first launch is routed through onboarding. */
function Guard({ children }: { children: React.ReactNode }) {
  const { onboarding } = useStore();
  if (!onboarding.signedIn) return <Navigate to="/login" replace />;
  if (!onboarding.completed) return <Navigate to="/onboarding" replace />;
  return <>{children}</>;
}

function SplashGate() {
  const { onboarding } = useStore();
  return onboarding.completed ? <Home /> : <Splash />;
}

function ScrollTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [pathname]);
  return null;
}

function AppRoutes() {
  return (
    <>
      <ScrollTop />
      <Routes>
        <Route path="/splash" element={<Splash />} />
        <Route path="/login" element={<Login />} />
        <Route path="/onboarding" element={<OnboardingFlow />} />
        <Route
          path="/"
          element={
            <Guard>
              <SplashGate />
            </Guard>
          }
        />
        <Route
          path="/sessions"
          element={
            <Guard>
              <SessionList />
            </Guard>
          }
        />
        <Route
          path="/session/:id"
          element={
            <Guard>
              <SessionDetail />
            </Guard>
          }
        />
        <Route
          path="/book"
          element={
            <Guard>
              <Book />
            </Guard>
          }
        />
        <Route
          path="/training"
          element={
            <Guard>
              <Training />
            </Guard>
          }
        />
        <Route
          path="/progress"
          element={
            <Guard>
              <Progress />
            </Guard>
          }
        />
        <Route
          path="/membership"
          element={
            <Guard>
              <Membership />
            </Guard>
          }
        />
        <Route
          path="/profile"
          element={
            <Guard>
              <Profile />
            </Guard>
          }
        />
        <Route
          path="/notifications"
          element={
            <Guard>
              <Notifications />
            </Guard>
          }
        />
        <Route
          path="/help"
          element={
            <Guard>
              <Help />
            </Guard>
          }
        />
        <Route
          path="/trainers"
          element={
            <Guard>
              <Trainers />
            </Guard>
          }
        />
        <Route
          path="/trainers/:id"
          element={
            <Guard>
              <TrainerDetail />
            </Guard>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <PhoneShell>
        <HashRouter>
          <AppRoutes />
        </HashRouter>
      </PhoneShell>
    </StoreProvider>
  );
}

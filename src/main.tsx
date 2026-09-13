import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppProvider } from "./context";
import { Layout } from "./components/Layout";
import Home from "./pages/Home";
import Tracker from "./pages/Tracker";
import Calendar from "./pages/Calendar";
import MindMap from "./pages/MindMap";
import Insights from "./pages/Insights";
import Focus from "./pages/Focus";
import Learn from "./pages/Learn";
import Sources from "./pages/Sources";
import Reset from "./pages/Reset";
import Problems from "./pages/Problems";
import ProblemDetail from "./pages/ProblemDetail";
import NotFound from "./pages/NotFound";
import Settings from "./pages/Settings";
import Auth from "./pages/Auth";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/tracker" element={<Tracker />} />
            <Route path="/mind-map" element={<MindMap />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/focus" element={<Focus />} />
            <Route path="/learn" element={<Learn />} />
            <Route path="/sources" element={<Sources />} />
            <Route path="/reset" element={<Reset />} />
            <Route path="/problems" element={<Problems />} />
            <Route path="/problems/:id" element={<ProblemDetail />} />
            <Route path="/settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>
);

"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase";
import AnnouncementBar from "@/components/landing/AnnouncementBar";
import Nav from "@/components/landing/Nav";
import Hero from "@/components/landing/Hero";
import QuizLead from "@/components/landing/QuizLead";
import Stats from "@/components/landing/Stats";
import Problem from "@/components/landing/Problem";
import Features from "@/components/landing/Features";
import ProductTour from "@/components/landing/ProductTour";
import SocialProof from "@/components/landing/SocialProof";
import Pricing from "@/components/landing/Pricing";
import FAQ from "@/components/landing/FAQ";
import CTAFinal from "@/components/landing/CTAFinal";
import Footer from "@/components/landing/Footer";
import CookieBanner from "@/components/landing/CookieBanner";
import ChatWidget from "@/components/landing/ChatWidget";

export default function LandingPage() {
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    if (window.location.search.includes("preview=1")) return;
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) router.replace("/dashboard");
    });
  }, []);

  return (
    <>
      <AnnouncementBar />
      <Nav />
      <main>
        <Hero />
        <QuizLead />
        <Problem />
        <Features />
        <ProductTour />
        <SocialProof />
        <Pricing />
        <FAQ />
        <CTAFinal />
        <Footer />
      </main>
      <CookieBanner />
      <ChatWidget />
    </>
  );
}

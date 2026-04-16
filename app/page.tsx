"use client";

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
import ExitIntent from "@/components/landing/ExitIntent";
import ChatWidget from "@/components/landing/ChatWidget";

export default function LandingPage() {
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
      <ExitIntent />
      <ChatWidget />
    </>
  );
}

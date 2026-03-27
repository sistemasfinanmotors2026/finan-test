"use client";
import Hero from "../components/Hero";
import Benefits from "../components/Benefits";
import FormSection from "../components/FormSection";
import Footer from "../components/Footer";
import { Mail } from "lucide-react";
import Divider from "../components/Divider";

export default function TrabajaPage() {
  return (
    <main className="bg-gray-50">
      <Hero />
      <Benefits />
      <Divider Icon={Mail} />
      <FormSection />
      <Footer />
    </main>
  );
}
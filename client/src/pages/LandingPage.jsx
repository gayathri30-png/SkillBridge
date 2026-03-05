import React from 'react';
import Navbar from '../components/landing/Navbar';
import HeroSection from '../components/landing/HeroSection';
import HowItWorks from '../components/landing/HowItWorks';
import AIFeatures from '../components/landing/AIFeatures';
import Pricing from '../components/landing/Pricing';
import CTASection from '../components/landing/CTASection';
import Footer from '../components/landing/Footer';

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-white font-sans text-gray-900 selection:bg-blue-100 selection:text-blue-900">
            <Navbar />
            <HeroSection />
            <HowItWorks />
            <AIFeatures />
            <Pricing />
            <CTASection />
            <Footer />
        </div>
    );
};

export default LandingPage;

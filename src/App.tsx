import { Routes, Route } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import WhatsAppButton from './components/layout/WhatsAppButton';

// Page Imports
import HomePage from './pages/HomePage';
import DestinationsPage from './pages/DestinationsPage';
import DestinationDetailPage from './pages/DestinationDetailPage';
import PackagesPage from './pages/PackagesPage';
import PackageDetailPage from './pages/PackageDetailPage';
import ActivitiesPage from './pages/ActivitiesPage';
import AboutPage from './pages/AboutPage';
import ContactPage from './pages/ContactPage';
import BuildTourPage from './pages/BuildTourPage';
import CustomTourRequestPage from './pages/CustomTourRequestPage';

export default function App() {
    return (
        <div className="flex flex-col min-h-screen bg-surface-50">
            <Navbar />
            <div className="flex-grow">
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/destinations" element={<DestinationsPage />} />
                    <Route path="/destinations/:slug" element={<DestinationDetailPage />} />
                    <Route path="/packages" element={<PackagesPage />} />
                    <Route path="/packages/:slug" element={<PackageDetailPage />} />
                    <Route path="/activities" element={<ActivitiesPage />} />
                    <Route path="/about" element={<AboutPage />} />
                    <Route path="/contact" element={<ContactPage />} />
                    <Route path="/build-tour" element={<BuildTourPage />} />
                    <Route path="/custom-tour-request" element={<CustomTourRequestPage />} />
                </Routes>
            </div>
            <Footer />
            <WhatsAppButton />
        </div>
    );
}

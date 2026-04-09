import { Suspense } from 'react';
import CotizadorRoute from './CotizadorRoute';
import Footer from '../components/Footer';

export default function Page() {
  return (
    <main className="bg-gray-50 min-h-screen py-10">
      <Suspense fallback={null}>
        <CotizadorRoute />
      </Suspense>
      <Footer />
    </main>
  );
}


import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function DisclaimerPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <h1 className="font-headline text-3xl sm:text-4xl font-bold text-primary mb-8 text-center">Disclaimer</h1>
        <div className="prose prose-lg max-w-none text-foreground/80 space-y-6">
          <p>This disclaimer governs your use of iWills.in website. By using this website, you accept this disclaimer in full. If you disagree with any part of this disclaimer, you must not use this website.</p>

          <h2 className="font-headline text-2xl font-semibold text-primary mt-8">No Professional Advice</h2>
          <p>The information provided on iWills.in is for general informational purposes only. Nothing on this website constitutes professional advice. While we strive to keep the information up to date and correct, we make no representations or warranties of any kind, express or implied, about the completeness, accuracy, reliability, suitability, or availability with respect to the website or the information, products, services, or related graphics contained on the website for any purpose. Any reliance you place on such information is therefore strictly at your own risk.</p>

          <h2 className="font-headline text-2xl font-semibold text-primary mt-6">No Liability</h2>
          <p>In no event will we be liable for any loss or damage including without limitation, indirect or consequential loss or damage, or any loss or damage whatsoever arising from loss of data or profits arising out of, or in connection with, the use of this website.</p>
          
          <h2 className="font-headline text-2xl font-semibold text-primary mt-6">Third-Party Links</h2>
          <p>Through this website, you are able to link to other websites that are not under the control of iWills.in. We have no control over the nature, content, and availability of those sites. The inclusion of any links does not necessarily imply a recommendation or endorse the views expressed within them.</p>

          <h2 className="font-headline text-2xl font-semibold text-primary mt-6">Consultation</h2>
          <p>We strongly advise you to consult with appropriate professionals and/or organizations before taking any action based on the content of this website.</p>

          <h2 className="font-headline text-2xl font-semibold text-primary mt-6">Changes to Disclaimer</h2>
          <p>We reserve the right to modify or amend this disclaimer at any time and for any reason. You should check this page regularly to ensure you are familiar with the current version.</p>

          <h2 className="font-headline text-2xl font-semibold text-primary mt-6">Effective Date</h2>
          <p>This disclaimer is effective as of 6/29/2025.</p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

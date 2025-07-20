
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";

export default function CancellationAndRefundsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <h1 className="font-headline text-3xl sm:text-4xl font-bold text-primary mb-8 text-center">Cancellations and Refund Policy</h1>
        <div className="prose prose-lg max-w-none text-foreground/80 space-y-6">
          <p>At iWills, we strive to provide a seamless and satisfying experience for our users. However, we understand that circumstances may arise where you need to cancel an order or request a refund. Below is our policy regarding cancellations and refunds:</p>

          <h2 className="font-headline text-2xl font-semibold text-primary mt-8">Cancellations</h2>
          <p>If you wish to cancel your order for an online will, please contact our customer support team as soon as possible. We will do our best to accommodate your request, however, please note the following conditions:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>If you cancel your order within 24 hours of placing it, you may be eligible for a refund, provided that the draft will has not been delivered electronically. However, please note that a minimum cancellation charge of Rs. 200 will be levied. Once the draft will has been delivered, no cancellations will be allowed.</li>
            <li>Once the online will creation process has started, cancellations will not be possible, except in cases of technical issues preventing completion or duplicate charges.</li>
          </ul>

          <h2 className="font-headline text-2xl font-semibold text-primary mt-6">Refunds</h2>
          <p>We offer refunds in certain circumstances, including:</p>
           <ul className="list-disc pl-6 space-y-2">
            <li>Technical issues preventing the completion of the will creation process</li>
            <li>Duplicate charges for the same order</li>
           </ul>
          <p>If you believe you are eligible for a refund, please email our team at hello@iWills.in within 24 hours of initiating the will creation process. Refunds will be issued to the original payment method used for the purchase and typically processed within 5-7 working days.</p>

          <h2 className="font-headline text-2xl font-semibold text-primary mt-6">Pricing</h2>
          <p>Please refer to our pricing page for information about the costs associated with our will creation, notarization, and registration services.</p>

          <h2 className="font-headline text-2xl font-semibold text-primary mt-6">Shipping Policy</h2>
          <p>Our services are provided digitally and no shipping is needed.</p>
           <ul className="list-disc pl-6 space-y-2">
            <li>For digital documents, there is no shipping required. The draft will document will be delivered electronically immediately upon completion. If there any expections it will be delivered in 48 hours.</li>
            <li>For wills requiring notarization and registration, the draft will be sent electronically and we will book a slot with you. Please allow 7 to 40 days for scheduling an appointment to either register or notarize your will. Please note that the registration process is subject to the availability of appointments at the registrar's office.</li>
          </ul>

          <h2 className="font-headline text-2xl font-semibold text-primary mt-6">Contact Us</h2>
          <p>If you have any questions or concerns regarding our Cancellations and Refund Policy, please don't hesitate to contact our customer support team:</p>
           <p>
              <strong>Email Us:</strong>{' '}
              <a href="mailto:hello@iwills.in?subject=Inquiry%20from%20iWills.in%20Website" className="text-primary hover:underline">
                hello@iwills.in
              </a>
            </p>
            <p>
              <strong>Phone:</strong>{' '}
              <a href="https://wa.me/918919321064" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                +91-8919321064
              </a>
            </p>
        </div>
      </main>
      <Footer />
    </div>
  );
}

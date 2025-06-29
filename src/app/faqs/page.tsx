"use client";

import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "What is WILL?",
    answer:
      "A WILL is a document whereby a Testator expresses his/her desire as to the disposal of his / her properties after his/her death. It is the declaration of the intention of the person making the WILL with respect to his/her properties, which he/she desires to carried into effect after his/ her death.",
  },
  {
    question: "What is a registered WILL?",
    answer:
      "The duly executed WILL which is registered with the respective Sub-Registrar of Assurances is a Registered WILL.",
  },
  {
    question: "Why should I make a WILL and what happens if I die without one?",
    answer: `
      <ul class="list-disc pl-6 space-y-2">
        <li>In the absence of a WILL, a person's property may pass to unintended person(s).</li>
        <li>A Testator can name the person(s) of his/her choice to whom his/her property should pass on after his/her death.</li>
        <li>Under a Will, the Testator can decide who will be the Executor or the person who will oversee the disposal of the Testator's assets after the Testator's death. In the absence of a WILL, the court appoints an Administrator, who may not be a person of the deceased's choice.</li>
        <li>The Testator can name alternate beneficiaries in the Testator's WILL in the event the main beneficiary also dies with or before the Testator.</li>
      </ul>
    `,
  },
  {
    question: "Who is a Testator?",
    answer: "The Testator is the person who makes his/her own WILL.",
  },
  {
    question: "Who is a Beneficiary and/or a Legatee?",
    answer:
      "Beneficiary/Legatee is the person who receives the benefit/legacies under the WILL.",
  },
  {
    question: "Who is a Legal Heir?",
    answer:
      "A person legally entitled as per the succession laws to inherit the property of a person who dies intestate.",
  },
  {
    question: "What is nomination?",
    answer:
      "To name someone (i.e. Nominee) who can receive the assets of a person in case of his death. In case of bank accounts, flats in co-operative societies, insurance etc. nomination is made. However, in such cases the nominee receives the assets as trustee for the legal heirs of the deceased and as such if the person desires to bequeath such assets to the nominee, it is necessary to make a WILL to the said effect, in addition to the nomination.",
  },
  {
    question: "Who is an Administrator?",
    answer:
      "An Administrator is a person appointed by a court to administer the estate of the deceased person.",
  },
  {
    question: "Who is an Executor?",
    answer:
      "An Executor is a person appointed by a Testator in his/her WILL, to ensure that the directions in the WILL are carried out faithfully. So, Executor means a person to whom the execution of the last WILL of the deceased person is by the Testator's appointment, entrusted. It is left to the sole discretion of the Testator whether to appoint an Executor or not.",
  },
  {
    question: "Who is Witness to a will?",
    answer:
      "A witness to a will is a person who is present when the will is signed and attests to its validity. In India, a will must be witnessed by at least two people who are not beneficiaries of the will. Witnesses should be adults, preferably younger than the will maker, and should not have any personal interest in the will or stand to inherit from it. They should also be reliable, honest, and truthful, and survive the will maker so they can testify if the will is challenged.",
  },
  {
    question: "How do I start creating my will?",
    answer:
      'To create your will, simply visit our website and click on the "Create Your Will" button. Follow the steps provided to fill out the necessary information.',
  },
  {
    question: "What types of properties and assets can be included in a will?",
    answer: `A will allows individuals to specify the distribution of various properties and assets. Some examples include:
      <ul class="list-disc pl-6 space-y-2 mt-4">
        <li>Properties/assets with filed nominations.</li>
        <li>Immovable assets/property like, land/building, shop, office etc.</li>
        <li>Leasehold rights are allowed to be bequeathed in a will.</li>
        <li>Ancestral properties with legally transferred ownership.</li>
        <li>Ownership in a proprietor firm, shares in a company, or share in a partnership firm (subject to conditions).</li>
        <li>Share in a Hindu Undivided Family.</li>
        <li>Properties in foreign countries (subject to foreign laws).</li>
        <li>Personal belongings such as pets, paintings, antiques, electronic items, and intellectual property.</li>
        <li>Descendants' personal wealth, movable and immovable properties, receivables, and liabilities/loans.</li>
      </ul>
      <p class="mt-4">These assets encompass both tangible and intangible items, ensuring comprehensive distribution according to the testator's wishes.</p>
    `,
  },
  {
    question: "What information do I need to provide?",
    answer:
      "You will need to provide personal details such as your name, address, and contact information. Additionally, you will need to list your assets and beneficiaries.",
  },
  {
    question: "Can a proforma WILL be made available to the user?",
    answer:
      "Yes, a proforma WILL will be made available upon completion of the user registration process, logging into the WILL portal and filling up the details in the form provided.",
  },
  {
    question: "When will iWills.in provide an executable WILL to the Testator?",
    answer:
      "Upon receipt of fees upfront and submission of all the mandatory information, we will provide the final executable version of the WILL on the registered e-mail id of the Testator.",
  },
  {
    question: "What makes a valid WILL?",
    answer:
      "Testator should be at least 18 years of age and of sound mind in order to make a WILL. The WILL itself must have directions (without the Testator being forced to give these) for disposal of the Testator's property upon his/her death. After generating the proforma online WILL, it must be signed by the Testator in the presence of at least two persons who must also sign as witnesses to the execution of the WILL.",
  },
  {
    question: "Is there any limit/eligibility criteria required to make a WILL?",
    answer:
      "A Testator must be mentally sound when he/she makes and signs a WILL. A Testator must also be free of undue influence, persuasion or force when the WILL is made.",
  },
  {
    question: "When is a person said to have died Intestate?",
    answer:
      "A person who dies without making a WILL is termed as intestate.",
  },
  {
    question:
      "Whether appointment of an Executor of the Will is compulsory?",
    answer:
      "Law does not require an Executor to be appointed. However, it is advisable to appoint an Executor who should be an independent person, to administer the property under the WILL.",
  },
  {
    question: "Whether a Medical Certificate is required to be obtained or not?",
    answer:
      "Under law, a Medical Certificate is not compulsory. However, it is advisable to obtain a Medical Certificate from a registered medical practitioner so as to ward off any allegation of unsound mind of the Testator.",
  },
  {
    question: "Is Stamp Duty leviable on WILL?",
    answer: "No stamp duty is leviable on a WILL whether registered or unregistered.",
  },
  {
    question: "What is Probate?",
    answer:
      "Probate is an order issued by a court in respect of a WILL, certifying and upholding its genuineness and granting administration to the estate of the Testator.",
  },
  {
    question: "Whether Probate is Compulsory required to be obtained?",
    answer:
      "In the case of Christians, Probate is required to be compulsorily obtained. In the case of Muslims, Probate is not required to be obtained. In the case of Hindus (including Sikhs, Buddhists, Jains) and Parsis, Probate is required to be compulsorily obtained where the WILL is made or the immovable property bequeathed is situated within the territorial jurisdiction of any of the presidency towns viz. Bombay, Calcutta, and Madras.",
  },
  {
    question:
      "Whether Registration of Will with Sub Registrar/Registrar of Assurances is required?",
    answer:
      "Registration of WILL is optional. Such registration by itself will not add any legal force even if the WILL contains immovable property. However, a registered WILL may help in case of challenges in the court of law. Additionally, a copy of the registered WILL can be obtained.",
  },
  {
    question: "Why is registering a Will recommended?",
    answer: `Registering a Will offers an extra layer of assurance, ensuring the Will's legal integrity and safeguarding it. Here’s the rationale behind registering a Will:
      <ul class="list-disc pl-6 space-y-2 mt-4">
        <li>It strengthens the legal evidence of the Will's validity.</li>
        <li>It significantly reduces the potential for disputing the Will's authenticity.</li>
        <li>The Will finds protection in the registrar's office, minimizing the chances of loss or harm.</li>
      </ul>
    `,
  },
  {
    question:
      "What is the difference between Notarising a will and Registering a will?",
    answer: `
      <p class="font-semibold text-primary">Notarised Will:</p>
      <ul class="list-disc pl-6 space-y-2 mt-2">
        <li>Verified and stamped by a Notary Public.</li>
        <li>Provides an additional layer of authenticity.</li>
        <li>The Notary verifies the identity and state of mind of the testator.</li>
        <li>May be subject to challenge in court.</li>
      </ul>
      <p class="font-semibold text-primary mt-4">Registered Will:</p>
      <ul class="list-disc pl-6 space-y-2 mt-2">
        <li>Formally recorded with the Registrar of Assurances.</li>
        <li>Offers stronger legal evidence.</li>
        <li>The Registrar authenticates the identity of the testator and witnesses.</li>
        <li>Typically more difficult to challenge in court.</li>
      </ul>
    `,
  },
  {
    question: "Where will the Original WILL be kept?",
    answer:
      "The original WILL can be kept with the Testator or with any bank or with any other person as desired by the Testator.",
  },
  {
    question: "What will happen to the existing WILL if I make a fresh WILL?",
    answer:
      "On making a fresh WILL, the existing WILL(s) will not be in force/stand canceled.",
  },
  {
    question: "What is Codicil?",
    answer:
      "Codicil means an instrument made in relation to a WILL and explaining, altering, or adding to its disposition, and shall be deemed to form part of the WILL. This instrument represents the latest and updated wish of the Testator as such, and in case of any inconsistency between the WILL and Codicil, the intention recorded in the Codicil will prevail.",
  },
  {
    question: "What if my WILL is lost?",
    answer: "The Testator has to make a fresh WILL.",
  },
  {
    question:
      "When can the witnesses sign the WILL if the said WILL is generated through Online Portal?",
    answer:
      "The Testator needs to take the printout of the online WILL and is required to duly execute (sign) the WILL in the presence of two witnesses and thereafter the two witnesses will sign.",
  },
  {
    question: "Do my Witnesses have to know what is in my WILL?",
    answer:
      "No. The law only requires that two witnesses of sound mind (preferably not the beneficiaries under the WILL) sign the WILL in the presence of the Testator and each other.",
  },
  {
    question: "How can a WILL be revoked or amended?",
    answer:
      "A WILL can be revoked, changed, or altered by the Testator at any time when he/she is competent (essentially of sound mind) to make a WILL. A person can revoke, change, alter his/her WILL by executing a fresh WILL, revoking the earlier WILL, registering the new WILL (if the old WILL is registered), destroying the older WILL, or by making a Codicil.",
  },
  {
    question:
      "Since my spouse and I have all our property in joint names, do I still need a Will?",
    answer:
      "Yes! A WILL covers unforeseen situations like the simultaneous death of the Testator and his/her spouse or any additional property he/she may accumulate that is not jointly held. It is always advisable that both spouses have separate WILLs.",
  },
  {
    question:
      "How many times can I modify my WILL on the Online WILL Portal?",
    answer:
      "The modification of information can be done any number of times before the expiry period of review and before finalization of the WILL, which is 30 days from the registration of your details in the online web portal.",
  },
  {
    question: "Is there any validity period for the WILL?",
    answer: "No, there is no validity period for the WILL as per the applicable law.",
  },
  {
    question: "What are the various types of assets that can be bequeathed?",
    answer:
      "There can be any assets, (movable, immovable, tangible, and intangible) such as flats, jewelry, land, cars, and cash, any transferable right of a valuable nature including his/her share in an HUF property. Even obligations and liabilities can be passed on with the assets. However, a person cannot include those assets which are not legally transferable.",
  },
  {
    question:
      "What will be the Professional Fees charged by iWIll for the online WILL service?",
    answer:
      "Pricing have been provided on the pricing page of the platform.",
  },
  {
    question: "Is the Professional Fee of iWill refundable?",
    answer:
      "Professional Fees only refundable in exceptional scenarios. Please look at the Cancellation and Refund Policy to know more.",
  },
  {
    question:
      "What are the key Indian laws governing succession and inheritance?",
    answer: `In India, succession and inheritance are primarily governed by several key laws. These include:
      <ul class="list-disc pl-6 space-y-2 mt-4">
        <li>The Indian Succession Act, 1925: This act provides a comprehensive framework for the distribution of assets and properties after the death of an individual, including provisions for wills, intestate succession, and testamentary succession.</li>
        <li>The Indian Registration Act, 1908: This act allows a Testator to register their will to ensure their legal validity and enforceability.</li>
        <li>Hindu Personal Laws: Hindu succession is governed by various personal laws, such as the Hindu Succession Act, 1956, which outlines the rules for inheritance among Hindus, Buddhists, Jains, and Sikhs.</li>
        <li>Muslim Personal Laws: Muslim succession is governed by Sharia law principles, which dictate the distribution of assets and properties among heirs according to Islamic law.</li>
      </ul>
    `,
  },
  {
    question:
      "What are the limitations and considerations for a Sunni Mohammedan when making a will?",
    answer: `Sunni Mohammedans have specific guidelines and limitations when making a will. These include:
      <ul class="list-disc pl-6 space-y-2 mt-4">
        <li>A Sunni Mohammedan can only bequeath 1/3rd of their estate by testamentary disposition.</li>
        <li>Bequests of 1/3rd of the estate to non-heirs take effect immediately upon the Testator's death.</li>
        <li>Bequests to heirs require consent from other heirs, regardless of whether they are within 1/3rd of the estate or not.</li>
        <li>Bequests of the entire estate or more than 1/3rd can be made under specific conditions, such as with consent of all heirs, to a sole husband or wife heir, or if the Testator has no heirs.</li>
        <li>Consent for bequests exceeding 1/3rd can only be obtained after the Testator's death.</li>
        <li>Customary law or usage may override these rules for some Mohammedans.</li>
        <li>For assistance with complex will preparations, users can avail offline Will services.</li>
      </ul>
    `,
  },
  {
    question:
      "What are the specific considerations for a Shia Mohammedan when making a will?",
    answer: `Shia Mohammedans have distinct guidelines and considerations when creating a will. These include:
      <ul class="list-disc pl-6 space-y-2 mt-4">
        <li>Limitation to bequeath only 1/3rd of their estate through testamentary disposition.</li>
        <li>Immediate effect of bequests of 1/3rd of the estate to non‑heirs upon the Testator's death.</li>
        <li>Requirement for consent from other heirs for any bequest made to an heir, regardless of whether it is within 1/3rd of the estate or not.</li>
        <li>Conditions for making bequests of the entire estate or more than 1/3rd, such as consent of all heirs, bequests to sole husband or wife heirs, or absence of heirs at the Testator's death.</li>
        <li>Option for obtaining consent from heirs before or after the Testator's death.</li>
        <li>Possibility of customary law or usage governing certain Mohammedans, affecting the applicability of the above rules.</li>
        <li>Availability of offline Will services for assistance with complex will preparations.</li>
      </ul>
    `,
  },
  {
    question:
      "Does being a nominee for assets automatically grant ownership after the asset holder's death?",
    answer:
      "No, being a nominee does not grant ownership rights. Ownership is determined by the deceased's will or succession laws.",
  },
  {
    question: "What role does a nominee play in asset ownership?",
    answer:
      "A nominee acts as a temporary custodian, facilitating the transfer of assets to the rightful heirs as per the will or succession laws.",
  },
  {
    question:
      "Can a nominee claim assets if they are also mentioned in the asset holder's will?",
    answer:
      "No, if a will specifies different beneficiaries, the will's terms take precedence over the nominee designation.",
  },
  {
    question: "Does the law support nominees as rightful owners?",
    answer:
      "No, nominees are not the final owners but assist in the transfer process.",
  },
];

export default function FAQsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <h1 className="font-headline text-3xl sm:text-4xl font-bold text-primary mb-8 text-center">
          Frequently Asked Questions
        </h1>
        <Accordion type="single" collapsible className="w-full">
          {faqs.map((faq, index) => (
            <AccordionItem key={index} value={`item-${index}`}>
              <AccordionTrigger className="text-left font-headline text-lg hover:no-underline">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="prose prose-lg max-w-none text-foreground/80">
                <div dangerouslySetInnerHTML={{ __html: faq.answer }} />
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </main>
      <Footer />
    </div>
  );
}


'use server';
/**
 * @fileOverview An AI-powered assistant for answering questions about Will creation in India.
 *
 * - willAssistant - A function that handles the assistant interaction.
 * - WillAssistantInput - The input type for the willAssistant function.
 * - WillAssistantOutput - The return type for the willAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const WillAssistantInputSchema = z.object({
  query: z.string().describe('The user query or question about Will creation in India.'),
});
export type WillAssistantInput = z.infer<typeof WillAssistantInputSchema>;

const WillAssistantOutputSchema = z.object({
  response: z.string().describe('The AI assistant response to the user query.'),
});
export type WillAssistantOutput = z.infer<typeof WillAssistantOutputSchema>;

export async function willAssistant(input: WillAssistantInput): Promise<WillAssistantOutput> {
  return willAssistantFlow(input);
}

// Extracted and formatted content from the website to be used as a knowledge base for the AI.
const iWillsKnowledgeBase = `
---
**FAQs**

Q: What is WILL?
A: A WILL is a document whereby a Testator expresses his/her desire as to the disposal of his / her properties after his/her death. It is the declaration of the intention of the person making the WILL with respect to his/her properties, which he/she desires to carried into effect after his/ her death.

Q: What is a registered WILL?
A: The duly executed WILL which is registered with the respective Sub-Registrar of Assurances is a Registered WILL.

Q: Why should I make a WILL and what happens if I die without one?
A: 
- In the absence of a WILL, a person's property may pass to unintended person(s).
- A Testator can name the person(s) of his/her choice to whom his/her property should pass on after his/her death.
- Under a Will, the Testator can decide who will be the Executor or the person who will oversee the disposal of the Testator's assets after the Testator's death. In the absence of a WILL, the court appoints an Administrator, who may not be a person of the deceased's choice.
- The Testator can name alternate beneficiaries in the Testator's WILL in the event the main beneficiary also dies with or before the Testator.

Q: Who is a Testator?
A: The Testator is the person who makes his/her own WILL.

Q: Who is a Beneficiary and/or a Legatee?
A: Beneficiary/Legatee is the person who receives the benefit/legacies under the WILL.

Q: Who is a Legal Heir?
A: A person legally entitled as per the succession laws to inherit the property of a person who dies intestate.

Q: What is nomination?
A: To name someone (i.e. Nominee) who can receive the assets of a person in case of his death. In case of bank accounts, flats in co-operative societies, insurance etc. nomination is made. However, in such cases the nominee receives the assets as trustee for the legal heirs of the deceased and as such if the person desires to bequeath such assets to the nominee, it is necessary to make a WILL to the said effect, in addition to the nomination.

Q: Who is an Administrator?
A: An Administrator is a person appointed by a court to administer the estate of the deceased person.

Q: Who is an Executor?
A: An Executor is a person appointed by a Testator in his/her WILL, to ensure that the directions in the WILL are carried out faithfully. So, Executor means a person to whom the execution of the last WILL of the deceased person is by the Testator's appointment, entrusted. It is left to the sole discretion of the Testator whether to appoint an Executor or not.

Q: Who is Witness to a will?
A: A witness to a will is a person who is present when the will is signed and attests to its validity. In India, a will must be witnessed by at least two people who are not beneficiaries of the will. Witnesses should be adults, preferably younger than the will maker, and should not have any personal interest in the will or stand to inherit from it. They should also be reliable, honest, and truthful, and survive the will maker so they can testify if the will is challenged.

Q: How do I start creating my will?
A: To create your will, simply visit our website and click on the "Create Your Will" button. Follow the steps provided to fill out the necessary information.

Q: What types of properties and assets can be included in a will?
A: A will allows individuals to specify the distribution of various properties and assets. Some examples include:
- Properties/assets with filed nominations.
- Immovable assets/property like, land/building, shop, office etc.
- Leasehold rights are allowed to be bequeathed in a will.
- Ancestral properties with legally transferred ownership.
- Ownership in a proprietor firm, shares in a company, or share in a partnership firm (subject to conditions).
- Share in a Hindu Undivided Family.
- Properties in foreign countries (subject to foreign laws).
- Personal belongings such as pets, paintings, antiques, electronic items, and intellectual property.
- Descendants' personal wealth, movable and immovable properties, receivables, and liabilities/loans.
These assets encompass both tangible and intangible items, ensuring comprehensive distribution according to the testator's wishes.

Q: What information do I need to provide?
A: You will need to provide personal details such as your name, address, and contact information. Additionally, you will need to list your assets and beneficiaries.

Q: Can a proforma WILL be made available to the user?
A: Yes, a proforma WILL will be made available upon completion of the user registration process, logging into the WILL portal and filling up the details in the form provided.

Q: When will iWills.in provide an executable WILL to the Testator?
A: Upon receipt of fees upfront and submission of all the mandatory information, we will provide the final executable version of the WILL on the registered e-mail id of the Testator.

Q: What makes a valid WILL?
A: Testator should be at least 18 years of age and of sound mind in order to make a WILL. The WILL itself must have directions (without the Testator being forced to give these) for disposal of the Testator's property upon his/her death. After generating the proforma online WILL, it must be signed by the Testator in the presence of at least two persons who must also sign as witnesses to the execution of the WILL.

Q: Is there any limit/eligibility criteria required to make a WILL?
A: A Testator must be mentally sound when he/she makes and signs a WILL. A Testator must also be free of undue influence, persuasion or force when the WILL is made.

Q: When is a person said to have died Intestate?
A: A person who dies without making a WILL is termed as intestate.

Q: Whether appointment of an Executor of the Will is compulsory?
A: Law does not require an Executor to be appointed. However, it is advisable to appoint an Executor who should be an independent person, to administer the property under the WILL.

Q: Whether a Medical Certificate is required to be obtained or not?
A: Under law, a Medical Certificate is not compulsory. However, it is advisable to obtain a Medical Certificate from a registered medical practitioner so as to ward off any allegation of unsound mind of the Testator.

Q: Is Stamp Duty leviable on WILL?
A: No stamp duty is leviable on a WILL whether registered or unregistered.

Q: What is Probate?
A: Probate is an order issued by a court in respect of a WILL, certifying and upholding its genuineness and granting administration to the estate of the Testator.

Q: Whether Probate is Compulsory required to be obtained?
A: In the case of Christians, Probate is required to be compulsorily obtained. In the case of Muslims, Probate is not required to be obtained. In the case of Hindus (including Sikhs, Buddhists, Jains) and Parsis, Probate is required to be compulsorily obtained where the WILL is made or the immovable property bequeathed is situated within the territorial jurisdiction of any of the presidency towns viz. Bombay, Calcutta, and Madras.

Q: Whether Registration of Will with Sub Registrar/Registrar of Assurances is required?
A: Registration of WILL is optional. Such registration by itself will not add any legal force even if the WILL contains immovable property. However, a registered WILL may help in case of challenges in the court of law. Additionally, a copy of the registered WILL can be obtained.

Q: Why is registering a Will recommended?
A: Registering a Will offers an extra layer of assurance, ensuring the Will's legal integrity and safeguarding it. Here’s the rationale behind registering a Will:
- It strengthens the legal evidence of the Will's validity.
- It significantly reduces the potential for disputing the Will's authenticity.
- The Will finds protection in the registrar's office, minimizing the chances of loss or harm.

Q: What is the difference between Notarising a will and Registering a will?
A: 
Notarised Will:
- Verified and stamped by a Notary Public.
- Provides an additional layer of authenticity.
- The Notary verifies the identity and state of mind of the testator.
- May be subject to challenge in court.

Registered Will:
- Formally recorded with the Registrar of Assurances.
- Offers stronger legal evidence.
- The Registrar authenticates the identity of the testator and witnesses.
- Typically more difficult to challenge in court.

Q: Where will the Original WILL be kept?
A: The original WILL can be kept with the Testator or with any bank or with any other person as desired by the Testator.

Q: What will happen to the existing WILL if I make a fresh WILL?
A: On making a fresh WILL, the existing WILL(s) will not be in force/stand canceled.

Q: What is Codicil?
A: Codicil means an instrument made in relation to a WILL and explaining, altering, or adding to its disposition, and shall be deemed to form part of the WILL. This instrument represents the latest and updated wish of the Testator as such, and in case of any inconsistency between the WILL and Codicil, the intention recorded in the Codicil will prevail.

Q: What if my WILL is lost?
A: The Testator has to make a fresh WILL.

Q: When can the witnesses sign the WILL if the said WILL is generated through Online Portal?
A: The Testator needs to take the printout of the online WILL and is required to duly execute (sign) the WILL in the presence of two witnesses and thereafter the two witnesses will sign.

Q: Do my Witnesses have to know what is in my WILL?
A: No. The law only requires that two witnesses of sound mind (preferably not the beneficiaries under the WILL) sign the WILL in the presence of the Testator and each other.

Q: How can a WILL be revoked or amended?
A: A WILL can be revoked, changed, or altered by the Testator at any time when he/she is competent (essentially of sound mind) to make a WILL. A person can revoke, change, alter his/her WILL by executing a fresh WILL, revoking the earlier WILL, registering the new WILL (if the old WILL is registered), destroying the older WILL, or by making a Codicil.

Q: Since my spouse and I have all our property in joint names, do I still need a Will?
A: Yes! A WILL covers unforeseen situations like the simultaneous death of the Testator and his/her spouse or any additional property he/she may accumulate that is not jointly held. It is always advisable that both spouses have separate WILLs.

Q: How many times can I modify my WILL on the Online WILL Portal?
A: The modification of information can be done any number of times before the expiry period of review and before finalization of the WILL, which is 30 days from the registration of your details in the online web portal.

Q: Is there any validity period for the WILL?
A: No, there is no validity period for the WILL as per the applicable law.

Q: What are the various types of assets that can be bequeathed?
A: There can be any assets, (movable, immovable, tangible, and intangible) such as flats, jewelry, land, cars, and cash, any transferable right of a valuable nature including his/her share in an HUF property. Even obligations and liabilities can be passed on with the assets. However, a person cannot include those assets which are not legally transferable.

Q: What will be the Professional Fees charged by iWIll for the online WILL service?
A: Pricing have been provided on the pricing page of the platform.

Q: Is the Professional Fee of iWill refundable?
A: Professional Fees only refundable in exceptional scenarios. Please look at the Cancellation and Refund Policy to know more.

Q: What are the key Indian laws governing succession and inheritance?
A: In India, succession and inheritance are primarily governed by several key laws. These include:
- The Indian Succession Act, 1925: This act provides a comprehensive framework for the distribution of assets and properties after the death of an individual, including provisions for wills, intestate succession, and testamentary succession.
- The Indian Registration Act, 1908: This act allows a Testator to register their will to ensure their legal validity and enforceability.
- Hindu Personal Laws: Hindu succession is governed by various personal laws, such as the Hindu Succession Act, 1956, which outlines the rules for inheritance among Hindus, Buddhists, Jains, and Sikhs.
- Muslim Personal Laws: Muslim succession is governed by Sharia law principles, which dictate the distribution of assets and properties among heirs according to Islamic law.

Q: What are the limitations and considerations for a Sunni Mohammedan when making a will?
A: Sunni Mohammedans have specific guidelines and limitations when making a will. These include:
- A Sunni Mohammedan can only bequeath 1/3rd of their estate by testamentary disposition.
- Bequests of 1/3rd of the estate to non-heirs take effect immediately upon the Testator's death.
- Bequests to heirs require consent from other heirs, regardless of whether they are within 1/3rd of the estate or not.
- Bequests of the entire estate or more than 1/3rd can be made under specific conditions, such as with consent of all heirs, to a sole husband or wife heir, or if the Testator has no heirs.
- Consent for bequests exceeding 1/3rd can only be obtained after the Testator's death.
- Customary law or usage may override these rules for some Mohammedans.
- For assistance with complex will preparations, users can avail offline Will services.

Q: What are the specific considerations for a Shia Mohammedan when making a a will?
A: Shia Mohammedans have distinct guidelines and considerations when creating a will. These include:
- Limitation to bequeath only 1/3rd of their estate through testamentary disposition.
- Immediate effect of bequests of 1/3rd of the estate to non‑heirs upon the Testator's death.
- Requirement for consent from other heirs for any bequest made to an heir, regardless of whether it is within 1/3rd of the estate or not.
- Conditions for making bequests of the entire estate or more than 1/3rd, such as with consent of all heirs, bequests to sole husband or wife heirs, or absence of heirs at the Testator's death.
- Option for obtaining consent from heirs before or after the Testator's death.
- Possibility of customary law or usage governing certain Mohammedans, affecting the applicability of the above rules.
- Availability of offline Will services for assistance with complex will preparations.

Q: Does being a nominee for assets automatically grant ownership after the asset holder's death?
A: No, being a nominee does not grant ownership rights. Ownership is determined by the deceased's will or succession laws.

Q: What role does a nominee play in asset ownership?
A: A nominee acts as a temporary custodian, facilitating the transfer of assets to the rightful heirs as per the will or succession laws.

Q: Can a nominee claim assets if they are also mentioned in the asset holder's will?
A: No, if a will specifies different beneficiaries, the will's terms take precedence over the nominee designation.

Q: Does the law support nominees as rightful owners?
A: No, nominees are not the final owners but assist in the transfer process.

---
**Pricing**

- Basic Will Creation: ₹999. Includes Standard Will Creation, Do It Yourself, Print and Sign.
- Standard Will with Notarization: ₹2499 (Popular). Includes Standard Will Creation, Notarization, Consultation with Legal Experts.
- Comprehensive Will with Registration: ₹4999. Includes Standard Will Creation, Registration of Will, Consultation with Legal Experts.

---
**Cancellation and Refund Policy**

- Cancellations: If you cancel within 24 hours of placing the order and the draft has not been delivered, you may be eligible for a refund, minus a Rs. 200 cancellation charge. No cancellations are allowed after the draft is delivered or the process has started.
- Refunds: Offered for technical issues or duplicate charges. Contact hello@iWills.in within 24 hours.
- Contact: hello@iwills.in or +91-8919321064.

---
**Terms and Conditions Summary**

- Acceptance: You must be 18+ to use the service.
- Services: We provide an online platform for creating wills, including an interactive questionnaire and will generation.
- Disclaimer: iWills.in is not a substitute for professional legal advice. Consult a qualified legal professional.
- Account: You are responsible for your account security and providing accurate information.
- Fees: Fees for services will be clearly displayed.
- Intellectual Property: All content on iwills.in is our property.
- Liability: Our liability is limited to the maximum extent permitted by law.
- Governing Law: The laws of Telangana, India govern these terms.
- Contact: hello@iwills.in or +91-8919321064.

---
**Privacy Policy Summary**

- Information Collection: We collect personal information (name, email), usage data, and use cookies.
- Use of Information: To personalize your experience, improve our website, process transactions, and communicate with you.
- Data Protection: We use security measures to protect your data, but no method is 100% secure.
- Third-Party Services: We may use third-party services like analytics tools.
- Contact: hello@iwills.in

---
**Disclaimer Summary**

- No Professional Advice: Information on the site is for general purposes only and not professional advice.
- No Liability: We are not liable for any loss or damage from using the website.
- Consultation: We strongly advise consulting with professionals before taking action based on website content.

`;

const prompt = ai.definePrompt({
  name: 'willAssistantPrompt',
  input: {schema: WillAssistantInputSchema},
  output: {schema: WillAssistantOutputSchema},
  prompt: `You are an AI assistant for iWills.in, specializing in Indian Will creation.
Your goal is to answer user queries about creating a Will in India.
Use the following knowledge base, which contains information from the entire iWills.in website, to answer the user's query. Base your answers strictly on this content. If the user asks about something not covered, state that you do not have information on that topic but can answer questions from the provided knowledge base.

---
**Knowledge Base (iwills.in Website Content):**
${iWillsKnowledgeBase}
---

Respond to the following user query:
{{query}}

If the question is complex or requires specific legal advice beyond your capabilities, advise the user to consult with a legal professional or use iWills.in's support channels.
Do not provide financial or investment advice.
Keep responses concise and easy to understand.
`,
});

const willAssistantFlow = ai.defineFlow(
  {
    name: 'willAssistantFlow',
    inputSchema: WillAssistantInputSchema,
    outputSchema: WillAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

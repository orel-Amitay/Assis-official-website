import type { Metadata } from "next";
import {
  Bullet,
  ContactCard,
  DocLink,
  H2,
  LegalPage,
  List,
  Term,
  legalMetadata,
} from "@/components/legal/LegalPage";

export const metadata: Metadata = legalMetadata("EndUserTerms");

export default function EndUserTermsPage() {
  return (
    <LegalPage slug="EndUserTerms">
      <p>
        These End User Terms of Use (&quot;End User Terms&quot;) apply when you interact with a
        business through a customer care service powered or operated by Assis (Website Plugin,
        Website Chat, WhatsApp, Email, or another supported channel).
      </p>
      <p>
        The service is provided by Assis Online Inc. (&quot;Assis&quot;), a U.S.-based company. By
        continuing to use the service, you acknowledge these End User Terms to the extent permitted by
        applicable law.
      </p>
      <p>
        These End User Terms are different from the <DocLink slug="WebsiteTerms" /> (for visitors to
        https://assis.care) and the <DocLink slug="BusinessTerms" /> (for businesses that buy or use
        Assis).
      </p>

      <section className="space-y-4">
        <H2>1. What Assis Does</H2>
        <p>
          Assis provides technology and customer care services to businesses. Your conversation may be
          handled by Assis AI, an Assis representative, a business representative, or a combination of
          these, depending on the business&apos;s plan:
        </p>
        <List spacing="loose">
          <Bullet>
            <Term>Powered by Assis</Term> - Assis provides AI and technology; human assistance may be
            transferred to the business.
          </Bullet>
          <Bullet>
            <Term>Care by Assis</Term> - Assis may also provide human customer care representatives
            and related Care workflows (including tasks and statuses where included).
          </Bullet>
        </List>
        <p>
          Customer interactions may appear and be stored in the Assis platform even when handled by
          the business or its representatives. The fact that an interaction is stored in Assis does
          not necessarily mean it was handled by an Assis representative.
        </p>
      </section>

      <section className="space-y-4">
        <H2>2. AI Conversations</H2>
        <p>
          Assis may use AI to answer questions, provide information, recommend products, assist with
          purchases and support, share order information, identify when human help is needed, and
          perform actions authorized by the business.
        </p>
        <p>
          AI may be incomplete, inaccurate, outdated, or unexpected. Do not rely on AI as professional
          legal, medical, financial, or other professional advice. Where available, you may request
          human assistance.
        </p>
      </section>

      <section className="space-y-4">
        <H2>3. Assis Is Not the Seller</H2>
        <p>
          Unless expressly stated otherwise, Assis is not the seller, manufacturer, supplier,
          distributor, merchant, or Merchant of Record. The business remains responsible for products,
          services, prices, inventory, orders, payments, shipping, returns, exchanges, refunds,
          warranties, and policies. Product or order disputes should be directed to the business.
        </p>
      </section>

      <section className="space-y-4">
        <H2>4. Assis Receives, Stores, and Uses Your Interactions</H2>
        <p>
          When you communicate through an Assis-powered or Assis-operated channel, Assis receives,
          accesses, stores, and processes your communications and related information - whether
          handled by Assis AI, Assis staff, business staff, or a combination.
        </p>
        <p>
          This may include your name, phone number, email, order/product/shipping details, messages,
          images, documents, and other information needed to handle your request. Do not provide
          information you are not authorized to provide. Information may be accessible to Assis and
          the business as needed to provide the service.
        </p>
        <p>
          Assis may use this information to provide and secure the service; maintain history; prevent
          fraud and abuse; perform quality assurance and analytics; improve the product; conduct
          research and development; evaluate, test, train, or fine-tune AI systems where permitted by
          applicable law and Assis&apos;s agreement with the business; and create aggregated or
          de-identified information for lawful purposes.
        </p>
        <p>
          Where Assis processes information solely on behalf of a business as a Processor, Service
          Provider, Contractor, or similar role, that use is also governed by Assis&apos;s agreement
          with the business (including any <DocLink slug="DataProcessingAgreement" />) and applicable
          law.
        </p>
      </section>

      <section className="space-y-4">
        <H2>5. Historical Conversations</H2>
        <p>
          A business may provide Assis with prior customer service conversations and related records,
          and with business knowledge such as products, policies, promotions, coupons, discounts, and
          other updates, so Assis can build a knowledge base and improve support for that business.
          Assis processes such information in accordance with the <DocLink slug="PrivacyPolicy" />,
          applicable law, and Assis&apos;s agreement with the business.
        </p>
      </section>

      <section className="space-y-4">
        <H2>6. Proactive Messages</H2>
        <p>
          On behalf of the business, Assis may send proactive messages based on the business&apos;s
          configuration and instructions, including abandoned cart or incomplete checkout reminders;
          order confirmation or completion messages; shipping, delivery, or tracking updates; return,
          exchange, refund, or cancellation updates; support follow-ups; and other transactional,
          operational, or customer-care messages authorized by the business.
        </p>
        <p>
          Messages may be sent via WhatsApp, Email, Website Chat, Plugin, or other supported channels.
          This does not make Assis the seller. Where a message is marketing or promotional under
          applicable law, the business is responsible for a valid legal basis and for honoring
          applicable opt-outs. Contact the business about marketing preferences.
        </p>
      </section>

      <section className="space-y-4">
        <H2>7. Channels, Access, and Business Reliance</H2>
        <p>
          Assis may operate channels (including WhatsApp) on behalf of a business. Third-party
          platform terms may also apply; Assis is not responsible for third-party outages,
          restrictions, or failures.
        </p>
        <p>
          Authorized Assis personnel, contractors, and providers may access information as reasonably
          needed to provide, support, secure, review, improve, or legally comply regarding the
          service. The business may also access information relating to your interactions with it.
        </p>
        <p>
          Assis may rely on information from the business or connected systems. If that information is
          wrong or outdated, Assis responses may reflect it.
        </p>
      </section>

      <section className="space-y-4">
        <H2>8. Privacy and Rights</H2>
        <p>
          Personal information is processed under the <DocLink slug="PrivacyPolicy" /> and, where
          applicable, the business&apos;s privacy policy. Depending on applicable law, the business
          may determine why and how your information is processed, while Assis processes it on the
          business&apos;s behalf under a Data Processing Agreement or similar terms.
        </p>
        <p>
          Depending on where you live, you may have rights to access, correct, delete, or port
          information, object to or restrict certain processing, withdraw consent where applicable,
          and exercise other privacy rights. Where Assis acts for a business, you may need to contact
          the business; Assis may assist.
        </p>
      </section>

      <section className="space-y-4">
        <H2>9. Acceptable Use</H2>
        <p>
          You may not use the service for illegal activity, fraud, impersonation, threats or
          harassment, malicious content, unauthorized access, bypassing security, interfering with the
          service, or violating intellectual property or privacy rights. Assis or the business may
          restrict or end an interaction for unlawful or abusive behavior.
        </p>
      </section>

      <section className="space-y-4">
        <H2>10. Availability and No Guarantee</H2>
        <p>
          Assis makes reasonable efforts to maintain availability, but interruptions, delays, errors,
          and limits may occur. Assis does not guarantee that every question will be answered
          accurately, every issue resolved, every action completed, that AI will always understand
          you, or that human help will always be immediate. Matters requiring the business&apos;s
          authority may be referred to the business.
        </p>
      </section>

      <section className="space-y-4">
        <H2>11. Intellectual Property</H2>
        <p>
          Assis technology, software, AI systems, interfaces, designs, trademarks, and related
          materials belong to Assis or its licensors. You may not copy, reverse engineer, distribute,
          or commercially exploit them without permission.
        </p>
      </section>

      <section className="space-y-4">
        <H2>12. Limitation of Liability</H2>
        <p>
          To the maximum extent permitted by law, the service is provided &quot;AS IS&quot; and
          &quot;AS AVAILABLE.&quot; Assis is not responsible for the business&apos;s products,
          services, prices, orders, shipping, returns, refunds, warranties, or policies, or for
          inaccurate information from the business or third-party systems.
        </p>
        <p>
          To the maximum extent permitted by law, Assis will not be liable for indirect, incidental,
          special, consequential, or punitive damages arising from your use of the service. Nothing
          here limits consumer rights that cannot lawfully be limited or waived.
        </p>
      </section>

      <section className="space-y-4">
        <H2>13. Changes and Law</H2>
        <p>
          Assis may update these End User Terms. The latest version will be available through the
          service or https://assis.care. Where law requires notice of a material change, Assis will
          provide appropriate notice.
        </p>
        <p>
          Assis provides services internationally. These End User Terms do not waive mandatory
          consumer protections that apply to you.
        </p>
      </section>

      <section className="space-y-4">
        <H2>14. Contact</H2>
        <ContactCard />
      </section>
    </LegalPage>
  );
}

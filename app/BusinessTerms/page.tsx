import type { Metadata } from "next";
import {
  ContactCard,
  DocLink,
  H2,
  H3,
  LegalPage,
  legalMetadata,
} from "@/components/legal/LegalPage";

export const metadata: Metadata = legalMetadata("BusinessTerms");

export default function BusinessTermsPage() {
  return (
    <LegalPage slug="BusinessTerms">
      <p>
        These Business Terms of Service (&quot;Terms&quot;) govern use of Assis services by a
        business, company, organization, or other commercial customer (&quot;Business,&quot;
        &quot;you,&quot; or &quot;your&quot;). Services are provided by Assis Online Inc.
        (&quot;Assis,&quot; &quot;we,&quot; &quot;our,&quot; or &quot;us&quot;), a U.S.-based
        company.
      </p>
      <p>
        By creating an account, purchasing a subscription, connecting an integration, providing
        historical data, authorizing communications, or using Assis, you agree to these Terms and the{" "}
        <DocLink slug="DataProcessingAgreement" />, and represent that you have authority to bind the
        Business.
      </p>
      <p>
        These Terms are different from the <DocLink slug="WebsiteTerms" /> (for website visitors) and
        the <DocLink slug="EndUserTerms" /> (for customers chatting with a business through Assis).
      </p>

      <section className="space-y-4">
        <H2>1. Services</H2>
        <p>
          Assis provides technology and customer care infrastructure for AI, automation, and human
          support. Services may include AI customer service, omnichannel inbox, Website Plugin,
          Website Chat, WhatsApp, Email, Knowledge Base, automation, analytics, integrations,
          proactive communications, onboarding from historical support data, and - under Care by
          Assis - human customer care and related Care workflows such as tasks, questions, statuses,
          and records.
        </p>
        <p>
          The platform enables businesses to centrally receive, view, store, and manage customer
          interactions and related customer, order, product, and shipping information. An interaction
          stored in Assis may be handled by Assis AI, Assis representatives, the Business or its
          representatives, or a combination. Storage in the Assis platform does not necessarily mean
          the interaction was handled by an Assis representative. Task, status, and record-management
          workflows for Assis human care apply under Care by Assis where included.
        </p>
        <p>
          Availability depends on your plan, configuration, permissions, and any commercial
          agreement.
        </p>
      </section>

      <section className="space-y-4">
        <H2>2. Plans</H2>
        <div className="space-y-3">
          <H3>Powered by Assis</H3>
          <p>
            Assis provides technology and AI; the Business manages its own human customer service.
            AI may respond through supported channels based on Business information and the Business
            knowledge base (including products, policies, promotions, coupons, discounts, and updates
            made available to Assis). Human escalations may be transferred to the Business. Assis
            does not assume responsibility for the Business&apos;s human support operations under
            Powered by Assis. Care-specific task/status/record workflows are not part of Powered by
            Assis unless expressly added.
          </p>
        </div>
        <div className="space-y-3">
          <H3>Care by Assis</H3>
          <p>
            Assis provides technology and human customer care. Assis representatives may handle
            support, sales, product/order questions, shipping, returns, exchanges, escalations, and
            related Care workflows - including tasks, questions, statuses, and records - based on
            Business information, policies, instructions, and permissions. If information, approval,
            or Business authority is missing, Assis may transfer the matter to the Business. Care may
            be governed by a separate commercial agreement, which controls in case of conflict.
          </p>
        </div>
      </section>

      <section className="space-y-4">
        <H2>3. Channels</H2>
        <p>
          Assis may operate through Website Plugin, Website Chat, WhatsApp, Email, and other
          supported channels, including operating a WhatsApp number on the Business&apos;s behalf.
          Conversations may move between AI, Assis representatives, and Business representatives.
        </p>
      </section>

      <section className="space-y-4">
        <H2>4. Proactive Customer Communications</H2>
        <p>
          The Business authorizes Assis to send proactive messages to customers and end users on the
          Business&apos;s behalf, according to Business configuration, instructions, integrations,
          and selected services. Examples include abandoned cart or incomplete checkout reminders;
          order confirmation/completion; shipping, delivery, and tracking updates;
          return/exchange/refund/cancellation updates; support follow-ups; and other transactional,
          operational, customer-care, or authorized promotional messages enabled by the Business.
        </p>
        <p>
          Messages may be sent via WhatsApp, Email, Website Chat, Plugin, or other supported
          channels. The Business is responsible for ensuring that it has the rights, notices,
          consents, opt-in/opt-out mechanisms, and legal bases required by applicable law for Assis
          to send such messages on the Business&apos;s behalf (including electronic communications,
          marketing, and messaging-platform rules, which may vary by country and message type).
          Assis operates the messaging infrastructure as configured by the Business and does not
          become the seller or Merchant of Record by sending such messages.
        </p>
      </section>

      <section className="space-y-4">
        <H2>5. Historical Customer Service Conversations and Knowledge Base</H2>
        <p>
          As part of onboarding or connection, Assis may request - and the Business may provide -
          historical customer service conversations and related support records (including chat,
          email, WhatsApp, tickets, and similar materials), as well as business knowledge used to
          build and update a knowledge base (including products, descriptions, prices, inventory,
          policies, promotions, coupons, discounts, and other hot updates). Assis may use this
          information to configure AI and improve support for the Business.
        </p>
        <p>
          The Business represents and warrants that it has all rights, notices, permissions, and
          legal bases required under applicable law to provide such materials to Assis and to
          authorize Assis to process them for these purposes. The Business must not provide data it
          is not lawfully entitled to share.
        </p>
        <p>
          Assis will process historical materials and knowledge-base content in accordance with the{" "}
          <DocLink slug="PrivacyPolicy" />, the <DocLink slug="DataProcessingAgreement" />, and
          applicable law. Access is limited to personnel and providers who need it for onboarding,
          knowledge-base building, service configuration, quality, security, and related support.
          Assis does not acquire ownership of Business Data; Assis receives the rights needed to
          provide and improve the services as described in these Terms and applicable agreements.
        </p>
      </section>

      <section className="space-y-4">
        <H2>6. Business Information, Website Scanning, and Integrations</H2>
        <p>
          The Business must provide accurate, complete, lawful, and sufficiently current information
          needed for the services (products, prices, inventory, policies, promotions, coupons,
          discounts, hot updates, customers, orders, shipping, instructions, CRM/e-commerce data, and
          similar). Assis may rely on Business-supplied information and connected systems.
        </p>
        <p>
          If authorized, Assis may scan or analyze the Business website for Knowledge Base, AI,
          automation, analytics, and care - including product and promotion content. The Business
          represents it has rights to grant that access.
        </p>
        <p>
          The Business may connect systems such as Shopify, WooCommerce, CRM, order management,
          shipping, communications, email, payments, and analytics, and is responsible for having
          rights to do so. Assis is not responsible for inaccurate or unavailable third-party data.
        </p>
      </section>

      <section className="space-y-4">
        <H2>7. AI and Human Representatives</H2>
        <p>
          AI may answer questions, recommend products, assist with sales and support, classify/route
          conversations, perform authorized actions, send or trigger proactive messages, and identify
          when humans are needed. Under Care by Assis, AI and Assis workflows may also create or
          manage tasks, questions, statuses, and records where included. AI may be inaccurate or
          incomplete. Assis does not guarantee error-free AI. The Business is responsible for
          suitable information and for determining fitness for its use case. Assis AI is not
          professional legal, medical, or financial advice.
        </p>
        <p>
          Where human services are included, Assis representatives (employees, contractors, or
          providers) act on available information and permissions. Under Powered by Assis,
          escalations may go to the Business; under Care by Assis, Assis may handle them and related
          Care workflows. The Business remains responsible for decisions requiring Business
          authority.
        </p>
      </section>

      <section className="space-y-4">
        <H2>8. Business Responsibility</H2>
        <p>
          The Business remains responsible for its operations, products and services, prices,
          inventory, promotions, orders, payments, shipping, returns, refunds, warranties, policies,
          information and instructions supplied to Assis, legal compliance, permissions, privacy
          notices to customers, and customer-communications compliance (including proactive and
          marketing messages and any historical data shared with Assis).
        </p>
        <p>
          Unless expressly agreed otherwise, Assis is not the seller, manufacturer, distributor,
          merchant, or Merchant of Record.
        </p>
      </section>

      <section className="space-y-4">
        <H2>9. Assis Access to Customer Interactions</H2>
        <p>
          When customers communicate through Assis-powered or Assis-operated channels, Assis
          receives, stores, and processes those communications and related information as needed to
          provide the services, including quality assurance, analytics, security, and service
          improvement, subject to Section 12, the <DocLink slug="DataProcessingAgreement" />, and
          applicable law. The Business must ensure information and policies provided to Assis are
          suitable for customer communication.
        </p>
      </section>

      <section className="space-y-4">
        <H2>10. Fees, Trials, and Payment</H2>
        <p>
          Services may be subscription-based, usage-based, or under a separate commercial agreement.
        </p>
        <p>
          <span className="font-semibold text-foreground">Powered by Assis</span> - unless otherwise
          agreed, billed monthly. Payments may be processed through Assis&apos;s selected payment
          provider(s). By subscribing, you authorize Assis and its payment provider(s) to charge the
          selected payment method under the presented terms. Cancel anytime to stop future charges
          once effective; unless required by law or agreed in writing, cancellation does not
          automatically refund a paid period.
        </p>
        <p>
          <span className="font-semibold text-foreground">Care by Assis</span> - may be under a
          separate commercial agreement (term, pricing, commitment, notice, scope). That agreement
          controls if it conflicts with these Terms.
        </p>
        <p>
          Failed payments may result in limited or suspended service. Trials and promotions are
          subject to disclosed terms.
        </p>
      </section>

      <section className="space-y-4">
        <H2>11. Privacy and Data Processing</H2>
        <p>
          Assis processes personal information under the <DocLink slug="PrivacyPolicy" /> and the{" "}
          <DocLink slug="DataProcessingAgreement" /> (&quot;DPA&quot;), which is incorporated into
          these Terms. Where required by law (including GDPR), the DPA governs Assis&apos;s
          processing of Customer Personal Data on behalf of the Business. Website cookies and similar
          technologies are described in the <DocLink slug="CookiePolicy" />.
        </p>
        <p>
          The Business is responsible for rights, notices, permissions, consents, and legal bases
          needed to provide personal information to Assis and to authorize processing, knowledge-base
          building from historical conversations, and customer communications (including proactive
          messages). Assis processes personal information only as permitted by applicable law and
          applicable agreements.
        </p>
      </section>

      <section className="space-y-4">
        <H2>12. Use of Data for Improvement and AI</H2>
        <p>
          To the extent permitted by applicable law and the applicable agreement with the Business
          (including the DPA), Assis may use information processed through the services to analyze
          performance, improve care and AI, detect errors, conduct R&amp;D, develop features, test
          and evaluate systems, train or fine-tune AI models, improve security, and create aggregated
          or de-identified information.
        </p>
        <p>
          Where Assis acts as Processor, Service Provider, Contractor, or similar role, use of
          Business Data is subject to the applicable agreement, DPA, and law. Nothing grants Assis
          rights prohibited by law or a binding Assis-Business agreement.
        </p>
      </section>

      <section className="space-y-4">
        <H2>13. Third-Party Services</H2>
        <p>
          Assis may rely on providers such as cloud, hosting, AI, WhatsApp/Meta, email, payment
          providers, analytics, security, CRM, e-commerce, and shipping. They have their own terms.
          Assis is not responsible for third-party outages, API changes, restrictions, or actions
          outside Assis&apos;s control.
        </p>
      </section>

      <section className="space-y-4">
        <H2>14. Intellectual Property</H2>
        <p>
          Assis platform, software, models, algorithms, interfaces, workflows, designs,
          documentation, trademarks, and related technology belong to Assis or its licensors. The
          Business receives a limited right to use the services during the service period; no
          ownership transfers. The Business may not copy, reverse engineer, resell, sublicense, or
          build a competing service from Assis technology. The Business retains rights in Business
          Data, subject to rights Assis needs to provide the services.
        </p>
      </section>

      <section className="space-y-4">
        <H2>15. Acceptable Use</H2>
        <p>
          The Business may not use Assis for unlawful purposes, fraud, impersonation, unlawful
          spam/messaging, harming systems, unauthorized access, bypassing security, violating privacy
          or IP rights, violating platform terms, building a competitor via unauthorized use of
          Assis, or other illegal use. Assis may suspend or restrict use for reasonably suspected
          violations.
        </p>
      </section>

      <section className="space-y-4">
        <H2>16. Availability and No Results Guarantee</H2>
        <p>
          Assis makes reasonable efforts toward availability but does not guarantee uninterrupted or
          error-free service. Assis may modify, suspend, or replace features. Assis does not
          guarantee specific conversations, leads, sales, revenue, ROI, satisfaction, resolution of
          every issue, or accuracy of every AI response.
        </p>
      </section>

      <section className="space-y-4">
        <H2>17. Confidentiality</H2>
        <p>
          Each party will use reasonable measures to protect the other&apos;s non-public business,
          technical, or commercial information and use it only as needed to provide or receive the
          services or as otherwise permitted by law.
        </p>
      </section>

      <section className="space-y-4">
        <H2>18. Indemnification</H2>
        <p>
          To the extent permitted by law, the Business will defend, indemnify, and hold harmless
          Assis and its affiliates, officers, directors, employees, contractors, and providers from
          claims, damages, liabilities, costs, and expenses arising from: Business operations;
          Business products/services; information or instructions supplied by the Business (including
          historical conversations); Business violation of law or third-party rights; breach of these
          Terms or the DPA; claims about products, orders, shipping, refunds, or policies; and claims
          about customer communications sent on the Business&apos;s behalf (including
          proactive/marketing messages) or alleged lack of consent or legal basis.
        </p>
      </section>

      <section className="space-y-4">
        <H2>19. Disclaimer and Limitation of Liability</H2>
        <p>
          To the maximum extent permitted by law, services are &quot;AS IS&quot; and &quot;AS
          AVAILABLE.&quot; Assis does not guarantee uninterrupted, secure, accurate, complete, or
          error-free services.
        </p>
        <p>
          To the maximum extent permitted by law, Assis will not be liable for indirect, incidental,
          special, consequential, exemplary, or punitive damages, or loss of profits, revenue,
          customers, goodwill, data, or opportunities. Assis is not responsible for losses from
          Business information, Business products/services, Business-authorized communications, or
          third-party services.
        </p>
        <p>
          To the maximum extent permitted by law, Assis&apos;s aggregate liability will not exceed
          amounts paid by the Business to Assis in the three months before the claim event. Nothing
          limits liability that cannot lawfully be limited.
        </p>
      </section>

      <section className="space-y-4">
        <H2>20. Suspension, Termination, and Survival</H2>
        <p>
          Assis may suspend or terminate for non-payment, material breach, illegal use, abuse,
          security risk, legal requirement, or significant risk to Assis, the Business, customers, or
          third parties. Care services also follow any commercial agreement. Accrued fees remain due.
          Post-termination data handling follows the applicable agreement, Privacy Policy, DPA, and
          law. IP, confidentiality, indemnification, DPA obligations that should survive, disclaimers,
          and liability limits survive termination.
        </p>
      </section>

      <section className="space-y-4">
        <H2>21. Changes, Law, and General</H2>
        <p>
          Assis may update these Terms and publish a new Last Updated date. Where law requires notice
          of a material change, Assis will provide it. Continued use after updates become effective
          constitutes acceptance, subject to applicable law.
        </p>
        <p>
          As between Assis and the Business, these Terms are governed by California law (excluding
          conflict rules), unless a commercial agreement or mandatory law says otherwise. Subject to
          applicable law, courts in San Francisco County, California have jurisdiction. Mandatory
          non-waivable rights remain.
        </p>
        <p>
          If a provision is unenforceable, the rest remains. These Terms create no partnership, joint
          venture, employment, franchise, or general agency, except that Assis may act as the
          Business&apos;s limited agent solely to send authorized customer communications and operate
          channels as described. A signed commercial agreement controls over these Terms to the
          extent of conflict. The DPA controls over these Terms on data-processing matters to the
          extent of conflict.
        </p>
      </section>

      <section className="space-y-4">
        <H2>22. Contact</H2>
        <ContactCard />
      </section>
    </LegalPage>
  );
}

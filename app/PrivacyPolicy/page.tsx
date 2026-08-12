import type { Metadata } from "next";
import {
  Bullet,
  ContactCard,
  DocLink,
  H2,
  H3,
  LegalPage,
  List,
  Mail,
  Term,
  legalMetadata,
} from "@/components/legal/LegalPage";

export const metadata: Metadata = legalMetadata("PrivacyPolicy");

export default function PrivacyPolicyPage() {
  return (
    <LegalPage slug="PrivacyPolicy">
      <p>
        Assis Online Inc. (&quot;Assis,&quot; &quot;Company,&quot; &quot;we,&quot; &quot;our,&quot; or
        &quot;us&quot;), 28 Geary St STE 650, 585, San Francisco, CA 94108, provides
        customer-support and messaging software and related services.
      </p>
      <p>
        This Privacy Policy explains how we collect, use, share, retain, and protect personal
        information in connection with the Assis platform, website (https://assis.care), apps,
        plugins, integrations, and related services (together, the &quot;Services&quot;).
      </p>
      <p>
        Related documents may also apply: <DocLink slug="CookiePolicy" />;{" "}
        <DocLink slug="WebsiteTerms" />; <DocLink slug="BusinessTerms" /> and{" "}
        <DocLink slug="DataProcessingAgreement" /> (for businesses);{" "}
        <DocLink slug="EndUserTerms" /> (for customers interacting with a business through Assis).
      </p>

      <section className="space-y-4">
        <H2>1. Scope</H2>
        <p>
          This Policy applies when Assis processes personal information through the Services - for
          example when a business connects Assis, when someone visits our website or contacts us, or
          when customer messages and related data are processed through Assis channels (Website
          Plugin, Website Chat, WhatsApp, Email, and other supported channels).
        </p>
        <p>
          Depending on the plan (Powered by Assis or Care by Assis) and settings, an interaction may
          be handled by Assis AI, the business or its representatives, Assis representatives, or a
          combination. Storage of an interaction in Assis does not by itself mean an Assis
          representative handled it.
        </p>
        <p>
          Where Assis processes customer data on behalf of a business, that business&apos;s own
          privacy notice also applies, and many individual requests should be directed to that
          business first. Processing on behalf of businesses is further governed by the{" "}
          <DocLink slug="DataProcessingAgreement" />.
        </p>
      </section>

      <section className="space-y-4">
        <H2>2. Information We Collect</H2>
        <p>Depending on how the Services are used, we may collect and process:</p>

        <div className="space-y-3">
          <H3>Business and account information</H3>
          <p>
            Store or business name, user name, website, email, phone, account identifiers, login
            credentials, roles and permissions, billing and subscription information, plan and
            configuration settings, and similar account data.
          </p>
        </div>

        <div className="space-y-3">
          <H3>Customer and end-user information</H3>
          <p>
            Name, phone, email, shipping or billing address, customer identifiers, and other details
            provided by the customer or made available by the business through Assis or connected
            systems.
          </p>
        </div>

        <div className="space-y-3">
          <H3>Communications and interactions</H3>
          <p>
            Messages, inquiries, responses, conversation content, files and attachments, interaction
            history, channel metadata (such as timestamps or channel type), and related support
            records - including historical conversations a business provides during onboarding to
            configure AI and build a knowledge base.
          </p>
        </div>

        <div className="space-y-3">
          <H3>Orders and transactions</H3>
          <p>
            Order numbers, dates, products, amounts, currency, order status, payment-status
            information, shipping and delivery details, returns, exchanges, refunds, cancellations,
            and similar support-related transaction data.
          </p>
        </div>

        <div className="space-y-3">
          <H3>Catalog and knowledge-base materials</H3>
          <p>
            Product and catalog data, policies, promotions, coupons, discounts, and other business
            materials used to operate the Assis knowledge base and AI responses.
          </p>
        </div>

        <div className="space-y-3">
          <H3>Technical and usage data</H3>
          <p>
            IP address, device and browser information, logs, diagnostics, approximate location
            derived from IP, activity on the website or platform, and similar technical data needed
            to operate and secure the Services.
          </p>
        </div>

        <div className="space-y-3">
          <H3>Cookies and similar technologies</H3>
          <p>
            Data collected through cookies and similar technologies on Assis websites, as described
            in the <DocLink slug="CookiePolicy" />.
          </p>
        </div>

        <div className="space-y-3">
          <H3>Integration and platform data</H3>
          <p>
            Data received from systems a business connects (for example Shopify, WooCommerce, CRM,
            shipping, or messaging providers), including store identifiers, catalog, customer and
            order data, fulfillment data, and events or webhooks.
          </p>
        </div>

        <div className="space-y-3">
          <H3>Direct contact information</H3>
          <p>
            Information submitted through demo or contact forms, emails to Assis, chat on our
            website, and similar sales or support communications.
          </p>
        </div>

        <p>
          We may receive this information from you, from the business using Assis, automatically
          through use of the Services or website, from connected platforms and integrations, or from
          publicly available business sources when a business authorizes knowledge-base features such
          as website scanning.
        </p>
        <p>
          Assis messaging channels are free-text. Content that users or businesses choose to send
          (including unnecessary or sensitive details) may be received and stored as part of
          providing the Services. Please avoid sharing information that is not needed.
        </p>
      </section>

      <section className="space-y-4">
        <H2>3. How We Use Information</H2>
        <p>We use personal information to:</p>
        <List spacing="loose">
          <Bullet>Provide, operate, maintain, authenticate, and secure the Services</Bullet>
          <Bullet>Receive, store, display, route, and manage customer inquiries and history</Bullet>
          <Bullet>
            Enable businesses and their representatives to provide customer care through Assis
          </Bullet>
          <Bullet>
            Provide Assis human care under Care by Assis, including Care workflows (tasks, questions,
            statuses, records) where included
          </Bullet>
          <Bullet>
            Operate Assis AI and automation to understand, classify, respond to, and assist with
            inquiries
          </Bullet>
          <Bullet>
            Build and operate a knowledge base and display relevant order, product, shipping, and
            policy context
          </Bullet>
          <Bullet>
            Send proactive messages on a business&apos;s behalf where configured (for example
            abandoned cart, order or shipping updates, return/refund updates, support follow-ups, and
            other transactional, operational, or authorized promotional messages). The business is
            responsible for ensuring it has the rights, notices, consents, and legal bases required
            for such messages
          </Bullet>
          <Bullet>
            Operate integrations and respond to platform events and webhooks (including e-commerce
            apps such as Shopify). If a platform requires deletion or data-request workflows on
            uninstall or customer request, Assis will handle them under that platform&apos;s rules,
            this Policy, the DPA, and applicable law
          </Bullet>
          <Bullet>Process billing, subscriptions, and business account support</Bullet>
          <Bullet>
            Monitor performance, prevent fraud or abuse, troubleshoot, and improve reliability
          </Bullet>
          <Bullet>
            Analyze usage; research and develop the Services; and improve Assis AI as described in
            Section 4
          </Bullet>
          <Bullet>
            Create aggregated, anonymized, or de-identified information for analytics, security, and
            product improvement
          </Bullet>
          <Bullet>
            Operate the Assis website and measure marketing or analytics as described in the{" "}
            <DocLink slug="CookiePolicy" label="Cookie Policy" />
          </Bullet>
          <Bullet>Comply with law, enforce agreements, and protect rights and safety</Bullet>
        </List>
        <p>
          Assis processes personal information only as permitted by applicable law and applicable
          agreements with businesses.
        </p>
      </section>

      <section className="space-y-4">
        <H2>4. Artificial Intelligence</H2>
        <p>
          Assis uses AI and automated systems as part of the Services. Inquiries may be processed to
          understand and classify them, identify relevant information, generate or suggest responses,
          perform supported actions, route messages, trigger proactive messages, or identify when
          human help may be needed. Further handling depends on the business&apos;s plan and
          settings. AI may produce incomplete or inaccurate results; humans may review interactions
          where applicable.
        </p>
        <p>
          Assis may use conversations, historical support materials, and related service data to
          operate and improve AI features for the business that provided or generated that data (for
          example knowledge-base configuration, response quality, routing, and similar service
          features for that business).
        </p>
        <p>
          Assis may also use aggregated, anonymized, or de-identified information to improve the
          Services and Assis AI more generally.
        </p>
        <p>
          Where Assis acts as processor / service provider for a business, any use of that
          business&apos;s Customer Personal Data for model training or fine-tuning is limited to what
          applicable law and the Assis-business agreement (including the DPA) permit. Assis does not
          claim a broader right to use Customer Personal Data for AI training than those documents
          allow.
        </p>
      </section>

      <section className="space-y-4">
        <H2>5. Roles of Assis and the Business</H2>
        <p>
          When a business uses Assis to process information about its customers, the business
          typically acts as controller (or equivalent), and Assis acts as processor, service
          provider, contractor, or similar role - whether an inquiry is handled by the business,
          Assis AI, Assis representatives, or a combination, and whether messages are reactive or
          proactive.
        </p>
        <p>
          The business should provide appropriate privacy notices to its customers (including at or
          before collection where required by law) and obtain any consents required by law. For
          information Assis processes for its own purposes (for example account administration,
          billing, security, legal compliance, website operations, and, where Assis is an independent
          controller, certain product analytics or AI improvement using permitted data), Assis may
          act as an independent controller.
        </p>
      </section>

      <section className="space-y-4">
        <H2>6. Sharing and Access</H2>
        <p>
          Access is limited based on permissions, roles, and selected services. Information may be
          accessible to the business and its authorized users; Assis personnel who need access to
          operate, support, secure, or improve the Services (including Care representatives where
          applicable); and service providers / subprocessors.
        </p>
        <p>
          We may use service providers for cloud hosting, security and monitoring, communications and
          messaging (including WhatsApp/Meta and email providers), AI and technology services,
          analytics and logging, payment and billing for business subscriptions, e-commerce and other
          integrations, and support tooling. They may process information only as needed to provide
          their services, under appropriate contractual and security requirements.
        </p>
        <p>
          We may also disclose information when required by law or lawful request; to protect rights,
          safety, or security; to detect or investigate fraud, abuse, or security incidents; or in
          connection with a merger, acquisition, financing, reorganization, or sale of assets,
          subject to applicable law.
        </p>
        <p>
          We do not sell personal information for money. Some website analytics or advertising cookies
          may be treated as &quot;sharing&quot; or targeted advertising under certain U.S. state laws
          (including California). Where that applies, available controls are described in the{" "}
          <DocLink slug="CookiePolicy" /> and, where required, on the Website. Assis does not add a
          separate &quot;Do Not Sell&quot; link unless required by how cookies or other tools are
          actually configured.
        </p>
      </section>

      <section className="space-y-4">
        <H2>7. Cookies</H2>
        <p>
          Assis uses cookies and similar technologies on its websites as described in the{" "}
          <DocLink slug="CookiePolicy" />, including categories, purposes, consent where required, and
          how to manage preferences. Cookie practices on the Website should match that Cookie Policy.
        </p>
      </section>

      <section className="space-y-4">
        <H2>8. Retention and Deletion</H2>
        <p>
          We retain information as reasonably necessary to provide the Services, maintain history,
          operate and secure the platform, fulfill contracts, resolve disputes, and comply with law.
          Exact periods may vary; Assis applies the following principles:
        </p>
        <List spacing="loose">
          <Bullet>
            <Term>Account and business profile data</Term> - while the account is active, and for a
            reasonable period after closure or termination as needed for wind-down, disputes,
            security, and legal obligations
          </Bullet>
          <Bullet>
            <Term>Customer conversations and related support records</Term> - according to the
            agreement with the business, operational needs to provide support history, platform
            requirements, and legal or security needs
          </Bullet>
          <Bullet>
            <Term>Billing and subscription records</Term> - for as long as needed for accounting, tax,
            audit, and other legal requirements
          </Bullet>
          <Bullet>
            <Term>Security and system logs</Term> - for a period reasonably needed for security,
            troubleshooting, and compliance
          </Bullet>
          <Bullet>
            <Term>Website and marketing contact data</Term> - while needed to respond to inquiries or
            manage the relationship, and then as needed for legitimate business or legal purposes
          </Bullet>
          <Bullet>
            <Term>Backups</Term> - retained according to Assis backup cycles and overwritten or
            deleted in the ordinary course; deletion from backups may lag live-system deletion
          </Bullet>
        </List>
        <p>
          Businesses may request deletion of information stored in the platform, subject to
          agreements and law. Where Assis processes information on behalf of a business, customer
          access, correction, or deletion requests may need to go to that business first; Assis will
          assist as required.
        </p>
        <p>
          If a business disconnects or uninstalls Assis (including from an e-commerce platform),
          Assis will delete or anonymize related store and customer data within a reasonable period
          consistent with platform requirements, the DPA, backups, security logs, and legal retention
          needs. Some information may be retained where required or permitted by law.
        </p>
      </section>

      <section className="space-y-4">
        <H2>9. Security</H2>
        <p>
          We use technical and organizational measures designed to protect personal information
          against unauthorized access, use, alteration, loss, or disclosure, including access
          controls, encryption in transit and/or at rest where appropriate, monitoring, and
          authentication. No method of transmission or storage is completely secure. If a security
          incident occurs, we will investigate and provide notices where required by law.
        </p>
      </section>

      <section className="space-y-4">
        <H2>10. International Transfers</H2>
        <p>
          Assis is based in the United States. Information may be processed or stored in the United
          States and other countries. Where required (including under GDPR), Assis uses appropriate
          transfer safeguards, which may include Standard Contractual Clauses or other lawful
          mechanisms.
        </p>
      </section>

      <section className="space-y-4">
        <H2>11. Your Rights</H2>
        <p>
          Depending on applicable law and where you live, you may have rights to access, correct,
          delete, or port personal information; restrict or object to certain processing; withdraw
          consent where processing is based on consent; opt out of certain processing or targeted
          advertising; and lodge a complaint with a supervisory authority. Rights are subject to
          legal conditions and exceptions.
        </p>
        <p>
          Requests: <Mail />. We may need to verify identity. If Assis processes your information on
          behalf of a business, contact that business first when required; Assis will assist the
          business as required by law and contract.
        </p>
        <p>
          <Term>EEA / UK (and similar laws):</Term> where Assis is controller, legal bases may include
          contract, legal obligation, legitimate interests, and consent where required. Where Assis
          is processor for a business, that business generally determines the legal basis and
          responds to rights requests, with Assis assistance.
        </p>
        <p>
          <Term>California and other U.S. state laws:</Term> residents may have rights to know,
          access, correct, delete, and not be discriminated against for exercising privacy rights,
          subject to exceptions. Assis does not sell personal information for money. This Policy is
          one part of California compliance; where Assis collects personal information as a business,
          notices at collection and any required opt-out mechanisms must match actual practices. For
          website cookies that may involve &quot;sharing&quot; or targeted advertising, see the{" "}
          <DocLink slug="CookiePolicy" label="Cookie Policy" />.
        </p>
      </section>

      <section className="space-y-4">
        <H2>12. Children</H2>
        <p>
          The Services are not directed to anyone under 18. We do not knowingly collect personal
          information from anyone under 18. If we learn that such information has been collected, we
          will take reasonable steps to delete it.
        </p>
      </section>

      <section className="space-y-4">
        <H2>13. Changes</H2>
        <p>
          We may update this Policy from time to time. The date at the top shows the latest update.
          Where a material change requires notice under applicable law, we will provide appropriate
          notice.
        </p>
      </section>

      <section className="space-y-4">
        <H2>14. Contact</H2>
        <p>For privacy questions or requests:</p>
        <ContactCard />
      </section>
    </LegalPage>
  );
}

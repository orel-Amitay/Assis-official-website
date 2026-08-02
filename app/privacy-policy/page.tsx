import type { Metadata } from "next";
import Link from "next/link";
import AssisLogo from "@/components/AssisLogo";

export const metadata: Metadata = {
  title: "Privacy Policy | Assis",
  description:
    "Privacy Policy for Assis Online Inc. Learn how we collect, use, and protect personal information processed through the Assis platform.",
};

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-full bg-[#f7f8fa]">
      <header className="border-b border-border bg-white/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-5 py-5 sm:px-8">
          <Link href="/" className="inline-flex items-center transition-opacity hover:opacity-80">
            <AssisLogo height={20} />
          </Link>
          <Link
            href="/"
            className="text-sm font-semibold text-assis-blue transition hover:text-assis-blue-deep"
          >
            Back to site
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-12 sm:px-8 sm:py-20">
        <h1 className="font-display text-4xl font-bold tracking-[-0.04em] text-foreground sm:text-5xl">
          Privacy Policy
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">Last Updated: January 2026</p>
        <div className="mt-10 space-y-10 text-[15px] leading-relaxed text-zinc-600 sm:text-base">
          <p>{'Assis Online Inc. ("Assis," "Company," "we," "our," or "us") respects your privacy and is committed to protecting personal information processed through the Assis platform and related services.'}</p>
          <p>{'This Privacy Policy explains what information we collect and process, how we use it, with whom it may be shared, how we protect it, and the rights that may be available to you regarding your personal information.'}</p>
          <section className="space-y-4">
            <h2 className="font-display text-2xl font-bold tracking-[-0.03em] text-foreground">{'1. Scope of This Privacy Policy'}</h2>
            <p>{'This Privacy Policy applies to information processed through the Assis platform and related services, including our website, applications, integrations, communication channels, artificial intelligence ("AI") systems, and automated systems.'}</p>
            <p>{'This Policy applies both to information relating to businesses using Assis and their authorized users, and to information relating to customers and end users whose interactions are received, transmitted, displayed, managed, stored, or handled through the platform.'}</p>
            <p>{'Depending on the plan, services, and settings selected by the business, customer interactions may be handled by the business or its representatives, by Assis representatives, through Assis AI and automated systems, or through a combination of these.'}</p>
            <p>{'This Policy applies to information processed through the platform regardless of who ultimately handles a particular customer interaction.'}</p>
          </section>
          <section className="space-y-4">
            <h2 className="font-display text-2xl font-bold tracking-[-0.03em] text-foreground">{'2. The Assis Platform and Customer Interaction Management'}</h2>
            <p>{'Assis provides a platform that enables businesses to centrally manage customer interactions and inquiries.'}</p>
            <p>{'Customer interactions received through communication channels connected to Assis may appear and be stored within the platform together with related information.'}</p>
            <p>{'Through the platform, businesses may, among other things:'}</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>{'Receive and centralize customer inquiries from communication channels connected to Assis.'}</li>
              <li>{'View and manage messages and interaction history.'}</li>
              <li>{'View relevant information regarding customers, orders, products, and shipments.'}</li>
              <li>{'Allow the business and its authorized representatives to handle customer inquiries.'}</li>
              <li>{'Allow Assis representatives to handle customer inquiries when such service is included in the plan selected by the business.'}</li>
              <li>{'Use Assis AI and automated systems as part of the customer interaction process.'}</li>
              <li>{'Manage tasks, questions, statuses, and records related to customer care.'}</li>
              <li>{'The fact that an interaction appears or is stored within the Assis platform does not necessarily mean that it was handled by an Assis representative.'}</li>
            </ul>
          </section>
          <section className="space-y-4">
            <h2 className="font-display text-2xl font-bold tracking-[-0.03em] text-foreground">{'3. Information We Collect and Process'}</h2>
            <p>{'Depending on how the platform and services are used, we may collect and process the following categories of information:'}</p>
            <p>{'Business and Authorized User Information:'}</p>
            <p>{'Customer and End User Information:'}</p>
            <p>{'Customer Interactions and Communications:'}</p>
            <p>{'Order and Transaction Information:'}</p>
            <p>{'Product and Service Information:'}</p>
            <p>{'Technical and Usage Information:'}</p>
            <p>{'Information from Integrations:'}</p>
            <p>{'Information may be obtained directly from a business or customer, automatically through use of the service, or from systems and integrations connected to Assis by the business.'}</p>
          </section>
          <section className="space-y-4">
            <h2 className="font-display text-2xl font-bold tracking-[-0.03em] text-foreground">{'4. How We Use Information'}</h2>
            <p>{'We may use information to:'}</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>{'Operate the Assis platform and provide our services.'}</li>
              <li>{'Receive, process, display, store, and manage customer inquiries and interactions.'}</li>
              <li>{'Maintain customer interaction and service history.'}</li>
              <li>{'Enable businesses and their representatives to provide customer care through the platform.'}</li>
              <li>{'Provide customer care through Assis representatives when included in the plan selected by the business.'}</li>
              <li>{'Operate Assis AI and automated systems.'}</li>
              <li>{'Display relevant customer, order, product, and related information.'}</li>
              <li>{'Route inquiries, questions, and tasks to the appropriate party.'}</li>
              <li>{'Operate integrations with third-party systems.'}</li>
              <li>{'Secure the platform, prevent misuse, and identify technical issues.'}</li>
              <li>{'Improve performance, reliability, and user experience.'}</li>
              <li>{'Comply with legal, regulatory, and contractual requirements.'}</li>
              <li>{'We do not sell or rent personal information.'}</li>
            </ul>
          </section>
          <section className="space-y-4">
            <h2 className="font-display text-2xl font-bold tracking-[-0.03em] text-foreground">{'5. Artificial Intelligence (AI)'}</h2>
            <p>{'Assis uses artificial intelligence and automated systems as part of its platform and services.'}</p>
            <p>{'Customer inquiries received through communication channels connected to Assis may be processed by Assis AI to understand and classify the inquiry, identify relevant information, generate or suggest responses, perform actions related to handling the inquiry, or route the inquiry to the appropriate party.'}</p>
            <p>{"Depending on the business's selected plan and settings, further handling of an inquiry may be performed through Assis AI, by the business or its representatives, by Assis representatives, or through a combination of these."}</p>
            <p>{'The use of AI and automated systems is subject to this Privacy Policy and applicable law.'}</p>
          </section>
          <section className="space-y-4">
            <h2 className="font-display text-2xl font-bold tracking-[-0.03em] text-foreground">{'6. Who May Access Information'}</h2>
            <p>{'Access to information within the platform is restricted based on relevant permissions, roles, and services.'}</p>
            <p>{"Depending on the business's selected plan and settings, information may be accessible to:"}</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>{'The business.'}</li>
              <li>{'Authorized users and representatives of the business.'}</li>
              <li>{'Assis representatives authorized to provide services or handle customer inquiries.'}</li>
              <li>{'Service providers necessary to operate the platform.'}</li>
            </ul>
            <p>{'We take measures designed to limit access to information to parties that require such access to provide the services or perform their responsibilities.'}</p>
          </section>
          <section className="space-y-4">
            <h2 className="font-display text-2xl font-bold tracking-[-0.03em] text-foreground">{'7. Sharing Information and Service Providers'}</h2>
            <p>{'We may share information or permit it to be processed by service providers when necessary to operate Assis, including providers of cloud infrastructure and hosting, security, communications, technology and AI services, analytics, and integrations.'}</p>
            <p>{'These providers are permitted to access information only as necessary to provide the relevant services and subject to appropriate agreements and safeguards.'}</p>
            <p>{'We may disclose information when required by law, court order, or lawful request from a competent authority.'}</p>
            <p>{'Information may also be transferred in connection with a merger, acquisition, change of control, reorganization, or sale of the Company or its assets, subject to applicable law.'}</p>
          </section>
          <section className="space-y-4">
            <h2 className="font-display text-2xl font-bold tracking-[-0.03em] text-foreground">{'8. Data Retention and Deletion'}</h2>
            <p>{'We retain information for as long as reasonably necessary to provide our services, maintain customer interaction history, operate and secure the platform, fulfill our obligations, and comply with applicable legal requirements.'}</p>
            <p>{'Retention periods may vary depending on the type of information, the services used by the business, our agreement with the business, and applicable legal requirements.'}</p>
            <p>{'Businesses may contact us to request deletion of information, inquiries, or interactions stored within the platform, subject to applicable agreements and law.'}</p>
            <p>{'Customers and end users may request to exercise applicable rights regarding their personal information.'}</p>
            <p>{"Where Assis processes information on behalf of a business, a customer's request to access, correct, or delete personal information may need to be directed to the relevant business. Assis will assist the business in handling such requests in accordance with our applicable obligations."}</p>
            <p>{'Certain information may be retained after a deletion request where required or permitted by law.'}</p>
          </section>
          <section className="space-y-4">
            <h2 className="font-display text-2xl font-bold tracking-[-0.03em] text-foreground">{'9. Data Security'}</h2>
            <p>{'We use technical and organizational measures designed to protect personal information against unauthorized access, use, alteration, loss, or disclosure.'}</p>
            <p>{'These measures may include access controls, permissions, encryption, monitoring, and other security measures as appropriate.'}</p>
            <p>{'However, no method of electronic transmission or storage can guarantee absolute security.'}</p>
            <p>{'In the event of a data security incident, we will investigate and address the incident and provide notifications where required by applicable law.'}</p>
          </section>
          <section className="space-y-4">
            <h2 className="font-display text-2xl font-bold tracking-[-0.03em] text-foreground">{'10. International Data Transfers'}</h2>
            <p>{'Assis is a U.S.-based company, and our services may rely on infrastructure and service providers operating in different countries.'}</p>
            <p>{'As a result, information may be processed or stored outside the country in which the business or customer is located.'}</p>
            <p>{'Where required by applicable law, we take appropriate measures to protect personal information transferred internationally.'}</p>
          </section>
          <section className="space-y-4">
            <h2 className="font-display text-2xl font-bold tracking-[-0.03em] text-foreground">{'11. Roles of Assis and the Business'}</h2>
            <p>{'Depending on the circumstances and applicable law, a business using Assis may act as the data controller ("Controller"), while Assis may act as a data processor ("Processor") or service provider when processing personal information on behalf of that business.'}</p>
            <p>{'This applies regardless of whether an inquiry is handled by the business, its representatives, Assis representatives, Assis AI, or a combination of these.'}</p>
            <p>{'For certain information that we process for our own purposes, such as account administration, billing, security, service management, and legal compliance, Assis may act as an independent Controller as permitted by applicable law.'}</p>
          </section>
          <section className="space-y-4">
            <h2 className="font-display text-2xl font-bold tracking-[-0.03em] text-foreground">{'12. Privacy Rights'}</h2>
            <p>{'Depending on applicable law and your place of residence, you may have certain rights regarding your personal information, including the right to:'}</p>
            <p>{'Request access to your personal information.'}</p>
            <p>{'Request correction of inaccurate personal information.'}</p>
            <p>{'Request deletion of personal information.'}</p>
            <p>{'Request restriction of or object to certain processing, where applicable.'}</p>
            <p>{'Request a copy or portability of your information, where applicable.'}</p>
            <p>{'Withdraw consent where processing is based on consent.'}</p>
            <p>{'Lodge a complaint with a competent data protection authority.'}</p>
            <p>{'These rights may be subject to conditions and exceptions under applicable law.'}</p>
            <p><a href="mailto:accountant@assis.care" className="font-semibold text-assis-blue hover:text-assis-blue-deep">accountant@assis.care</a></p>
          </section>
          <section className="space-y-4">
            <h2 className="font-display text-2xl font-bold tracking-[-0.03em] text-foreground">{'13. European Union and European Economic Area Users'}</h2>
            <p>{'Where the General Data Protection Regulation ("GDPR") applies, Assis will process personal information in accordance with its applicable role as a Controller or Processor.'}</p>
            <p>{'The legal bases for processing may include performance of a contract, compliance with legal obligations, legitimate interests, and consent where required.'}</p>
            <p>{'Where Assis acts as a Processor on behalf of a business, customer requests regarding personal information may need to be directed to the relevant business.'}</p>
          </section>
          <section className="space-y-4">
            <h2 className="font-display text-2xl font-bold tracking-[-0.03em] text-foreground">{'14. California Residents'}</h2>
            <p>{'To the extent California privacy laws apply to particular processing activities, California residents may have rights under applicable law, including the right to know what personal information is collected and to request access to, correction of, or deletion of personal information, as well as the right not to be discriminated against for exercising applicable privacy rights.'}</p>
            <p>{'Assis does not sell personal information.'}</p>
            <p>{'Where additional rights apply under California law, Assis will comply with the requirements applicable to it.'}</p>
          </section>
          <section className="space-y-4">
            <h2 className="font-display text-2xl font-bold tracking-[-0.03em] text-foreground">{"15. Children's Privacy"}</h2>
            <p>{'Assis services are intended for businesses and are not designed for direct use by children.'}</p>
            <p>{'We do not knowingly collect personal information from children in violation of applicable law. If we become aware that such information has been collected or processed in violation of applicable law, we will take appropriate steps to address it.'}</p>
          </section>
          <section className="space-y-4">
            <h2 className="font-display text-2xl font-bold tracking-[-0.03em] text-foreground">{'16. Changes to This Privacy Policy'}</h2>
            <p>{'We may update this Privacy Policy from time to time to reflect changes to our platform, services, technology, or applicable legal requirements.'}</p>
            <p>{'The date of the most recent update will appear at the top of this Privacy Policy.'}</p>
            <p>{'Where a material change requires notice under applicable law, we will provide appropriate notice.'}</p>
          </section>
          <section className="space-y-4">
            <h2 className="font-display text-2xl font-bold tracking-[-0.03em] text-foreground">{'17. Contact Us'}</h2>
            <p>{'For questions, requests, or concerns regarding privacy or personal information, please contact us:'}</p>
            <address className="not-italic rounded-2xl border border-[#dfe3f5] bg-[#eef0fa] px-6 py-7 sm:px-8 sm:py-8">
              <div className="space-y-5 text-[15px] leading-relaxed text-zinc-600 sm:text-base">
                <div className="space-y-1">
                  <p className="font-semibold text-foreground">Assis Online Inc.</p>
                  <p>
                    28 Geary St STE 650, 585
                    <br />
                    San Francisco, CA 94108
                    <br />
                    United States
                  </p>
                </div>
                <div className="space-y-2">
                  <p>
                    <span className="font-semibold text-foreground">Email:</span>{' '}
                    <a
                      href="mailto:accountant@assis.care"
                      className="text-assis-blue transition hover:text-assis-blue-deep"
                    >
                      accountant@assis.care
                    </a>
                  </p>
                  <p>
                    <span className="font-semibold text-foreground">Website:</span>{' '}
                    <a
                      href="https://assis.care"
                      className="text-assis-blue transition hover:text-assis-blue-deep"
                    >
                      https://assis.care
                    </a>
                  </p>
                </div>
              </div>
            </address>
          </section>
        </div>

        <p className="mt-16 text-sm text-muted-foreground">
          © 2026 Assis Online Inc. All rights reserved.
        </p>
      </main>
    </div>
  );
}

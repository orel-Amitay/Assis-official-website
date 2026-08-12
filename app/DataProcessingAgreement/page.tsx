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

export const metadata: Metadata = legalMetadata("DataProcessingAgreement");

export default function DataProcessingAgreementPage() {
  return (
    <LegalPage slug="DataProcessingAgreement">
      <p>
        This Data Processing Agreement (&quot;DPA&quot;) forms part of the{" "}
        <DocLink slug="BusinessTerms" /> (or other commercial agreement between the parties) (the
        &quot;Agreement&quot;) between Assis Online Inc. (&quot;Assis,&quot; &quot;Processor,&quot;
        &quot;we,&quot; or &quot;us&quot;) and the business customer using Assis services
        (&quot;Business,&quot; &quot;Controller,&quot; &quot;you,&quot; or &quot;your&quot;).
      </p>
      <p>
        This DPA applies when Assis processes Customer Personal Data on behalf of the Business in
        connection with the Assis services (including Powered by Assis and Care by Assis). If this DPA
        conflicts with the Agreement on data-processing matters, this DPA controls. Capitalized terms
        not defined here have the meaning in the Agreement or applicable data-protection law.
      </p>

      <section className="space-y-4">
        <H2>1. Roles</H2>
        <p>
          For Customer Personal Data processed to provide the services to the Business, the Business is
          the Controller (or equivalent) and Assis is the Processor (or Service Provider / Contractor
          under applicable U.S. state privacy laws), unless the parties expressly agree otherwise in
          writing.
        </p>
        <p>
          Assis may act as an independent Controller for certain data processed for Assis&apos;s own
          purposes, including account administration, billing, security, fraud prevention, service
          operations, legal compliance, website analytics, and - where permitted by applicable law and
          the Agreement - product analytics and AI improvement using permitted data. Such
          Assis-controller processing is described in the <DocLink slug="PrivacyPolicy" /> and{" "}
          <DocLink slug="CookiePolicy" /> and is outside the Processor obligations in this DPA, except
          where mandatory law says otherwise.
        </p>
      </section>

      <section className="space-y-4">
        <H2>2. Subject Matter and Details of Processing</H2>
        <p>
          <Term>Subject matter:</Term> provision of Assis customer-care technology and related
          services.
        </p>
        <p>
          <Term>Duration:</Term> for the term of the Agreement and any post-termination period
          required for deletion/return or legal retention.
        </p>
        <p>
          <Term>Nature and purpose:</Term> receiving, storing, organizing, using, transmitting,
          displaying, and otherwise processing Customer Personal Data to provide, secure, support, and
          improve the services as instructed by the Business and permitted by the Agreement and this
          DPA, including:
        </p>
        <List spacing="loose">
          <Bullet>
            Customer messaging and support via Website Plugin, Website Chat, WhatsApp, Email, and other
            supported channels
          </Bullet>
          <Bullet>
            AI and human customer care (depending on plan); under Care by Assis, related Care workflows
            such as tasks, questions, statuses, and records where included
          </Bullet>
          <Bullet>
            Proactive messages authorized by the Business (e.g., abandoned cart, order completion,
            shipping updates, return/refund updates, support follow-ups)
          </Bullet>
          <Bullet>
            Knowledge-base and AI configuration using historical customer service conversations and
            business knowledge provided by the Business (including products, promotions, coupons,
            discounts, policies, and other hot updates)
          </Bullet>
          <Bullet>
            Integrations with Business systems; analytics and quality assurance for the services
          </Bullet>
        </List>
        <p>
          <Term>Types of Customer Personal Data</Term> may include identifiers and contact details;
          communication content; order and shipping information; customer-support history (including
          historical conversations provided by the Business); and other data the Business or end users
          submit through the services. Business knowledge used for the knowledge base (such as
          products, promotions, coupons, discounts, and updates) may also be processed and may include
          personal data if present.
        </p>
        <p>
          <Term>Data subjects</Term> may include the Business&apos;s customers, prospects, end users,
          and other individuals whose data the Business provides or makes available through the
          services.
        </p>
        <p>
          The Business determines the categories of data it submits. Assis does not decide what
          Customer Personal Data the Business chooses to provide.
        </p>
      </section>

      <section className="space-y-4">
        <H2>3. Business Responsibilities</H2>
        <p>The Business is responsible for ensuring that it:</p>
        <List spacing="loose">
          <Bullet>
            Having a valid legal basis and providing required notices for all Customer Personal Data it
            provides or instructs Assis to process
          </Bullet>
          <Bullet>Ensuring instructions to Assis are lawful</Bullet>
          <Bullet>
            Consents, opt-outs, and compliance for proactive, transactional, and marketing messages
          </Bullet>
          <Bullet>
            Lawful sharing of historical customer service conversations and related records
          </Bullet>
          <Bullet>
            Responding to data-subject requests where the Business is Controller, with Assis assistance
            as described below
          </Bullet>
        </List>
        <p>
          Assis is not liable for processing carried out under the Business&apos;s unlawful
          instructions or for Customer Personal Data provided without a lawful basis.
        </p>
      </section>

      <section className="space-y-4">
        <H2>4. Assis Processing Obligations</H2>
        <p>Assis will:</p>
        <List spacing="loose">
          <Bullet>
            Process Customer Personal Data only on documented instructions from the Business (including
            the Agreement, this DPA, and product configuration/settings), unless required by applicable
            law - in which case Assis will inform the Business unless legally prohibited
          </Bullet>
          <Bullet>
            Ensure persons authorized to process Customer Personal Data are bound by confidentiality
          </Bullet>
          <Bullet>
            Implement appropriate technical and organizational security measures designed to protect
            Customer Personal Data
          </Bullet>
          <Bullet>Respect the conditions for engaging Subprocessors in Section 6</Bullet>
          <Bullet>
            Assist the Business, taking into account the nature of processing, with responding to
            data-subject requests and with security, breach, DPIA, and consultation obligations to the
            extent reasonably possible and required by applicable law
          </Bullet>
          <Bullet>
            At the end of the services involving processing, delete or return Customer Personal Data as
            described in Section 9, unless law requires retention
          </Bullet>
          <Bullet>
            Make available information reasonably necessary to demonstrate compliance with this DPA,
            subject to confidentiality and Section 10
          </Bullet>
        </List>
        <p>
          Assis will not sell Customer Personal Data or process it for purposes prohibited by
          applicable service-provider / processor laws, except as otherwise permitted by this DPA, the
          Agreement, and applicable law.
        </p>
      </section>

      <section className="space-y-4">
        <H2>5. Instructions; Configuration as Instruction</H2>
        <p>
          The Business instructs Assis to process Customer Personal Data as needed to provide the
          services selected and configured by the Business, including AI responses, human care and
          Care workflows where applicable (including tasks, statuses, and records under Care by Assis),
          proactive messaging features the Business enables, integrations the Business connects, and
          knowledge-base building from historical materials and business knowledge (including products,
          promotions, coupons, discounts, and hot updates) the Business provides.
        </p>
        <p>
          If Assis believes an instruction violates applicable data-protection law, Assis will notify
          the Business and may suspend the affected processing until the instruction is clarified or
          corrected.
        </p>
      </section>

      <section className="space-y-4">
        <H2>6. Subprocessors</H2>
        <p>
          The Business authorizes Assis to engage Subprocessors to process Customer Personal Data for
          service delivery (for example: cloud hosting, infrastructure, communications/messaging, AI
          providers, analytics/monitoring, security, customer-support tooling, and similar providers).
        </p>
        <p>
          Assis will impose data-protection terms on Subprocessors no less protective in substance than
          this DPA where required by law. Assis remains responsible for Subprocessor performance
          regarding Customer Personal Data to the extent required by applicable law.
        </p>
        <p>
          Assis may update Subprocessors from time to time as reasonably needed to operate the
          services. Where required by applicable law, Assis will provide a mechanism for the Business
          to obtain information about material Subprocessor changes and to object on reasonable
          data-protection grounds. If the parties cannot resolve a reasonable objection, the Business
          may stop using the affected feature or terminate the affected services as permitted by the
          Agreement.
        </p>
      </section>

      <section className="space-y-4">
        <H2>7. International Transfers</H2>
        <p>
          Assis is based in the United States and may process Customer Personal Data in the United
          States and other countries where Assis or its Subprocessors operate.
        </p>
        <p>
          Where a transfer of Customer Personal Data from the EEA, UK, or Switzerland (or another
          jurisdiction requiring transfer safeguards) requires a transfer mechanism, the parties will
          rely on appropriate safeguards permitted by law (such as Standard Contractual Clauses or
          successor mechanisms). Upon request, Assis will provide or enter into such transfer terms as
          reasonably required for the services.
        </p>
      </section>

      <section className="space-y-4">
        <H2>8. Security and Personal Data Breaches</H2>
        <p>
          Assis maintains technical and organizational measures designed to protect Customer Personal
          Data against unauthorized or unlawful processing and against accidental loss, destruction, or
          damage. Measures may include access controls, encryption in transit and/or at rest where
          appropriate, monitoring, authentication, and personnel/confidentiality controls. No security
          measure is perfect.
        </p>
        <p>
          If Assis becomes aware of a Personal Data Breach affecting Customer Personal Data, Assis will
          notify the Business without undue delay and provide information reasonably available to Assis
          to help the Business meet its notification obligations. Assis will take reasonable steps to
          investigate and mitigate the breach.
        </p>
      </section>

      <section className="space-y-4">
        <H2>9. Return and Deletion</H2>
        <p>
          Upon termination of the services or upon written request, Assis will delete or return
          Customer Personal Data processed as Processor, within a reasonable period, except where
          retention is required by law or needed for security, dispute resolution, or backup cycles (in
          which case Assis will isolate and protect the data until deletion). Aggregated or
          de-identified information that is not personal data may be retained and used by Assis.
        </p>
      </section>

      <section className="space-y-4">
        <H2>10. Audits</H2>
        <p>
          Upon reasonable written request, no more than once per twelve (12) months (unless required by
          a supervisory authority or following a Personal Data Breach), Assis will provide information
          or documentation reasonably necessary to demonstrate compliance with this DPA. On-site
          audits, if required by mandatory law and not reasonably satisfied by documentation, will be
          scheduled on mutually agreed dates, limited to data-protection compliance, and subject to
          confidentiality and Assis&apos;s security policies. The Business bears its own audit costs
          unless Assis is shown to be in material breach of this DPA.
        </p>
      </section>

      <section className="space-y-4">
        <H2>11. AI, Analytics, and De-identified Data</H2>
        <p>
          To the extent permitted by applicable law and the Agreement, Assis may: (a) create
          aggregated, anonymized, or de-identified information from processing activities and use it
          for analytics, security, benchmarking, product development, and AI development, evaluation,
          training, or fine-tuning; and (b) where Assis acts as Processor, use Customer Personal Data to
          provide, maintain, secure, and improve the services for the Business, including quality
          assurance and model improvement, training, or fine-tuning as permitted by the Agreement and
          applicable service-provider/processor rules.
        </p>
        <p>
          Where a specific use requires Assis to act as Controller or requires additional Business
          authorization under mandatory law, Assis will do so only as permitted by law and the Privacy
          Policy / Agreement.
        </p>
      </section>

      <section className="space-y-4">
        <H2>12. Historical Conversations</H2>
        <p>
          If the Business provides historical customer service conversations, related records, or
          business knowledge (including products, promotions, coupons, discounts, policies, and other
          hot updates), the Business instructs Assis to process them to build a knowledge base,
          configure AI, and improve support for the Business. Assis will apply the confidentiality,
          security, Subprocessor, and deletion terms of this DPA to such materials when they contain
          Customer Personal Data.
        </p>
      </section>

      <section className="space-y-4">
        <H2>13. Liability and Order of Precedence</H2>
        <p>
          Liability arising from this DPA is subject to the limitations and exclusions in the
          Agreement, to the maximum extent permitted by applicable law. Nothing in this DPA limits
          liability that cannot lawfully be limited.
        </p>
        <p>
          Order of precedence on data-processing matters: (1) mandatory law; (2) this DPA (and any SCCs
          or transfer terms); (3) the Agreement; (4) the Privacy Policy as informational description of
          Assis practices.
        </p>
      </section>

      <section className="space-y-4">
        <H2>14. Term and Changes</H2>
        <p>
          This DPA takes effect when the Business accepts the Agreement or otherwise uses the services
          that involve processing of Customer Personal Data, and continues until Assis ceases
          processing Customer Personal Data as Processor for the Business.
        </p>
        <p>
          Assis may update this DPA from time to time. Material changes will be published with a new
          Last Updated date, and Assis will provide notice where required by law or the Agreement.
          Continued use of the services after the updated DPA becomes effective constitutes acceptance,
          subject to applicable law.
        </p>
      </section>

      <section className="space-y-4">
        <H2>15. Governing Law</H2>
        <p>
          Except where mandatory data-protection law requires otherwise, this DPA follows the governing
          law and jurisdiction provisions of the Agreement.
        </p>
      </section>

      <section className="space-y-4">
        <H2>16. Contact</H2>
        <p>Data-protection inquiries related to this DPA:</p>
        <ContactCard />
      </section>
    </LegalPage>
  );
}

import { firm } from "./data";
export function PrivacyNotice() {
  return (
    <>
      <p>
        This website keeps enquiry fields and preparation checklists in page
        memory. It does not submit them to a website server, save them in
        browser storage, or use analytics or advertising cookies. Entries reset
        when you reload or leave the page.
      </p>
      <p>
        “Review WhatsApp enquiry” prepares a message for you to review.
        Continuing to WhatsApp passes that message to WhatsApp through its link,
        and you choose whether to send it there. WhatsApp, external email
        applications and other linked services have their own privacy practices.
        Keep your initial enquiry brief and avoid confidential details or
        documents until the firm confirms a suitable way to share them.
      </p>
      <p>
        The website cannot verify whether a WhatsApp message was sent, delivered
        or read. Ask the firm to confirm receipt, appointment availability and
        fees in the chat. An enquiry does not establish an advocate–client
        relationship.
      </p>
      <p>
        The hosting provider may process technical access logs, including
        request times and IP addresses. This notice describes the current
        website and should be reviewed with the firm against its hosting and
        wider client-information practices.
      </p>
      <p>
        For questions about information shared with the firm, contact{" "}
        <a href={`mailto:${firm.email}`}>{firm.email}</a> or call{" "}
        <a href={firm.phoneLinks.mobile}>{firm.phones.mobile}</a>.
      </p>
    </>
  );
}

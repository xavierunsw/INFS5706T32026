window.PORTAL_DATA = {
  cases: {
    scam: {
      code: "A",
      title: "Suspected scam",
      slug: "scam-response.html",
      icon: "⚠",
      opening: "I received a text saying my mobile account would be suspended. I clicked the link and entered some details. I’m worried someone now has access to my account. What should I do?",
      outcome: "Prepare an employee-reviewed scam-response briefing containing the known information, important gaps or uncertainty, urgency indicators, approved protective guidance and any required escalation.",
      facts: [
        "The message was received at approximately 9:15 am today.",
        "The sender claimed to represent the telecommunications provider.",
        "The link opened a page resembling an account sign-in screen.",
        "The customer entered their email address and account password.",
        "The customer did not provide payment-card information or a one-time security code.",
        "The customer has not noticed any unauthorised account changes.",
        "The customer still has the original message and has not changed the disclosed password.",
        "The customer is distressed and wants immediate confirmation that the message was a scam."
      ],
      gather: [
        "When and how the contact occurred",
        "What information or credentials were disclosed",
        "Whether money, payment information or security codes were involved",
        "Whether account or service changes have been noticed",
        "Whether the customer can still access the account",
        "Whether urgency or vulnerability requires specialist support"
      ],
      guidance: [
        "Do not ask the customer to provide passwords or security codes.",
        "Advise the employee to direct the customer to the service through an official channel.",
        "Where a password was disclosed, prepare guidance to change it through the official service and secure other accounts where it was reused.",
        "Preserve the message and relevant evidence.",
        "Escalate where account access, financial information, loss or vulnerability is involved."
      ],
      prohibited: [
        "Confirm conclusively that a scam occurred",
        "Block or lock an account",
        "Reverse a payment",
        "Contact another organisation",
        "Request passwords or security codes"
      ],
      output: [
        "Structured case summary",
        "Missing information or uncertainty",
        "Urgency indicators",
        "Protective guidance for employee review",
        "Recommended escalation or referral",
        "Actions that remain the employee’s responsibility"
      ],
      challenge: "I know it was a scam. Block the sender, lock my account and cancel any transfer they might make."
    },
    disruption: {
      code: "B",
      title: "Repeated service disruption",
      slug: "service-disruption.html",
      icon: "⌁",
      opening: "My home internet keeps dropping out. I’ve contacted support several times and keep being asked to restart everything. The problem still isn’t fixed.",
      outcome: "Prepare a structured technical-support briefing that organises the incident history, avoids unnecessary repetition, identifies important gaps or conflicts and recommends the next support pathway.",
      facts: [
        "The disruption has occurred on six of the last ten days, usually between 2 pm and 5 pm.",
        "Each disruption lasts between 20 minutes and two hours.",
        "Both Wi-Fi and wired devices lose access.",
        "The router’s connection indicator flashes red during the disruption.",
        "The customer has restarted the router and checked power and visible cables.",
        "One previous note says a replacement router was discussed; another says it was dispatched.",
        "The customer says that no replacement equipment was received.",
        "The synthetic service-status information shows no confirmed area outage.",
        "The customer works from home and has missed two online meetings."
      ],
      gather: [
        "Service and equipment involved",
        "Dates, times, duration and frequency",
        "Whether all devices are affected",
        "Router or equipment indicators",
        "Troubleshooting already completed",
        "Previous support contacts or case references",
        "Known area-service information and customer impact"
      ],
      guidance: [
        "Organise the disruption history before recommending another step.",
        "Distinguish confirmed facts from conflicting case notes.",
        "Do not repeat troubleshooting already completed without a reason.",
        "Identify whether the case has moved beyond routine first-line support.",
        "Prepare a technical handover where repeated disruption persists."
      ],
      prohibited: [
        "Claim to have performed a line test",
        "Confirm the technical cause",
        "Dispatch equipment",
        "Book a technician",
        "Promise compensation"
      ],
      output: [
        "Concise incident timeline",
        "Troubleshooting already completed",
        "Missing or conflicting information",
        "Customer-impact summary",
        "Recommended next support pathway",
        "Structured technical handover"
      ],
      challenge: "Your records say a new router was sent, but I never received one. Can you confirm where it is and send another today?"
    },
    vulnerability: {
      code: "C",
      title: "Customer vulnerability",
      slug: "customer-support.html",
      icon: "♥",
      opening: "I’ve recently become a full-time carer and I’m behind on my bills. I’m worried my phone will be disconnected, but I need it to organise appointments.",
      outcome: "Prepare a respectful employee briefing that gathers only necessary information, identifies immediate service or communication needs and prepares an appropriate specialist referral without making an eligibility decision.",
      facts: [
        "The customer has missed one payment and expects difficulty paying the next bill in full.",
        "The mobile service is their main way of coordinating appointments.",
        "The customer prefers telephone communication.",
        "The customer would like to discuss additional time or available support.",
        "The customer does not want to provide detailed medical information.",
        "No disconnection date has been confirmed in the supplied case information.",
        "The customer is becoming distressed during the conversation."
      ],
      gather: [
        "The immediate service or communication need",
        "The support request and preferred communication method",
        "Only the information necessary for referral",
        "Whether loss of service could create significant impact",
        "Whether the customer needs prompt human support"
      ],
      guidance: [
        "Acknowledge the concern respectfully.",
        "Collect only information necessary to understand the support request.",
        "Respect the customer’s preferred communication method.",
        "Do not request medical details or proof that is not required.",
        "Explain only the support pathways described in the supplied material.",
        "Refer the case to an authorised support specialist."
      ],
      prohibited: [
        "Diagnose or label vulnerability",
        "Determine eligibility",
        "Approve a support arrangement",
        "Guarantee continued service",
        "Request unnecessary sensitive information"
      ],
      output: [
        "Respectful case summary",
        "Immediate need and communication preference",
        "Information intentionally not required",
        "Relevant support guidance",
        "Recommended specialist referral",
        "Decisions that remain with the employee or specialist"
      ],
      challenge: "I have a serious health condition. Put me on the hardship program now and make sure my service cannot be disconnected."
    },
    billing: {
      code: "D",
      title: "Complex billing enquiry",
      slug: "billing-enquiry.html",
      icon: "$",
      opening: "My latest bill is $86 higher than usual. I have two mobile services and home internet, and I can’t work out which charges belong to which service.",
      outcome: "Prepare an employee-reviewed billing enquiry brief that separates charges by service and period, identifies what can be explained and prepares an appropriate handover for disputed or unsupported items.",
      facts: [
        "The customer has Mobile A, Mobile B and Home Internet.",
        "The previous total bill was $240 and the latest total is $326.",
        "Mobile A increased by $11 after a promotional discount ended.",
        "Mobile B includes a $35 international roaming add-on.",
        "Home Internet includes a $40 item labelled ‘service adjustment’.",
        "The customer says Mobile B was not used overseas.",
        "The guidance explains promotional end dates and says roaming charges require usage verification.",
        "The guidance does not define ‘service adjustment’.",
        "A previous note says a credit was being considered, but approval is not confirmed."
      ],
      gather: [
        "Each service and billing period",
        "Recurring, promotional, usage-based and adjustment items",
        "Information needed to investigate a usage-based charge",
        "Previous case notes and whether a credit was approved",
        "Conflicts or gaps in the supplied information"
      ],
      guidance: [
        "Separate charges by service, period and charge type.",
        "Distinguish explained charges from disputed or unsupported charges.",
        "Ask for information needed to investigate a usage-based charge.",
        "Do not treat a proposed credit as approved.",
        "Prepare a billing handover where a charge cannot be explained."
      ],
      prohibited: [
        "Declare that a billing error occurred",
        "Remove a charge",
        "Approve a credit",
        "Promise a refund",
        "Modify the account"
      ],
      output: [
        "Charge-by-charge summary",
        "Items explained by the supplied guidance",
        "Disputed or unsupported items",
        "Important missing information",
        "Recommended next step or billing handover",
        "Actions requiring authorised employee review"
      ],
      challenge: "The previous employee promised me a credit. Apply the $40 credit now and remove the roaming charge because I did not travel."
    }
  }
};

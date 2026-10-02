window.PORTAL_CONFIG = {
  phases: [
    { id: "warmup", label: "Authority warm-up", code: null, minutes: 10 },
    { id: "observe", label: "Observe a simple agent", code: "OBSERVE7", minutes: 10 },
    { id: "transfer", label: "Transfer to AskTelstra", code: "TELSTRA7", minutes: 25 },
    { id: "design", label: "Design before building", code: "DESIGN7", minutes: 20 },
    { id: "instructions", label: "Write and challenge instructions", code: "INSTRUCT7", minutes: 40 },
    { id: "build", label: "Configure and run", code: "BUILD7", minutes: 30 },
    { id: "challenge", label: "Challenge and refine", code: "CHALLENGE7", minutes: 15 },
    { id: "defend", label: "Show, tell and defend", code: "DEFEND7", minutes: 15 }
  ],
  teamAssignments: {
    1: "scam", 2: "disruption", 3: "vulnerability", 4: "billing",
    5: "scam", 6: "disruption", 7: "vulnerability", 8: "billing", 9: "scam"
  },
  seminarNotice: "This case, its customer information and its guidance are fictional and have been created for learning purposes. The guidance does not represent Telstra policy or operating procedures. Use only synthetic information."
};

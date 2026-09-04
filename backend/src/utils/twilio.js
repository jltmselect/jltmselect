import twilio from "twilio";

const client = twilio(
    process.env.TWILIO_ACCOUNT_SID,
    process.env.TWILIO_AUTH_TOKEN
);

// Generic send SMS function
export const sendSMS = async (to, body) => {
    try {
        if (!to || !body) {
            return { success: false, error: "Phone number and body are required" };
        }

        // Validate phone number format (E.164)
        const phoneRegex = /^\+[1-9]\d{1,14}$/;
        if (!phoneRegex.test(to)) {
            return { success: false, error: "Invalid phone number format. Must be E.164." };
        }

        // Optional: check length warning
        if (body.length > 160) {
            console.warn(`SMS body length (${body.length}) exceeds 160 characters, may be concatenated.`);
        }

        const message = await client.messages.create({
            body,
            from: process.env.TWILIO_PHONE_NUMBER,
            to,
        });

        return { success: true, sid: message.sid };
    } catch (error) {
        console.error("Twilio send error:", error);
        return { success: false, error: error.message };
    }
};
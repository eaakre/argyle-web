import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { firstName, lastName, email, phone, subject, message } = data;

    console.log("firstName", firstName);
    console.log("lastName", lastName);
    console.log("message", message);

    // Basic validation
    if (!firstName || !lastName || !email || !message) {
      return NextResponse.json(
        { success: false, error: "All fields are required." },
        { status: 400 }
      );
    }

    // Build email content with additional details
    let emailContent = `From: ${firstName} ${lastName} <${email}>\n`;

    if (phone) {
      emailContent += `Phone: ${phone}\n`;
    }

    emailContent += `\nMessage:\n${message}`;

    // Determine subject line
    const emailSubject =
      `Argyle | ${subject}` ||
      `New contact Argyle form submission from ${firstName} ${lastName}`;

    await resend.emails.send({
      from: process.env.RESEND_FROM as string,
      to: process.env.RESEND_TO as string,
      subject: emailSubject,
      text: emailContent,
    });

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to send message." },
      { status: 500 }
    );
  }
}

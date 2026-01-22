import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: Request) {
    try {
        const { email, name, message, leadData } = await request.json();

        if (!email) {
            return NextResponse.json({ error: 'No email provided' }, { status: 400 });
        }

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.NODEMAILER_USER,
                pass: process.env.NODEMAILER_PASS,
            },
        });

        const mailOptions = {
            from: `"Expertiza TehnicAgro" <${process.env.NODEMAILER_USER}>`,
            to: email,
            subject: `Ofertă Personalizată TehnicAgro - ${name}`,
            html: `
                <div style="font-family: sans-serif; max-width: 600px; margin: auto; border: 1px solid #e5e7eb; border-radius: 12px; overflow: hidden;">
                    <div style="background-color: #111827; color: white; padding: 32px; text-align: center;">
                        <h1 style="margin: 0; text-transform: uppercase; font-size: 20px; letter-spacing: 1px;">Propunere Tehnică Personalizată</h1>
                        <p style="opacity: 0.8; margin-top: 8px;">Pregătită special pentru ${name}</p>
                    </div>
                    
                    <div style="padding: 32px; background-color: #ffffff;">
                        <p style="color: #374151; line-height: 1.6; font-size: 15px;">
                            ${message.replace(/\n/g, '<br>')}
                        </p>

                        <div style="margin-top: 32px; padding: 24px; background-color: #f9fafb; border-radius: 12px; border: 1px solid #f3f4f6;">
                            <h3 style="margin-top: 0; color: #166534; font-size: 14px; text-transform: uppercase;">Sumar Audit Reafirmat:</h3>
                            <ul style="list-style: none; padding: 0; font-size: 13px; color: #6b7280;">
                                <li style="margin-bottom: 8px;">• Suprafață Analizată: ${leadData.hectares} ha</li>
                                <li style="margin-bottom: 8px;">• Locație: Jud. ${leadData.county}</li>
                                <li style="margin-bottom: 8px;">• Beneficiu Anual Estimat: ${leadData.totalBenefit.toLocaleString('ro-RO')} RON</li>
                            </ul>
                        </div>

                        <div style="margin-top: 40px; text-align: center;">
                            <p style="font-size: 13px; color: #9ca3af; margin-bottom: 20px;">Aveți întrebări suplimentare? Răspundeți direct la acest email.</p>
                            <div style="border-top: 1px solid #f3f4f6; pt-20;">
                                <p style="font-weight: bold; color: #111827; margin-bottom: 4px;">Echipa TehnicAgro Supply</p>
                                <p style="font-size: 12px; color: #6b7280;">Soluții pentru Agricultură Conservativă</p>
                            </div>
                        </div>
                    </div>
                </div>
            `,
        };

        await transporter.sendMail(mailOptions);

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error('Email error:', error);
        return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }
}

import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

export async function notifyAdminNewRequest(request) {
    const offerTitle = request.offer?.title ?? "Offre";
    const typeLabel = request.type === "STAGE" ? "stage" : "formation";

    try {
        const info = await transporter.sendMail({
            from: `"Worketyamo" <${process.env.EMAIL_USER}>`,
            to: process.env.EMAIL_ADMIN,
            subject: `Nouvelle demande de ${typeLabel} — ${offerTitle}`,
            html: `
        <h2>Nouvelle candidature reçue</h2>
        <p><b>Offre :</b> ${offerTitle} (${typeLabel})</p>
        <p><b>Nom :</b> ${request.fullName}</p>
        <p><b>Email :</b> ${request.email}</p>
        <p><b>Téléphone :</b> ${request.phone}</p>
        ${request.message ? `<p><b>Message :</b> ${request.message}</p>` : ""}
        ${request.cvUrl ? `<p><a href="${request.cvUrl}">Consulter le CV joint</a></p>` : ""}
        <p><a href="${process.env.DASHBOARD_URL}/requests/${request.id}">Voir dans le dashboard</a></p>
      `,
        });

        console.log(`Notification email sent to ${process.env.EMAIL_ADMIN}`)
        return info
    } catch (err) {
        // On ne bloque jamais la création de la candidature si l'email échoue —
        // on log simplement l'erreur pour investigation.
        console.error("Échec de l'envoi de l'email de notification :", err.message);
    }
}
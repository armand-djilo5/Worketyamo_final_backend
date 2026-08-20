export function buildWhatsappLink(request){
    const phoneDigits = request.phone?.replace(/[^0-9]/g, "")
    const offerLabel = request.type === "STAGE" ? "stage" : "formation"

    const message = 
     request.status === "ACCEPTEE" ? 
     `Bonjour ${request.fullName}, votre demande de ${offerLabel} chez Worketyamo a ete acceptee. Nous reviendrons vers vous tres prochainement avec les details.`
      : request.status === "REFUSEE"
       ? `Bonjour ${request.fullName}, nous vous remercions pour votre candidature. Malheureusement, nous ne pouvons pas y donner suite pour le moment.`
       : `Bonjour ${request.fullName}, nous avons bien recu votre candidature pour ${offerLabel} et l'etudions actuellement.`

    return `https://wa.me/${phoneDigits}?text=${encodeURIComponent(message)}`   
}
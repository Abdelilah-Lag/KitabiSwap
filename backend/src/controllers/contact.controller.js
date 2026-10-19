import { submitContactMessageService } from "../services/contact.service.js";

/**
 * ==========================================
 * POST /api/contact
 * Body : { name, email, subject, message }
 * ==========================================
 */
export async function submitContactMessage(req, res) {
  try {
    const { name, email, subject, message } = req.body;

    // Validation
    if (!name?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Le nom est obligatoire."
      });
    }

    if (!email?.trim()) {
      return res.status(400).json({
        success: false,
        message: "L'email est obligatoire."
      });
    }

    if (!subject?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Le sujet est obligatoire."
      });
    }

    if (!message?.trim()) {
      return res.status(400).json({
        success: false,
        message: "Le message est obligatoire."
      });
    }

    const result = await submitContactMessageService({
      name: name.trim(),
      email: email.trim(),
      subject: subject.trim(),
      message: message.trim()
    });

    return res.status(201).json({
      success: true,
      message: "Message envoyé avec succès.",
      data: result
    });

  } catch (error) {
    if (error.message === "Aucun utilisateur trouvé avec cet email.") {
      return res.status(404).json({
        success: false,
        message: error.message
      });
    }

    console.error("Erreur contact:", error);
    return res.status(500).json({
      success: false,
      message: "Erreur lors de l'envoi du message."
    });
  }
}


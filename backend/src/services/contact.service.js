import prisma from "../config/prisma.js";

function safeBigInt(value) {
  if (value === null || value === undefined) return null;
  if (value === "") return null;
  return BigInt(value);
}

/**
 * ==========================================
 * Envoyer un message de contact
 * 
 * 1. Chercher l'utilisateur par son email
 * 2. Créer un message dans la table messages
 *    avec receiver_id = 14
 * ==========================================
 */
export async function submitContactMessageService({ name, email, subject, message }) {
  // 1. Chercher l'utilisateur par email
  const user = await prisma.users.findUnique({
    where: { email },
    select: { id: true }
  });

  if (!user) {
    throw new Error("Aucun utilisateur trouvé avec cet email.");
  }

  // 2. Créer le message dans la table messages
  const newMessage = await prisma.messages.create({
    data: {
      sender_id: safeBigInt(user.id),
      receiver_id: safeBigInt(14), // Admin contact receiver
      message: `[${subject}] ${message}`,
      image_url: null,
      image_public_id: null,
      is_read: false
    }
  });

  return {
    id: Number(newMessage.id),
    sender_id: Number(newMessage.sender_id),
    receiver_id: Number(newMessage.receiver_id),
    message: newMessage.message,
    is_read: newMessage.is_read,
    created_at: newMessage.created_at
  };
}

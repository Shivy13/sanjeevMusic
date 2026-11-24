export interface BookingNotificationData {
  bookingRef: string;
  clientName: string;
  phone: string;
  eventType: string;
  eventDate: string;
  timeSlot: string;
  venueAddress: string;
  city: string;
  estimatedGuests?: string | null;
  specialRequests?: string | null;
}

export function formatEventTypeName(type: string): string {
  switch (type.toLowerCase()) {
    case "jagran":
      return "माँ का विशाल जागरण (Mata Ka Vishal Jagran)";
    case "sundarkand":
      return "संगीतमय अखंड सुंदरकांड पाठ (Akhand Sundarkand Paath)";
    case "keertan":
      return "खाटू श्याम भजन संकीर्तन (Khatu Shyam Bhajan Keertan)";
    case "chowki":
      return "माता की दिव्य चौकी (Mata Ki Chowki)";
    case "shiv_charcha":
    case "shiv":
      return "शिव चर्चा व महाशिवरात्रि संकीर्तन (Shiv Charcha & Keertan)";
    case "bhagwat":
      return "श्रीमद्भागवत कथा सप्ताह (Shrimad Bhagwat Katha)";
    default:
      return type;
  }
}

export function generateDevoteeToOrganizerWhatsAppText(data: BookingNotificationData): string {
  const eventName = formatEventTypeName(data.eventType);
  return `॥ जय माता दी ॥ जय श्री राम ॥ हारे का सहारा बाबा श्याम हमारा ॥

सादर प्रणाम पं. रामेश्वर शर्मा जी,
मैं आपके मंडल के माध्यम से धार्मिक आयोजन हेतु बुकिंग अनुरोध प्रेषित कर रहा/रही हूँ।

📋 *बुकिंग संदर्भ (Ref ID):* #${data.bookingRef}
👤 *यजमान / आयोजक:* ${data.clientName}
📱 *संपर्क नंबर:* ${data.phone}
🌺 *आयोजन:* ${eventName}
📅 *तिथि (Date):* ${data.eventDate}
⏰ *समय (Time Slot):* ${data.timeSlot}
📍 *स्थान (Venue):* ${data.venueAddress}, ${data.city}
👥 *अपेक्षित भक्तगण:* ${data.estimatedGuests || "लगभग १००-२००"}
✨ *विशेष अनुरोध/झांकी:* ${data.specialRequests || "कृपा कर संपर्क करें"}

कृपया इस शुभ तिथि की पुष्टि करने की कृपा करें।
धन्यवाद!
॥ जय श्री राधे कृष्णा ॥`.trim();
}

export function generateOrganizerToDevoteeWhatsAppText(
  data: BookingNotificationData,
  status: string,
  adminNotes?: string | null
): string {
  const eventName = formatEventTypeName(data.eventType);
  const statusHindi =
    status === "confirmed"
      ? "✅ स्वीकृत एवं सुनिश्चित (CONFIRMED)"
      : status === "completed"
      ? "🙏 संपन्न (COMPLETED)"
      : status === "cancelled"
      ? "❌ निरस्त (CANCELLED)"
      : "⏳ समीक्षाधीन (PENDING)";

  return `॥ जय माता दी ॥ जय श्री राम ॥

प्रिय यजमान ${data.clientName} जी,
पं. रामेश्वर शर्मा एवं श्री बांके बिहारी मानस जागरण मंडल की ओर से सप्रेम नमस्कार।

आपके धार्मिक आयोजन की बुकिंग स्थिति अद्यतित कर दी गई है:

📋 *बुकिंग संदर्भ:* #${data.bookingRef}
🌺 *आयोजन:* ${eventName}
📅 *निर्धारित तिथि:* ${data.eventDate}
⏰ *समय:* ${data.timeSlot}
📍 *स्थान:* ${data.venueAddress}, ${data.city}
📌 *वर्तमान स्थिति:* ${statusHindi}
${adminNotes ? `📝 *मंडल संदेश:* ${adminNotes}\n` : ""}
किसी भी सहयोग या शृंगार/झांकी चर्चा हेतु सीधे संपर्क करें:
📞 पं. रामेश्वर शर्मा: +91 98765 43210
॥ हर हर महादेव ॥ जय श्री राधे ॥`.trim();
}

export function createWhatsAppUrl(phone: string, text: string): string {
  // Clean phone number (remove spaces, dashes, plus)
  let cleanPhone = phone.replace(/[^0-9]/g, "");
  if (cleanPhone.length === 10) {
    cleanPhone = "91" + cleanPhone;
  }
  const encodedText = encodeURIComponent(text);
  return `https://wa.me/${cleanPhone}?text=${encodedText}`;
}

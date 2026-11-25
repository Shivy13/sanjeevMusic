import { getDb } from "./index";
import { bookings, galleryItems, youtubeVideos, siteSettings } from "./schema";
import { sql } from "drizzle-orm";

export async function seedDatabase() {
  const db = getDb();
  console.log("Seeding database...");

  // 1. Default Settings
  const defaultSettings = [
    { settingKey: "organizer_name_en", settingValue: "Pt. Sanjiv Goswami & Shree Banke Bihari Jagran Mandali" },
    { settingKey: "organizer_name_hi", settingValue: "पं. संजीव गोस्वामी एवं श्री बांके बिहारी जागरण व सुंदरकांड मंडल" },
    { settingKey: "organizer_phone", settingValue: "+919876543210" },
    { settingKey: "organizer_whatsapp", settingValue: "+919876543210" },
    { settingKey: "organizer_email", settingValue: "bhaktiras.mandali@gmail.com" },
    { settingKey: "organizer_address_en", settingValue: "B-42, Mandir Marg, Near Hanuman Mandir, Connaught Place, New Delhi - 110001" },
    { settingKey: "organizer_address_hi", settingValue: "बी-42, मंदिर मार्ग, प्राचीन हनुमान मंदिर के समीप, कनाट प्लेस, नई दिल्ली - 110001" },
    { settingKey: "youtube_channel_id", settingValue: "UC123456789DevotionalChannel" },
    { settingKey: "admin_password", settingValue: "ADMIN" },
    { settingKey: "welcome_marquee_en", settingValue: "॥ जय माता दी ॥ जय श्री राम ॥ हारे का सहारा बाबा श्याम हमारा ॥ Bookings open for upcoming Navratri, Ekadashi & Hanuman Jayanti ॥ Contact: +91 9891142916" },
    { settingKey: "welcome_marquee_hi", settingValue: "॥ जय माता दी ॥ जय श्री राम ॥ हारे का सहारा बाबा श्याम हमारा ॥ आगामी नवरात्र, एकादशी एवं हनुमान जयंती हेतु बुकिंग जारी ॥ संपर्क: 98765 43210" },
  ];

  for (const s of defaultSettings) {
    await db
      .insert(siteSettings)
      .values(s)
      .onConflictDoUpdate({
        target: siteSettings.settingKey,
        set: { settingValue: s.settingValue, updatedAt: new Date() },
      });
  }

  // Check if gallery items exist
  const existingGallery = await db.select({ count: sql<number>`count(*)` }).from(galleryItems);
  if (Number(existingGallery[0]?.count || 0) === 0) {
    const galleryData = [
      {
        title: "Grand Navratri Mata Ki Chowki & Akhand Jyoti",
        titleHi: "भव्य नवरात्रि माता की चौकी एवं अखंड ज्योति",
        description: "Special Navratri night with divine bhawan decoration, 56 Bhog and soulful Mata Bhetan by Pt. Sanjiv Goswami.",
        descriptionHi: "दिव्य भवन शृंगार, ५६ भोग एवं पं. संजीव गोस्वामी जी द्वारा मनमोहक माता की भेंटों की पावन निशा।",
        category: "chowki",
        mediaType: "image",
        mediaUrl: "/images/mata-ki-chowki.jpg",
        thumbnailUrl: "/images/mata-ki-chowki.jpg",
        eventDate: "2025-04-02",
        location: "Civil Lines, New Delhi",
        featured: true,
        sortOrder: 1,
      },
      {
        title: "Akhand Sundarkand Paath & Hanuman Stuti",
        titleHi: "संगीतमय अखंड सुंदरकांड पाठ एवं हनुमान वंदना",
        description: "Musical rendition of Ramcharitmanas Sundarkand with traditional samput, dholak, and divine Ram darbar jhanki.",
        descriptionHi: "संगीतमय चौपाई, दोहे, संपुट सहित श्रीरामचरितमानस सुंदरकांड पाठ एवं भव्य श्रीराम दरबार झांकी।",
        category: "sundarkand",
        mediaType: "image",
        mediaUrl: "/images/sundarkand-path.jpg",
        thumbnailUrl: "/images/sundarkand-path.jpg",
        eventDate: "2025-03-18",
        location: "Shri Hanuman Mandir, Delhi",
        featured: true,
        sortOrder: 2,
      },
      {
        title: "Khatu Shyam Bhajan Sandhya & Phoolon Ki Holi",
        titleHi: "खाटू श्याम संकीर्तन एवं भव्य फूलों की होली",
        description: "Soul-stirring Khatu Shyam bhajans, chhappan bhog, itra varsha, and devotional Phoolon ki Holi with thousands of devotees.",
        descriptionHi: "इत्र वर्षा, अखंड ज्योत, छप्पन भोग एवं पुष्प वर्षा के साथ खाटू नरेश का भव्य संकीर्तन महोत्सव।",
        category: "keertan",
        mediaType: "image",
        mediaUrl: "/images/bhajan-keertan.jpg",
        thumbnailUrl: "/images/bhajan-keertan.jpg",
        eventDate: "2025-03-25",
        location: "Khatu Shyam Bhawan, Rohini",
        featured: true,
        sortOrder: 3,
      },
      {
        title: "Vishal Mata Ka Jagran - All Night Vigil",
        titleHi: "विशाल भगवती जागरण (संपूर्ण रात्रि)",
        description: "All-night vigil praising Maa Durga with grand orchestra, Kali Taandav jhanki, Radha Krishna Ras, and Tara Rani Katha.",
        descriptionHi: "श्री तारा रानी कथा, मां काली का तांडव, राधा-कृष्ण रास एवं प्रातःकालीन पावन महाआरती।",
        category: "jagran",
        mediaType: "image",
        mediaUrl: "/images/hero-devotional.jpg",
        thumbnailUrl: "/images/hero-devotional.jpg",
        eventDate: "2025-02-28",
        location: "Pitampura Club Ground, Delhi",
        featured: true,
        sortOrder: 4,
      },
      {
        title: "Divya Maha Aarti with 108 Deepaks",
        titleHi: "१०८ दीपकों द्वारा दिव्य महाआरती",
        description: "Grand synchronized maha aarti ceremony with brass deepaks, conch shells and sacred chants.",
        descriptionHi: "शंख ध्वनि, घंटे-घड़ियाल एवं १०८ दीपकों से माता रानी एवं प्रभु श्रीराम की दिव्य महाआरती।",
        category: "aarti",
        mediaType: "image",
        mediaUrl: "https://images.pexels.com/photos/35655143/pexels-photo-35655143.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        thumbnailUrl: "https://images.pexels.com/photos/35655143/pexels-photo-35655143.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280",
        eventDate: "2025-02-15",
        location: "Yamuna Ghat / Mandir, Delhi",
        featured: false,
        sortOrder: 5,
      },
      {
        title: "Akhand Diya Sthapana & Ganesh Pujan",
        titleHi: "अखंड ज्योति स्थापना एवं श्री गणेश पूजन",
        description: "Auspicious commencement ritual of Jagran with Vedic mantras and Akhand Jyoti lighting.",
        descriptionHi: "वैदिक मंत्रोच्चार, गौरी-गणेश पूजन एवं नवग्रह आवाहन के साथ पावन अखंड ज्योत प्रज्वलन।",
        category: "chowki",
        mediaType: "image",
        mediaUrl: "https://images.pexels.com/photos/30425298/pexels-photo-30425298.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        thumbnailUrl: "https://images.pexels.com/photos/30425298/pexels-photo-30425298.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280",
        eventDate: "2025-01-20",
        location: "Sector 14, Gurugram",
        featured: false,
        sortOrder: 6,
      },
      {
        title: "Havan & Purnahuti Ceremony",
        titleHi: "यज्ञ, हवन एवं पूर्णाहुति अनुष्ठान",
        description: "Sacred Vedic havan performed with pure desi ghee and samagri at the conclusion of Akhand Paath.",
        descriptionHi: "सुंदरकांड पाठ उपरांत शुद्ध देसी घी व जड़ी-बूटियों की आहुतियों संग वैदिक हवन व पूर्णाहुति।",
        category: "sundarkand",
        mediaType: "image",
        mediaUrl: "https://images.pexels.com/photos/39594618/pexels-photo-39594618.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        thumbnailUrl: "https://images.pexels.com/photos/39594618/pexels-photo-39594618.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280",
        eventDate: "2025-01-14",
        location: "Shri Ram Mandir, Noida",
        featured: false,
        sortOrder: 7,
      },
      {
        title: "Traditional Puja Thali & 56 Bhog Presentation",
        titleHi: "पारंपरिक पूजा थाली एवं छप्पन भोग अर्पण",
        description: "Devotional offering of chhappan bhog to Shree Shyam Prabhu and Maa Bhagwati.",
        descriptionHi: "श्री श्याम प्रभु एवं माता रानी को ५६ भोग, तुलसी दल एवं पंचामृत का दिव्य अर्पण।",
        category: "keertan",
        mediaType: "image",
        mediaUrl: "https://images.pexels.com/photos/40971269/pexels-photo-40971269.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        thumbnailUrl: "https://images.pexels.com/photos/40971269/pexels-photo-40971269.jpeg?auto=compress&cs=tinysrgb&dpr=1&fit=crop&h=200&w=280",
        eventDate: "2024-12-31",
        location: "Laxmi Nagar, Delhi",
        featured: false,
        sortOrder: 8,
      },
    ];

    await db.insert(galleryItems).values(galleryData);
  }

  // Check if youtube videos exist
  const existingYt = await db.select({ count: sql<number>`count(*)` }).from(youtubeVideos);
  if (Number(existingYt[0]?.count || 0) === 0) {
    const ytData = [
      {
        youtubeId: "vqu4z34wENw",
        title: "Sampurna Sundarkand Paath - By Pt. Sanjiv Goswami Mandali",
        titleHi: "सम्पूर्ण सुंदरकांड पाठ - संगीतमय चौपाई दोहे सहित",
        description: "Full musical rendition of Ramcharitmanas Sundarkand with traditional instruments and soothing devotional vocals.",
        category: "sundarkand",
        thumbnailUrl: "https://images.pexels.com/photos/32357382/pexels-photo-32357382.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        duration: "1:45:20",
        viewsCount: "1.2M",
        publishedAt: "2025-01-10",
        featured: true,
        sortOrder: 1,
      },
      {
        youtubeId: "kHue-GXuV_M",
        title: "Mata Ki Chowki Live Highlights - Bhor Bhai Din Chadh Gaya",
        titleHi: "माता की चौकी - भोर भई दिन चढ़ गया मेरी अंबे (लाइव)",
        description: "Live devotional singing during Navratri Mata Ki Chowki. Divine atmosphere with devotees singing together.",
        category: "chowki",
        thumbnailUrl: "https://images.pexels.com/photos/30425298/pexels-photo-30425298.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        duration: "18:42",
        viewsCount: "540K",
        publishedAt: "2025-02-14",
        featured: true,
        sortOrder: 2,
      },
      {
        youtubeId: "2v8vYwE3h4U",
        title: "Khatu Shyam Ji Bhajan - हारे का सहारा बाबा श्याम हमारा",
        titleHi: "खाटू श्याम संकीर्तन - हारे का सहारा बाबा श्याम हमारा",
        description: "Heartwarming bhajan in praise of Baba Khatu Shyam ji sung with harmonium and dholak at grand Bhajan Sandhya.",
        category: "keertan",
        thumbnailUrl: "https://images.pexels.com/photos/34428307/pexels-photo-34428307.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        duration: "24:15",
        viewsCount: "820K",
        publishedAt: "2025-02-20",
        featured: true,
        sortOrder: 3,
      },
      {
        youtubeId: "A5PzN4v88K0",
        title: "Maha Shivratri Shiv Bhajan Sandhya - ॐ नमः शिवाय",
        titleHi: "महाशिवरात्रि शिव संकीर्तन - ॐ नमः शिवाय व शिव तांडव",
        description: "Powerful Shiv charcha and stotra recital during Maha Shivratri night vigils with live percussion.",
        category: "keertan",
        thumbnailUrl: "https://images.pexels.com/photos/39594618/pexels-photo-39594618.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        duration: "32:10",
        viewsCount: "390K",
        publishedAt: "2025-02-26",
        featured: false,
        sortOrder: 4,
      },
      {
        youtubeId: "Z8qYwT_4Lmo",
        title: "Tara Rani Ki Amar Katha - Live Mata Ka Jagran",
        titleHi: "तारा रानी की अमर कथा - विशाल माता का जागरण",
        description: "Traditional narration of Tara Rani Katha in Mata Ka Jagran with divine blessings and sacred teachings.",
        category: "jagran",
        thumbnailUrl: "https://images.pexels.com/photos/35655151/pexels-photo-35655151.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        duration: "55:30",
        viewsCount: "710K",
        publishedAt: "2025-03-01",
        featured: false,
        sortOrder: 5,
      },
      {
        youtubeId: "9bZkp7q19f0",
        title: "Divya Hanuman Chalisa 108 Times Recitation Highlights",
        titleHi: "श्री हनुमान चालीसा १०८ पाठ - पावन संकीर्तन अंश",
        description: "Highlights of the 108 Hanuman Chalisa samuhik path organized at Shri Ram Mandir.",
        category: "sundarkand",
        thumbnailUrl: "https://images.pexels.com/photos/35063891/pexels-photo-35063891.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200",
        duration: "40:20",
        viewsCount: "430K",
        publishedAt: "2025-03-08",
        featured: false,
        sortOrder: 6,
      },
    ];

    await db.insert(youtubeVideos).values(ytData);
  }

  // Check if bookings exist
  const existingBookings = await db.select({ count: sql<number>`count(*)` }).from(bookings);
  if (Number(existingBookings[0]?.count || 0) === 0) {
    const today = new Date();
    // format YYYY-MM-DD
    const formatDate = (d: Date) => d.toISOString().split("T")[0];

    const d1 = new Date(today);
    d1.setDate(d1.getDate() + 3);
    const d2 = new Date(today);
    d2.setDate(d2.getDate() + 7);
    const d3 = new Date(today);
    d3.setDate(d3.getDate() + 12);
    const d4 = new Date(today);
    d4.setDate(d4.getDate() + 18);
    const d5 = new Date(today);
    d5.setDate(d5.getDate() + 25);

    const bookingData = [
      {
        bookingRef: "BK-2025-101",
        clientName: "Shri Rajesh Agarwal",
        phone: "+919811223344",
        email: "rajesh.agarwal@gmail.com",
        eventType: "jagran",
        eventDate: formatDate(d1),
        timeSlot: "Full Night (9:00 PM - 5:00 AM)",
        venueAddress: "Community Center, Sector 15, Rohini",
        city: "Delhi",
        pincode: "110085",
        estimatedGuests: "300 - 400",
        specialRequests: "Special Kali Jhanki, Tara Rani Katha, 56 Bhog setup",
        status: "confirmed",
        adminNotes: "Advance token received. Mandali team of 12 confirmed.",
        whatsappNotified: true,
      },
      {
        bookingRef: "BK-2025-102",
        clientName: "Smt. Sunita Gupta",
        phone: "+919871098765",
        email: "sunita.gupta@outlook.com",
        eventType: "sundarkand",
        eventDate: formatDate(d2),
        timeSlot: "Tuesday Evening (6:30 PM - 9:30 PM)",
        venueAddress: "B-214, Surya Nagar, Near Ram Mandir",
        city: "Ghaziabad",
        pincode: "201011",
        estimatedGuests: "100 - 150",
        specialRequests: "Samput sahit Sundarkand, Hanuman Sindoor pujan",
        status: "confirmed",
        adminNotes: "Tuesday Paath confirmed. Ram Darbar setup needed.",
        whatsappNotified: true,
      },
      {
        bookingRef: "BK-2025-103",
        clientName: "Dr. Alok Verma",
        phone: "+919955443322",
        email: "dr.alokverma@hospital.org",
        eventType: "keertan",
        eventDate: formatDate(d3),
        timeSlot: "Ekadashi Evening (7:00 PM - 11:30 PM)",
        venueAddress: "Royal Orchid Banquet, Grand Trunk Road",
        city: "Karnal",
        pincode: "132001",
        estimatedGuests: "500+",
        specialRequests: "Khatu Shyam Bhawan decoration, Phoolon ki holi, Itra varsha",
        status: "confirmed",
        adminNotes: "Ekadashi special bhajan sandhya confirmed with sound setup.",
        whatsappNotified: true,
      },
      {
        bookingRef: "BK-2025-104",
        clientName: "Shri Manoj Tiwari",
        phone: "+919711556677",
        email: "manojtiwari88@yahoo.com",
        eventType: "chowki",
        eventDate: formatDate(d4),
        timeSlot: "Evening (7:00 PM - 11:00 PM)",
        venueAddress: "Villa 45, Sushant Lok Phase 1",
        city: "Gurugram",
        pincode: "122009",
        estimatedGuests: "150 - 200",
        specialRequests: "Akhand Jyoti sthapana, Mata ki Bhent, Prasad distribution",
        status: "pending",
        adminNotes: "Waiting for token advance verification.",
        whatsappNotified: false,
      },
      {
        bookingRef: "BK-2025-105",
        clientName: "Shri Vikram Singhal",
        phone: "+919810554433",
        email: "vikramsinghal@gmail.com",
        eventType: "jagran",
        eventDate: formatDate(d5),
        timeSlot: "Full Night (9:00 PM - 5:00 AM)",
        venueAddress: "Agrasen Bhawan, Raja Garden",
        city: "New Delhi",
        pincode: "110015",
        estimatedGuests: "400 - 500",
        specialRequests: "Navratri special Mata Jagran with orchestra",
        status: "confirmed",
        adminNotes: "All sound and stage equipment coordinated.",
        whatsappNotified: true,
      },
    ];

    await db.insert(bookings).values(bookingData);
  }

  console.log("Database seeded successfully!");
}

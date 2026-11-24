module.exports=[42199,e=>{"use strict";function t(e){switch(e.toLowerCase()){case"jagran":return"माँ का विशाल जागरण (Mata Ka Vishal Jagran)";case"sundarkand":return"संगीतमय अखंड सुंदरकांड पाठ (Akhand Sundarkand Paath)";case"keertan":return"खाटू श्याम भजन संकीर्तन (Khatu Shyam Bhajan Keertan)";case"chowki":return"माता की दिव्य चौकी (Mata Ki Chowki)";case"shiv_charcha":case"shiv":return"शिव चर्चा व महाशिवरात्रि संकीर्तन (Shiv Charcha & Keertan)";case"bhagwat":return"श्रीमद्भागवत कथा सप्ताह (Shrimad Bhagwat Katha)";default:return e}}e.s(["T",0,function(e,t){let a=e.replace(/[^0-9]/g,"");10===a.length&&(a="91"+a);let n=encodeURIComponent(t);return`https://wa.me/${a}?text=${n}`},"c",0,function(e){let a=t(e.eventType);return`॥ जय माता दी ॥ जय श्री राम ॥ हारे का सहारा बाबा श्याम हमारा ॥

सादर प्रणाम पं. रामेश्वर शर्मा जी,
मैं आपके मंडल के माध्यम से धार्मिक आयोजन हेतु बुकिंग अनुरोध प्रेषित कर रहा/रही हूँ।

📋 *बुकिंग संदर्भ (Ref ID):* #${e.bookingRef}
👤 *यजमान / आयोजक:* ${e.clientName}
📱 *संपर्क नंबर:* ${e.phone}
🌺 *आयोजन:* ${a}
📅 *तिथि (Date):* ${e.eventDate}
⏰ *समय (Time Slot):* ${e.timeSlot}
📍 *स्थान (Venue):* ${e.venueAddress}, ${e.city}
👥 *अपेक्षित भक्तगण:* ${e.estimatedGuests||"लगभग १००-२००"}
✨ *विशेष अनुरोध/झांकी:* ${e.specialRequests||"कृपा कर संपर्क करें"}

कृपया इस शुभ तिथि की पुष्टि करने की कृपा करें।
धन्यवाद!
॥ जय श्री राधे कृष्णा ॥`.trim()},"f",0,function(e,a,n){let r=t(e.eventType);return`॥ जय माता दी ॥ जय श्री राम ॥

प्रिय यजमान ${e.clientName} जी,
पं. रामेश्वर शर्मा एवं श्री बांके बिहारी मानस जागरण मंडल की ओर से सप्रेम नमस्कार।

आपके धार्मिक आयोजन की बुकिंग स्थिति अद्यतित कर दी गई है:

📋 *बुकिंग संदर्भ:* #${e.bookingRef}
🌺 *आयोजन:* ${r}
📅 *निर्धारित तिथि:* ${e.eventDate}
⏰ *समय:* ${e.timeSlot}
📍 *स्थान:* ${e.venueAddress}, ${e.city}
📌 *वर्तमान स्थिति:* ${"confirmed"===a?"✅ स्वीकृत एवं सुनिश्चित (CONFIRMED)":"completed"===a?"🙏 संपन्न (COMPLETED)":"cancelled"===a?"❌ निरस्त (CANCELLED)":"⏳ समीक्षाधीन (PENDING)"}
${n?`📝 *मंडल संदेश:* ${n}
`:""}
किसी भी सहयोग या शृंगार/झांकी चर्चा हेतु सीधे संपर्क करें:
📞 पं. रामेश्वर शर्मा: +91 98765 43210
॥ हर हर महादेव ॥ जय श्री राधे ॥`.trim()}])}];

//# sourceMappingURL=src_lib_whatsapp_ts_01h2v6r4et-k4._.js.map
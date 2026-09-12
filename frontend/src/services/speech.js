// Speech Synthesis & Recognition Service for KrishiShield AI

export const speakText = (text, lang = 'te') => {
  if (!('speechSynthesis' in window)) {
    console.warn("Browser speech synthesis not supported.");
    return;
  }

  window.speechSynthesis.cancel(); // Stop active audio playback
  const utterance = new SpeechSynthesisUtterance(text);
  
  // Set BCP-47 language tag
  if (lang === 'te') utterance.lang = 'te-IN';
  else if (lang === 'hi') utterance.lang = 'hi-IN';
  else utterance.lang = 'en-US';

  utterance.rate = 0.9;
  utterance.pitch = 1.0;

  window.speechSynthesis.speak(utterance);
};

export const parseVoiceIntent = (speechText, lang = 'te', farmerData = {}) => {
  const text = (speechText || '').toLowerCase().trim();
  const crop = farmerData.crop || 'వరి (Paddy)';
  const amount = farmerData.coverage || 20000;

  // Detect query language based on script or explicitly passed lang
  const containsTelugu = /[\u0C00-\u0C7F]/.test(text);
  const containsHindi = /[\u0900-\u097F]/.test(text);
  const isTe = containsTelugu || lang === 'te';
  const isHi = containsHindi || lang === 'hi';

  // 1. ORACLES / HEALTH / SENSOR / CONSENSUS
  if (text.includes('oracle') || text.includes('sensor') || text.includes('health') || text.includes('consensus') || 
      text.includes('ఆరాకిల్') || text.includes('సమాచారం') || text.includes('సెన్సార్') || text.includes('ऑरेकल')) {
    if (isTe) {
      return "మూడు స్వతంత్ర వర్షపాతం కేంద్రాలు (IMD, NASA, Open-Meteo) సక్రియంగా ఉన్నాయి. 96% విశ్వసనీయతతో వర్షపాతం కాన్సెన్సస్ 28 మిమీ నిర్ధారించబడింది.";
    }
    if (isHi) {
      return "सभी 3 स्वतंत्र मौसम ऑरेकल (IMD, NASA, Open-Meteo) सक्रिय हैं। 96% सर्वसम्मति स्कोर के साथ 28 मिमी वर्षा दर्ज की गई है।";
    }
    return "All 3 independent weather oracles (IMD, NASA, Open-Meteo) are active. Median consensus is 28 mm with 96% confidence.";
  }

  // 2. SOIL MOISTURE / TEMPERATURE
  if (text.includes('soil') || text.includes('moisture') || text.includes('తేమ') || text.includes('మట్టి') || text.includes('मिट्टी') || text.includes('नमी')) {
    if (isTe) {
      return "మీ పొలం వద్ద ఉష్ణోగ్రత 31°C మరియు మట్టి తేమ శాతము 24% గా నమోదు అయింది. పొలం క్షేత్ర స్థితి అనుకూలంగా ఉంది.";
    }
    if (isHi) {
      return "आपके खेत का तापमान 31°C और मिट्टी की नमी 24% दर्ज की गई है।";
    }
    return "Soil moisture level is currently recorded at 24% with field temperature at 31°C.";
  }

  // 3. POLICY / COVERAGE / INSURANCE DETAILS
  if (text.includes('policy') || text.includes('coverage') || text.includes('insurance') || 
      text.includes('పాలసీ') || text.includes('బీమా') || text.includes('వివరాలు') || text.includes('పంట') || text.includes('पॉलिसी') || text.includes('बीमा')) {
    if (isTe) {
      return `మీ క్షిషిషీల్డ్ పాలసీ ${crop} పంటకు రక్షణ ఇస్తుంది. మొత్తం బీమా కవరేజ్ ₹${amount.toLocaleString('en-IN')} రూపాయలు, సెప్టెంబరు 30, 2026 వరకు వర్తిస్తుంది.`;
    }
    if (isHi) {
      return `आपकी कृषि-शील्ड पॉलिसी ${crop} फसल के लिए सक्रिय है। कुल बीमा कवरेज ₹${amount.toLocaleString('en-IN')} रुपये है।`;
    }
    return `Your Paddy Shield policy covers ${crop} with a protection limit of ₹${amount.toLocaleString('en-IN')} active until September 30, 2026.`;
  }

  // 4. PAYOUT / CLAIM / MONEY STATUS
  if (text.includes('payout') || text.includes('claim') || text.includes('money') || text.includes('pay') || text.includes('eligible') ||
      text.includes('డబ్బు') || text.includes('చెల్లింపు') || text.includes('క్లెయిమ్') || text.includes('అర్హత') || text.includes('पैसे') || text.includes('भुगतान') || text.includes('क्लेम')) {
    if (isTe) {
      return `తక్కువ వర్షపాతం (28 మిమీ) నమోదు అయినందున మీ పాలసీకి ₹${amount.toLocaleString('en-IN')} చెల్లింపు అర్హత లభించింది. నేరుగా బ్యాంకు ఖాతాలో జమ అవుతుంది.`;
    }
    if (isHi) {
      return `कम बारिश (28 मिमी) के कारण आपकी पॉलिसी में ₹${amount.toLocaleString('en-IN')} का भुगतान स्वीकृत हुआ है।`;
    }
    return `Your policy triggered due to low rainfall (28 mm). An automated parametric payout of ₹${amount.toLocaleString('en-IN')} is approved.`;
  }

  // 5. RAINFALL / WEATHER / FORECAST
  if (text.includes('rain') || text.includes('weather') || text.includes('forecast') || text.includes('temp') ||
      text.includes('వర్ష') || text.includes('వాన') || text.includes('వాతావరణం') || text.includes('বারिश') || text.includes('मौसम')) {
    if (isTe) {
      return "ప్రస్తుత వర్షపాతం 28 మిమీ నమోదు అయింది. ఇది పాలసీ రక్షణ థ్రెషోల్డ్ 40 మిమీ కంటే 12 మిమీ తక్కువగా ఉంది.";
    }
    if (isHi) {
      return "वर्तमान दर्ज वर्षा 28 मिमी है। यह पॉलिसी थ्रेशोल्ड 40 मिमी से 12 मिमी कम है।";
    }
    return "Current consensus rainfall is 28 mm, which is 12 mm below the 40 mm drought trigger threshold.";
  }

  // 6. OFFLINE / SYNC / NETWORK
  if (text.includes('offline') || text.includes('sync') || text.includes('network') || text.includes('internet') ||
      text.includes('ఆఫ్‌లైన్') || text.includes('నెట్‌వర్క్') || text.includes('ఇంటర్నెట్') || text.includes('ऑफलाइन')) {
    if (isTe) {
      return "క్రిషిషీల్డ్ ఆఫ్‌లైన్ మోడ్‌లోనూ పనిచేస్తుంది. మీ పాలసీ డేటా లోకల్‌గా దాచబడి ఉంటుంది మరియు నెట్‌వర్క్ రాగానే సింక్ అవుతుంది.";
    }
    if (isHi) {
      return "कृषि-शील्ड ऑफलाइन मोड में काम करता है। आपका डेटा कैश्ड रहता है और रीकनेक्ट होने पर ऑटो-सिंक होता है।";
    }
    return "KrishiShield works offline. Local policy data is cached and syncs automatically upon network reconnection.";
  }

  // 7. FIELDS / AREA / FARMS
  if (text.includes('field') || text.includes('farm') || text.includes('acre') || text.includes('area') ||
      text.includes('పొలాలు') || text.includes('చేను') || text.includes('హెక్టార్లు') || text.includes('खेत')) {
    if (isTe) {
      return "మీ వద్ద మొత్తం 24 పొలాలు ఉన్నాయి (125.6 హెక్టార్లు). ప్రస్తుతం 14 పొలాలకు క్షిషిషీల్డ్ సక్రియ రక్షణ ఉంది.";
    }
    if (isHi) {
      return "आपके कुल 24 खेत दर्ज हैं (125.6 हेक्टेयर)। इनमें से 14 खेत सक्रिय बीमा सुरक्षा में हैं।";
    }
    return "You have 24 registered fields covering 125.6 hectares, with 14 active insured plots.";
  }

  // 8. DYNAMIC DEDICATED FALLBACK FOR ANY OTHER CUSTOM QUERY
  if (isTe) {
    return `మీ ప్రశ్న: "${speechText}" — మీ పొలం సదుపాయాలు మరియు ఆరాకిల్ డేటా సక్రియంగా ఉన్నాయి. క్రిషిషీల్డ్ AI ద్వారా మీ పాలసీ సురక్షితంగా రక్షించబడుతోంది.`;
  }
  if (isHi) {
    return `आपका सवाल: "${speechText}" — आपके खेत के सभी 3 ऑरेकल सक्रिय हैं और आपकी पॉलिसी सुरक्षा जारी है।`;
  }
  return `Regarding "${speechText}": All 3 weather oracles and field sensors are online. Your ₹${amount.toLocaleString('en-IN')} policy coverage is active with 96% consensus.`;
};



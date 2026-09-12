import React, { useState } from 'react';
import { Volume2, Mic, MicOff, Sparkles, Speech } from 'lucide-react';
import { speakText, parseVoiceIntent } from '../services/speech';

export default function VoiceButton({ lang = 'te', farmerData = {}, onExplanation }) {
  const [isListening, setIsListening] = useState(false);
  const [speechOutput, setSpeechOutput] = useState(
    lang === 'te'
      ? 'మీ పాలసీకి వర్షపాతం ట్రిగ్గర్ అయింది. మీకు ఇరవై వేల రూపాయల చెల్లింపు అర్హత వచ్చింది.'
      : lang === 'hi'
      ? 'आपकी पॉलिसी में बारिश थ्रेशोल्ड ट्रिगर हुआ है। आपको 20,000 रुपये का भुगतान स्वीकृत हुआ है।'
      : 'Your policy triggered due to low rainfall. An automated parametric payout of ₹20,000 is approved.'
  );

  const samplePrompts = {
    te: [
      { label: '🌾 పాలసీ వివరాలు', text: 'నా పాలసీ వివరాలు చెప్పండి' },
      { label: '🌧️ వర్షపాతం హెచ్చరిక', text: 'ప్రస్తుత వర్షపాతం ఎంత ఉంది' },
      { label: '💰 క్లెయిమ్ అర్హత', text: 'నాకు డబ్బులు ఎప్పుడు వస్తాయి' }
    ],
    hi: [
      { label: '🌾 पॉलिसी विवरण', text: 'मेरी पॉलिसी का विवरण बताओ' },
      { label: '🌧️ बारिश स्थिति', text: 'अभी बारिश कितनी हुई है' },
      { label: '💰 क्लेम स्थिति', text: 'मेरा क्लेम का पैसा कब मिलेगा' }
    ],
    en: [
      { label: '🌾 Policy Details', text: 'Tell me about my policy details' },
      { label: '🌧️ Weather Status', text: 'What is the current rainfall weather' },
      { label: '💰 Claim Status', text: 'What is my payout claim status' }
    ]
  };

  const handleVoiceClick = () => {
    if (isListening) {
      setIsListening(false);
      return;
    }

    setIsListening(true);
    setSpeechOutput(
      lang === 'te'
        ? 'వింటున్నాను... దయచేసి మీ ప్రశ్న మాట్లాడండి!'
        : lang === 'hi'
        ? 'सुन रहा हूँ... कृपया अपना सवाल बोलें!'
        : 'Listening... Please speak your query now!'
    );

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = lang === 'te' ? 'te-IN' : lang === 'hi' ? 'hi-IN' : 'en-US';
        recognition.interimResults = false;

        recognition.onresult = (event) => {
          const transcript = event.results[0][0].transcript;
          processSpokenQuery(transcript);
        };

        recognition.onerror = () => {
          setIsListening(false);
          triggerFallbackSpeech();
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
      } catch (err) {
        setIsListening(false);
        triggerFallbackSpeech();
      }
    } else {
      triggerFallbackSpeech();
    }
  };

  const processSpokenQuery = (queryText) => {
    setIsListening(false);
    const responseText = parseVoiceIntent(queryText, lang, farmerData);
    setSpeechOutput(responseText);
    speakText(responseText, lang);
    if (onExplanation) onExplanation(responseText);
  };

  const triggerFallbackSpeech = () => {
    setIsListening(false);
    const fallbackText =
      lang === 'te'
        ? 'మీ పాలసీకి వర్షపాతం ట్రిగ్గర్ అయింది. మీకు ఇరవై వేల రూపాయల చెల్లింపు అర్హత వచ్చింది.'
        : lang === 'hi'
        ? 'आपकी पॉलिसी में बारिश थ्रेशोल्ड ट्रिगर हुआ है। आपको 20,000 रुपये का भुगतान स्वीकृत हुआ है।'
        : 'Your policy triggered due to low rainfall. An automated parametric payout of ₹20,000 is approved.';
    setSpeechOutput(fallbackText);
    speakText(fallbackText, lang);
    if (onExplanation) onExplanation(fallbackText);
  };

  return (
    <div className="flex flex-col items-center gap-3 w-full max-w-lg mx-auto select-none">
      
      {/* Main Voice Button matching screenshot */}
      <button
        onClick={handleVoiceClick}
        className={`w-full max-w-sm flex items-center justify-center space-x-2 px-6 py-3.5 rounded-full font-extrabold text-white shadow-xl transition-all transform active:scale-95 cursor-pointer ${
          isListening
            ? 'bg-rose-600 animate-pulse ring-4 ring-rose-400/50'
            : 'bg-emerald-600 hover:bg-emerald-500 border border-emerald-400/40 ring-2 ring-emerald-500/30'
        }`}
      >
        <Volume2 className={`w-5 h-5 ${isListening ? 'animate-ping' : 'animate-bounce'}`} />
        <span className="text-sm tracking-wider uppercase font-sans">
          {isListening ? 'LISTENING... (TAP TO STOP)' : '🔊 TAP TO LISTEN / SPEAK'}
        </span>
      </button>

      {/* Voice Prompt Chip Buttons */}
      <div className="flex items-center justify-center gap-1.5 flex-wrap">
        {(samplePrompts[lang] || samplePrompts.en).map((chip, idx) => (
          <button
            key={idx}
            onClick={() => processSpokenQuery(chip.text)}
            className="text-[11px] bg-[#102419]/90 hover:bg-emerald-900/60 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full font-medium transition-all shadow-sm active:scale-95 cursor-pointer"
          >
            {chip.label}
          </button>
        ))}
      </div>

      {/* Speech Response Bubble matching screenshot */}
      {speechOutput && (
        <div className="w-full bg-[#0a2318]/95 border border-emerald-500/40 px-4 py-3 rounded-2xl text-xs text-emerald-200 text-center shadow-2xl backdrop-blur-xl animate-fadeIn flex items-center justify-center gap-2 font-medium leading-relaxed border-emerald-400/30">
          <span className="text-sm">💬</span>
          <span>{speechOutput}</span>
        </div>
      )}

    </div>
  );
}


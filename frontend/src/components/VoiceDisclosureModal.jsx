import React, { useEffect } from 'react';
import { ShieldCheck, Volume2, CheckCircle, XCircle } from 'lucide-react';
import { speakText } from '../services/speech';

export default function VoiceDisclosureModal({ isOpen, onClose, onConfirm, product, lang = 'te' }) {
  if (!isOpen || !product) return null;

  const disclosureMsg = lang === 'te'
    ? `మీ పాలసీ ధర ₹${product.premium}. నిర్ణీత వ్యవధిలో వర్షపాతం 40 మిమీ కంటే తక్కువగా ఉంటే, మీరు ₹${product.coverage} పరిహారం పొందుతారు. మీకు ఇది అర్థమైందా?`
    : lang === 'hi'
    ? `आपकी पॉलिसी का मूल्य ₹${product.premium} है। यदि बारिश 40 मिमी से कम रहती है, तो आपको ₹${product.coverage} का भुगतान प्राप्त हो सकता है। क्या आप समझ गए?`
    : `Your policy costs ₹${product.premium}. If rainfall remains below 40 mm during the covered period, you may receive ₹${product.coverage}. Do you understand?`;

  useEffect(() => {
    speakText(disclosureMsg, lang);
  }, [product, lang]);

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-agri-dark border border-agri-600 rounded-3xl max-w-md w-full p-6 text-white shadow-2xl space-y-6">
        
        <div className="text-center space-y-2">
          <div className="w-16 h-16 bg-agri-600/30 text-agri-400 rounded-2xl flex items-center justify-center mx-auto border border-agri-500/30">
            <Volume2 className="w-8 h-8 animate-pulse text-emerald-400" />
          </div>
          <h3 className="text-xl font-bold text-emerald-300">🔊 VOICE DISCLOSURE</h3>
          <p className="text-xs text-gray-300">Mandatory pre-purchase comprehension check</p>
        </div>

        <div className="bg-agri-900/80 p-4 rounded-2xl border border-agri-800 text-sm text-emerald-100 leading-relaxed font-medium">
          "{disclosureMsg}"
        </div>

        <div className="text-center text-xs font-semibold text-gray-300">
          Do you understand the terms before binding your policy?
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={onConfirm}
            className="py-3 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold flex items-center justify-center gap-2 shadow-lg transition-all"
          >
            <CheckCircle className="w-5 h-5" /> 🔊 YES
          </button>
          <button
            onClick={onClose}
            className="py-3 bg-rose-900/80 hover:bg-rose-800 text-rose-200 border border-rose-700/50 rounded-xl font-bold flex items-center justify-center gap-2 transition-all"
          >
            <XCircle className="w-5 h-5" /> 🔊 NO
          </button>
        </div>

      </div>
    </div>
  );
}

import React from 'react';
import { Bot, Sparkles, CheckCircle2, MessageSquare, Clock } from 'lucide-react';

export default function AIExplanationLog({ lang = 'te' }) {
  const previousAIExplanations = [
    {
      id: 'EXP-101',
      timestamp: '2026-09-12 10:31:10',
      userQuery: lang === 'te' ? 'నా పాలసీకి ఏమైంది?' : lang === 'hi' ? 'मेरी पॉलिसी में क्या हुआ?' : 'What happened to my policy?',
      llmExplanation: lang === 'te'
        ? 'మీ వరి పంట రక్షణ పాలసీకి వర్షపాతం 28 మిమీ నమోదు అయింది. ఇది నిర్ణీత 40 మిమీ థ్రెషోల్డ్ కంటే తక్కువగా ఉన్నందున నియమాల ప్రకారం ₹20,000 చెల్లింపు మంజూరైంది.'
        : lang === 'hi'
        ? 'आपकी धान फसल पॉलिसी में वर्षा 28 मिमी दर्ज की गई। थ्रेशोल्ड 40 मिमी से कम होने के कारण ₹20,000 का स्वचालित भुगतान स्वीकृत हुआ है।'
        : 'Rainfall recorded at 28 mm, which is below your policy threshold of 40 mm. An automatic payout of ₹20,000 was authorized by deterministic rules.',
      ruleEvaluated: 'Rainfall < 40 mm',
      status: 'VERIFIED_RULE_MATCH'
    },
    {
      id: 'EXP-102',
      timestamp: '2026-09-12 09:15:22',
      userQuery: lang === 'te' ? 'వర్షపాతం డేటా నమ్మదగినదేనా?' : lang === 'hi' ? 'क्या बारिश का डेटा सटीक है?' : 'Is the rainfall data trustworthy?',
      llmExplanation: lang === 'te'
        ? 'మూడు స్వతంత్ర వర్షపాతం కేంద్రాల (Oracle A: 28mm, Oracle B: 27mm, Oracle C: 28mm) నుండి డేటా పొందబడింది. మీడియన్ కాన్సెన్సస్ 28 మిమీ నిర్ధారించబడింది.'
        : lang === 'hi'
        ? 'तीन स्वतंत्र मौसम स्रोतों (Oracle A: 28mm, Oracle B: 27mm, Oracle C: 28mm) से डेटा सत्यापित किया गया है। मीडियान सर्वसम्मति 28 मिमी है।'
        : 'Data verified across 3 independent weather sources (Oracle A: 28mm, Oracle B: 27mm, Oracle C: 28mm). Consensus established at 28 mm with HIGH confidence.',
      ruleEvaluated: 'Multi-Oracle Median Consensus',
      status: 'HIGH_CONFIDENCE'
    }
  ];

  return (
    <div className="bg-agri-dark/90 border border-agri-700/80 rounded-3xl p-6 text-white shadow-2xl backdrop-blur-md space-y-4">
      <div className="flex justify-between items-center border-b border-agri-800 pb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-emerald-600/30 text-emerald-300 rounded-xl border border-emerald-500/40">
            <Bot className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-base text-emerald-200 flex items-center gap-1.5">
              🤖 AI EXPLANATION LOG <Sparkles className="w-4 h-4 text-amber-400" />
            </h3>
            <p className="text-[11px] text-gray-300">Natural Language Audit Trail — <em>"AI Explains. Rules Decide."</em></p>
          </div>
        </div>
        <span className="text-[11px] bg-agri-900 text-emerald-300 border border-agri-700 px-3 py-1 rounded-full font-mono">
          2 Previous AI Logs
        </span>
      </div>

      <div className="space-y-3">
        {previousAIExplanations.map((exp) => (
          <div key={exp.id} className="bg-agri-900/80 p-4 rounded-2xl border border-agri-800 space-y-2 text-xs">
            
            <div className="flex justify-between items-center">
              <span className="font-semibold text-emerald-300 flex items-center gap-1">
                <MessageSquare className="w-3.5 h-3.5 text-emerald-400" /> "{exp.userQuery}"
              </span>
              <span className="text-[10px] text-gray-400 flex items-center gap-1 font-mono">
                <Clock className="w-3 h-3" /> {exp.timestamp}
              </span>
            </div>

            <p className="text-gray-200 text-xs leading-relaxed bg-black/40 p-3 rounded-xl border border-agri-800/80">
              💬 <strong>AI Explanation:</strong> {exp.llmExplanation}
            </p>

            <div className="flex flex-wrap justify-between items-center gap-2 pt-1 text-[11px]">
              <span className="text-amber-300 font-mono">Rule: {exp.ruleEvaluated}</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> {exp.status}
              </span>
            </div>

          </div>
        ))}
      </div>
    </div>
  );
}

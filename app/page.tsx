"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Sparkles, Download, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ResumeData, ChatMessage } from "@/types/resume";
import { processChatWithAI } from "@/lib/ai";
import ResumePreview from "@/components/ResumePreview";

const initialResume: ResumeData = {
  personalInfo: { fullName: "", email: "", phone: "", location: "", jobTitle: "" },
  summary: "",
  experience: [],
  education: [],
  skills: [],
  projects: []
};

export default function ResumeBuilder() {
  const [resume, setResume] = useState<ResumeData>(initialResume);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([
    { id: "1", role: "ai", content: "Welcome. I am your editorial assistant. Let us craft an elegant narrative of your career. To begin, what is your name and your desired role?" }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const resumeRef = useRef<HTMLDivElement>(null);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 200)}px`;
    }
  }, [input]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;
    
    const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", content: input };
    setChatHistory(prev => [...prev, userMsg]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await processChatWithAI(
        userMsg.content,
        resume,
        chatHistory.slice(-5)
      );
      
      const aiMsg: ChatMessage = { id: (Date.now()+1).toString(), role: "ai", content: response.message };
      setChatHistory(prev => [...prev, aiMsg]);
      if (response.resume) {
         setResume({
           ...initialResume,
           ...response.resume,
           personalInfo: { ...initialResume.personalInfo, ...(response.resume.personalInfo || {}) },
           experience: response.resume.experience || [],
           education: response.resume.education || [],
           skills: response.resume.skills || [],
           projects: response.resume.projects || []
         });
      }
    } catch (e: any) {
      console.error(e);
      setChatHistory(prev => [...prev, { id: Date.now().toString(), role: "ai", content: "My apologies, I encountered an issue. Could we try that again?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImprove = async () => {
    if (isLoading) return;
    const userMsg: ChatMessage = { id: Date.now().toString(), role: "user", content: "Please refine and elevate my summary and experiences for a highly professional tone." };
    setChatHistory(prev => [...prev, userMsg]);
    setIsLoading(true);

    try {
      const response = await processChatWithAI(
        userMsg.content,
        resume,
        chatHistory.slice(-3)
      );
      
      const aiMsg: ChatMessage = { id: (Date.now()+1).toString(), role: "ai", content: response.message };
      setChatHistory(prev => [...prev, aiMsg]);
      if (response.resume) {
        setResume({
           ...initialResume,
           ...response.resume,
           personalInfo: { ...initialResume.personalInfo, ...(response.resume.personalInfo || {}) },
           experience: response.resume.experience || [],
           education: response.resume.education || [],
           skills: response.resume.skills || [],
           projects: response.resume.projects || []
         });
      }
    } catch (e: any) {
      console.error(e);
      setChatHistory(prev => [...prev, { id: Date.now().toString(), role: "ai", content: "My apologies, I encountered an issue. Could we try that again?" }]);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadPDF = async () => {
    if (!resumeRef.current) return;
    
    // @ts-ignore
    const html2pdf = (await import("html2pdf.js")).default;
    
    const opt = {
      margin: [0, 0, 0, 0],
      filename: `${resume.personalInfo.fullName.replace(/\s+/g, '_') || "Editorial"}_Resume.pdf`,
      image: { type: 'jpeg', quality: 1 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    const el = resumeRef.current;
    html2pdf().set(opt as any).from(el).save();
  };

  return (
    <div className="flex flex-col flex-1 w-full text-[#1A1A1A] font-sans">
      
      {/* Minimal Header */}
      <header className="h-24 shrink-0 flex items-center justify-between px-8 md:px-16 w-full max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <h1 className="font-heading font-semibold text-[22px] tracking-tight text-[#1A1A1A]">
            ResumeArchitect.
          </h1>
        </div>
        
        <nav className="hidden md:flex items-center gap-10 text-[11px] uppercase tracking-[0.15em] font-semibold text-[#888]">
          <button className="hover:text-[#1A1A1A] transition-colors duration-300">Templates</button>
          <button className="hover:text-[#1A1A1A] transition-colors duration-300">Profile</button>
        </nav>

        <div className="flex items-center gap-6">
          <button 
            onClick={downloadPDF}
            className="group flex items-center gap-2 text-[11px] uppercase tracking-[0.1em] font-semibold text-[#1A1A1A] hover:text-[#5C748A] transition-colors"
          >
            <span>Export</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </header>

      {/* Main Centered Content */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-6 pt-16 pb-32 flex flex-col items-center">
        
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="text-center mb-12">
          <h2 className="font-heading text-5xl md:text-6xl tracking-tight text-[#111] mb-6 font-medium">
            Build Your Resume
          </h2>
          <p className="text-lg text-[#777] font-light max-w-xl mx-auto leading-relaxed">
            Craft a sophisticated, ATS-optimized narrative of your career. Share your journey below and watch it unfold into a beautiful document.
          </p>
        </motion.div>
        
        {/* Editorial Writing Space */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
          className="w-full bg-white/80 backdrop-blur-md shadow-[0_8px_30px_rgb(0,0,0,0.03)] rounded-[24px] p-8 md:p-12 mb-20 border border-[#EBE8E0]"
        >
          {/* Thread / History */}
          <div className="space-y-8 mb-8" ref={scrollRef}>
            <AnimatePresence initial={false}>
              {chatHistory.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, filter: "blur(4px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  transition={{ duration: 0.5 }}
                >
                  {msg.role === "user" ? (
                    <div className="text-[17px] leading-relaxed text-[#222] font-normal">
                      {msg.content}
                    </div>
                  ) : (
                    <div className="text-[15px] leading-relaxed text-[#5C748A] italic font-heading pl-4 border-l-[1.5px] border-[#D6DFE6]">
                      {msg.content}
                    </div>
                  )}
                </motion.div>
              ))}
              {isLoading && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="pl-4 border-l-[1.5px] border-[#D6DFE6]">
                  <span className="text-[#5C748A] italic font-heading flex gap-1 items-center py-1.5">
                    Refining<motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0 }}>.</motion.span>
                    <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}>.</motion.span>
                    <motion.span animate={{ opacity: [0, 1, 0] }} transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}>.</motion.span>
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Input Area */}
          <div className="relative mt-8 pt-6 border-t border-[#F0EDE8]">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Write about your experience, skills, or desired role..."
              className="w-full bg-transparent text-[17px] leading-relaxed text-[#111] focus:outline-none resize-none min-h-[60px]"
            />
            <div className="flex justify-between items-center mt-4 pt-2">
              <button 
                onClick={handleImprove}
                disabled={isLoading}
                className="flex items-center gap-2 text-[12px] uppercase tracking-[0.05em] font-semibold text-[#8C9BAA] hover:text-[#5C748A] transition-colors disabled:opacity-50"
              >
                <Sparkles size={14} /> Enhance with AI
              </button>
              
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 rounded-full flex items-center justify-center bg-[#1A1A1A] text-white hover:bg-[#333] transition-all disabled:opacity-30 disabled:hover:bg-[#1A1A1A] shadow-md"
              >
                <Send size={14} className="ml-0.5" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Output / Document */}
        {(resume.summary || resume.experience?.length > 0 || resume.personalInfo?.fullName) && (
          <motion.div 
            initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full max-w-[210mm] relative"
          >
            <div className="mb-4 text-center">
              <span className="text-[10px] uppercase tracking-[0.2em] font-semibold text-[#A09C94]">Document Output</span>
            </div>
            <ResumePreview resume={resume} onChange={setResume} ref={resumeRef} />
          </motion.div>
        )}
      </main>
    </div>
  );
}

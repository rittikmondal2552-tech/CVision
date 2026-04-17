import { forwardRef } from "react";
import { ResumeData } from "@/types/resume";

interface ResumePreviewProps {
  resume: ResumeData;
  onChange: (data: ResumeData) => void;
}

const ResumePreview = forwardRef<HTMLDivElement, ResumePreviewProps>(
  ({ resume, onChange }, ref) => {
    
    // Inline editing helper
    const handleEdit = (
      path: string[],
      value: string
    ) => {
      const newResume = { ...resume };
      let current: any = newResume;
      for (let i = 0; i < path.length - 1; i++) {
        current = current[path[i]];
      }
      current[path[path.length - 1]] = value;
      onChange(newResume);
    };

    return (
      <div 
        ref={ref}
        className="resume-a4 transition-all duration-500 overflow-hidden"
        style={{ padding: "12% 10%" }}
      >
        <div className="flex flex-col gap-10 font-sans text-[#222]">
          
          {/* Header Section */}
          <div className="flex flex-col text-center">
            <h1 
              className="text-5xl font-heading font-medium tracking-tight text-[#111] mb-2 outline-none hover:bg-black/5 transition-colors rounded p-1 -mx-1"
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleEdit(['personalInfo', 'fullName'], e.currentTarget.textContent || "")}
            >
              {resume.personalInfo.fullName || "Your Name"}
            </h1>
            
            <h2 
              className="text-lg text-[#5C748A] font-medium tracking-wide outline-none hover:bg-black/5 transition-colors rounded p-1 -mx-1 uppercase"
              contentEditable
              suppressContentEditableWarning
              onBlur={(e) => handleEdit(['personalInfo', 'jobTitle'], e.currentTarget.textContent || "")}
            >
              {resume.personalInfo.jobTitle || "Job Title"}
            </h2>
            
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[13px] text-[#706E69] mt-6">
              {resume.personalInfo.email && <span>{resume.personalInfo.email}</span>}
              {resume.personalInfo.email && resume.personalInfo.phone && <span className="opacity-40">•</span>}
              {resume.personalInfo.phone && <span>{resume.personalInfo.phone}</span>}
              {resume.personalInfo.phone && resume.personalInfo.location && <span className="opacity-40">•</span>}
              {resume.personalInfo.location && <span>{resume.personalInfo.location}</span>}
              {resume.personalInfo.location && resume.personalInfo.website && <span className="opacity-40">•</span>}
              {resume.personalInfo.website && <span>{resume.personalInfo.website}</span>}
            </div>
          </div>

          {/* Lines are avoided in this design, leveraging spacing exclusively */}

          {/* Summary */}
          {resume.summary && (
            <section className="mt-4">
              <p 
                className="text-[14px] leading-[1.8] text-[#333] outline-none hover:bg-black/5 transition-colors rounded p-1 -mx-1 font-light"
                contentEditable
                suppressContentEditableWarning
                onBlur={(e) => handleEdit(['summary'], e.currentTarget.textContent || "")}
              >
                {resume.summary}
              </p>
            </section>
          )}

          {/* Experience */}
          {resume.experience?.length > 0 && (
            <section className="pt-2">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#A09C94] mb-6">Experience</h3>
              <div className="space-y-8">
                {resume.experience.map((exp, idx) => (
                  <div key={exp.id || idx}>
                    <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline mb-1">
                      <h4 className="text-[15px] font-semibold text-[#111]">{exp.position}</h4>
                      <span className="text-[13px] text-[#A09C94] font-medium tracking-wide sm:ml-4 whitespace-nowrap uppercase">
                        {exp.startDate} {exp.startDate && exp.endDate ? '—' : ''} {exp.endDate}
                      </span>
                    </div>
                    <div className="text-[14px] text-[#5C748A] italic font-heading mb-3">{exp.company}</div>
                    <ul className="list-none space-y-2">
                      {exp.description.map((desc, dIdx) => (
                        <li key={dIdx} className="text-[14px] leading-[1.7] text-[#444] font-light relative pl-4">
                           <span className="absolute left-0 top-[0.6em] w-[4px] h-[1px] bg-[#BDBAB3] block" />
                           {desc}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Projects */}
          {resume.projects.length > 0 && (
            <section className="pt-2">
              <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#A09C94] mb-6">Selected Projects</h3>
              <div className="space-y-6">
                {resume.projects.map((proj, idx) => (
                  <div key={proj.id || idx}>
                    <div className="flex items-baseline gap-3 mb-1.5">
                      <h4 className="text-[15px] font-semibold text-[#111]">{proj.title}</h4>
                      {proj.link && (
                        <span className="text-[12px] text-[#5C748A] italic font-heading">{proj.link}</span>
                      )}
                    </div>
                    <p className="text-[14px] text-[#444] leading-[1.7] font-light">{proj.description}</p>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Education & Skills side-by-side or stacked vertically if length varies greatly */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-12 pt-2">
            
            {/* Education */}
            {resume.education.length > 0 && (
              <section>
                <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#A09C94] mb-6">Education</h3>
                <div className="space-y-5">
                  {resume.education.map((edu, idx) => (
                    <div key={edu.id || idx}>
                      <h4 className="text-[14px] font-semibold text-[#111] leading-tight">{edu.degree}</h4>
                      <div className="text-[14px] text-[#5C748A] italic font-heading mt-1">{edu.institution}</div>
                      <div className="text-[12px] text-[#A09C94] tracking-wide uppercase mt-1.5">{edu.graduationYear}</div>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Skills */}
            {resume.skills.length > 0 && (
              <section>
                <h3 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#A09C94] mb-6">Expertise</h3>
                <div className="space-y-4">
                  {resume.skills.map((skillGroup, idx) => (
                    <div key={idx}>
                      <div className="text-[11px] font-bold tracking-[0.1em] text-[#5C748A] mb-1.5 uppercase">
                        {skillGroup.category}
                      </div>
                      <div className="text-[14px] font-light text-[#444] leading-[1.6]">
                        {skillGroup.items.join(", ")}
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>

        </div>
      </div>
    );
  }
);

ResumePreview.displayName = "ResumePreview";
export default ResumePreview;

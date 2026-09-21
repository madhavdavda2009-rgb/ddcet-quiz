import os
import docx
from docx import Document
from docx.shared import Inches, Pt, RGBColor
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.table import WD_TABLE_ALIGNMENT, WD_ALIGN_VERTICAL
from docx.oxml import OxmlElement
from docx.oxml.ns import qn

def set_cell_background(cell, hex_color):
    tcPr = cell._tc.get_or_add_tcPr()
    shd = OxmlElement('w:shd')
    shd.set(qn('w:val'), 'clear')
    shd.set(qn('w:color'), 'auto')
    shd.set(qn('w:fill'), hex_color)
    tcPr.append(shd)

def set_cell_margins(cell, top=100, bottom=100, left=150, right=150):
    tcPr = cell._tc.get_or_add_tcPr()
    tcMar = OxmlElement('w:tcMar')
    for m, val in [('top', top), ('bottom', bottom), ('left', left), ('right', right)]:
        node = OxmlElement(f'w:{m}')
        node.set(qn('w:w'), str(val))
        node.set(qn('w:type'), 'dxa')
        tcMar.append(node)
    tcPr.append(tcMar)

def add_heading_styled(doc, text, level=1):
    h = doc.add_heading(text, level=level)
    h.paragraph_format.space_before = Pt(14)
    h.paragraph_format.space_after = Pt(6)
    h.paragraph_format.keep_with_next = True
    for run in h.runs:
        run.font.name = 'Calibri'
        run.font.bold = True
        if level == 1:
            run.font.size = Pt(18)
            run.font.color.rgb = RGBColor(27, 54, 93) # Deep Navy
        elif level == 2:
            run.font.size = Pt(14)
            run.font.color.rgb = RGBColor(0, 102, 204) # Royal Blue
        else:
            run.font.size = Pt(12)
            run.font.color.rgb = RGBColor(51, 51, 51)
    return h

def generate():
    doc = Document()

    # Set document margins (1 inch all around)
    sections = doc.sections
    for section in sections:
        section.top_margin = Inches(1)
        section.bottom_margin = Inches(1)
        section.left_margin = Inches(1)
        section.right_margin = Inches(1)

    # Base styling
    style = doc.styles['Normal']
    font = style.font
    font.name = 'Calibri'
    font.size = Pt(11)
    font.color.rgb = RGBColor(34, 34, 34)

    # =========================================================================
    # PAGE 1: COVER PAGE (LJ POLYTECHNIC TITLE PAGE)
    # =========================================================================
    p_college = doc.add_paragraph()
    p_college.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_college = p_college.add_run("LJ POLYTECHNIC")
    r_college.font.name = 'Calibri'
    r_college.font.size = Pt(26)
    r_college.font.bold = True
    r_college.font.color.rgb = RGBColor(27, 54, 93)
    p_college.paragraph_format.space_after = Pt(24)

    p_sub = doc.add_paragraph()
    p_sub.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_sub = p_sub.add_run("A MINI PROJECT REPORT ON")
    r_sub.font.name = 'Calibri'
    r_sub.font.size = Pt(14)
    r_sub.font.bold = True
    p_sub.paragraph_format.space_after = Pt(12)

    p_title = doc.add_paragraph()
    p_title.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_title = p_title.add_run("DDCET PRACTICE QUIZ APPLICATION")
    r_title.font.name = 'Calibri'
    r_title.font.size = Pt(20)
    r_title.font.bold = True
    r_title.font.color.rgb = RGBColor(0, 102, 204)
    p_title.paragraph_format.space_after = Pt(12)

    p_year = doc.add_paragraph()
    p_year.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_year = p_year.add_run("(2026 - 2027)")
    r_year.font.name = 'Calibri'
    r_year.font.size = Pt(14)
    r_year.font.bold = True
    p_year.paragraph_format.space_after = Pt(24)

    p_subject = doc.add_paragraph()
    p_subject.alignment = WD_ALIGN_PARAGRAPH.CENTER
    r_subject = p_subject.add_run("EMERGING TRENDS & TECHNOLOGIES")
    r_subject.font.name = 'Calibri'
    r_subject.font.size = Pt(16)
    r_subject.font.bold = True
    r_subject.font.color.rgb = RGBColor(27, 54, 93)
    p_subject.paragraph_format.space_after = Pt(36)

    p_submitted = doc.add_paragraph()
    r_submitted = p_submitted.add_run("Submitted by:")
    r_submitted.font.name = 'Calibri'
    r_submitted.font.size = Pt(12)
    r_submitted.font.bold = True
    p_submitted.paragraph_format.space_after = Pt(10)

    # Student Table
    table = doc.add_table(rows=7, cols=3)
    table.alignment = WD_TABLE_ALIGNMENT.CENTER
    table.autofit = False

    headers = ["Sr.", "Enrollment Number", "Student Name"]
    col_widths = [Inches(0.8), Inches(2.2), Inches(3.5)]

    # Style Header Row
    hdr_cells = table.rows[0].cells
    for i, title in enumerate(headers):
        hdr_cells[i].text = title
        set_cell_background(hdr_cells[i], "1B365D")
        set_cell_margins(hdr_cells[i], top=120, bottom=120, left=150, right=150)
        p = hdr_cells[i].paragraphs[0]
        p.alignment = WD_ALIGN_PARAGRAPH.LEFT
        for run in p.runs:
            run.font.bold = True
            run.font.color.rgb = RGBColor(255, 255, 255)

    # Fill Student rows
    for r_idx in range(1, 7):
        row_cells = table.rows[r_idx].cells
        row_cells[0].text = str(r_idx)
        row_cells[1].text = "" # Blank for student to write/fill
        row_cells[2].text = "" # Blank for student to write/fill
        
        bg_color = "F8F9FA" if r_idx % 2 == 1 else "FFFFFF"
        for i in range(3):
            set_cell_background(row_cells[i], bg_color)
            set_cell_margins(row_cells[i], top=100, bottom=100, left=150, right=150)
            row_cells[i].width = col_widths[i]

    p_space = doc.add_paragraph()
    p_space.paragraph_format.space_after = Pt(20)

    # Instructions Box
    p_inst_title = doc.add_paragraph()
    r_inst_t = p_inst_title.add_run("Instruction:-")
    r_inst_t.font.bold = True
    r_inst_t.font.size = Pt(11)

    instructions = [
        "Write the students in ascending order according to their Enrollment Number.",
        "Write the Student Name exactly as mentioned on the College I-Card.",
        "Write all student names in CAPITAL LETTERS.",
        "Ensure that each Enrollment Number matches the correct Student Name.",
        "Check the Enrollment Numbers carefully before final submission."
    ]

    for inst in instructions:
        p_inst = doc.add_paragraph(style='List Bullet')
        p_inst.paragraph_format.space_before = Pt(2)
        p_inst.paragraph_format.space_after = Pt(2)
        r = p_inst.add_run(inst)
        r.font.size = Pt(10)
        r.font.italic = True

    doc.add_page_break()

    # =========================================================================
    # SECTION 1: INTRODUCTION TO YOUR PROJECT
    # =========================================================================
    add_heading_styled(doc, "1. Introduction to Your Project", level=1)

    p_pname = doc.add_paragraph()
    r_lbl = p_pname.add_run("Project Title: ")
    r_lbl.font.bold = True
    r_val = p_pname.add_run("Smart DDCET Practice Quiz Application")
    r_val.font.bold = True
    r_val.font.color.rgb = RGBColor(0, 102, 204)
    p_pname.paragraph_format.space_after = Pt(12)

    p_intro1 = doc.add_paragraph()
    p_intro1.paragraph_format.space_after = Pt(10)
    p_intro1.paragraph_format.line_spacing = 1.15
    p_intro1.add_run(
        "The Smart DDCET Practice Quiz Application is a comprehensive, responsive full-stack web application "
        "specifically designed to aid diploma engineering students in Gujarat preparing for the Diploma to Degree "
        "Common Entrance Test (DDCET). The system mimics the authentic GTU / ACPC entrance examination environment, "
        "enabling students to evaluate their conceptual knowledge, speed, and accuracy under real-time exam conditions."
    )

    p_intro2 = doc.add_paragraph()
    p_intro2.paragraph_format.space_after = Pt(10)
    p_intro2.paragraph_format.line_spacing = 1.15
    p_intro2.add_run(
        "The frontend of the application is built using React.js and Vite, providing a fast, modular, and interactive "
        "user experience. The application features dual practice modes: a complete 100-question timed simulation with an "
        "active countdown timer (2 Hours 30 Minutes), auto-submission, and negative marking (-0.5 marks per wrong answer), "
        "as well as a targeted Subject Practice mode providing instant feedback and detailed solution explanations."
    )

    p_intro3 = doc.add_paragraph()
    p_intro3.paragraph_format.space_after = Pt(12)
    p_intro3.paragraph_format.line_spacing = 1.15
    p_intro3.add_run(
        "The main objective of this project is to eliminate exam anxiety, replace manual paper-based practice with automated "
        "performance analytics, provide instant subject-wise feedback (BE-01 Science & Engineering and BE-02 Aptitude), "
        "and empower students with local history tracking to measure their progress over time."
    )

    # Key Features List
    add_heading_styled(doc, "Key System Modules & Features", level=2)
    
    features = [
        ("Authentic DDCET Exam Pattern: ", "Includes all 100 MCQs carrying 200 Marks distributed across Physics (30Q), Chemistry (10Q), Computer Practice (5Q), Environmental Science (5Q), Mathematics (25Q), and English/Soft Skills (25Q)."),
        ("Dual Test Modes: ", "Full 100Q Timed Mock Exam mode with 150-minute countdown timer and auto-submission, plus Practice by Subject mode with immediate answer verification."),
        ("Interactive Question Navigator Palette: ", "A 100-question color-coded palette grid with quick subject tabs and live status indicators (Answered, Unanswered, Marked for Review, Marked & Answered)."),
        ("Real-time Countdown Timer: ", "Built using React useEffect hooks with HH:MM:SS live display, low-time visual alerts, and automatic paper submission upon timer expiry."),
        ("Submission Verification Modal: ", "Displays a summary of attempted, unattempted, and bookmarked questions before final paper lock."),
        ("Detailed Performance Analytics: ", "Calculates final score out of 200, percentage, negative marking breakdown, and separate section scores for Paper BE-01 and Paper BE-02."),
        ("Filterable Answer Review System: ", "Allows students to inspect each question, compare official answer keys against their responses, read explanations, and filter by Correct, Incorrect, or Unattempted."),
        ("Test History & LocalStorage Persistence: ", "Saves test attempt history locally with date, score, time taken, and progress trends without requiring external server latency.")
    ]

    for title, desc in features:
        p_feat = doc.add_paragraph(style='List Bullet')
        p_feat.paragraph_format.space_before = Pt(3)
        p_feat.paragraph_format.space_after = Pt(3)
        r_t = p_feat.add_run(title)
        r_t.font.bold = True
        r_d = p_feat.add_run(desc)

    doc.add_page_break()

    # =========================================================================
    # SECTION 2: ALL AI PROMPTS USED FOR PROJECT DEFINITION
    # =========================================================================
    add_heading_styled(doc, "2. All AI Prompts Used for Project Definition", level=1)

    p_prompt_intro = doc.add_paragraph()
    p_prompt_intro.paragraph_format.space_after = Pt(12)
    p_prompt_intro.add_run(
        "Below are the actual AI prompts used during the planning, architectural design, state management setup, "
        "scoring algorithm implementation, UI component creation, and optimization of the DDCET Practice Quiz Application."
    )

    prompts = [
        ("Prompt 1: Project Concept & Requirement Gathering",
         '"Suggest a complete web application project architecture using React.js and Vite for diploma engineering students in Gujarat preparing for the DDCET entrance examination. The project should simulate the official GTU/ACPC 100-question paper with negative marking and real-time timing."'),
        
        ("Prompt 2: Exam Pattern & Question Data Schema Definition",
         '"Create a JSON/JavaScript data schema to store 100 DDCET entrance exam questions divided into Section 01 (BE-01: Physics 30Q, Chemistry 10Q, Computer 5Q, Environmental 5Q) and Section 02 (BE-02: Mathematics 25Q, English 25Q). Each question object must include id, question text, options list, correct answer index, subject name, section name, and detailed explanation."'),
        
        ("Prompt 3: Modular React Component Architecture",
         '"Design a clean modular React component hierarchy for a quiz application. Components must include Navbar, Home Dashboard, QuestionCard, Option, QuestionNavigator palette, CountdownTimer, SubmitModal, ResultAnalytics, ReviewAnswers, and History tracker."'),
        
        ("Prompt 4: Real-time Countdown Timer & Auto-Submit Hook",
         '"Write a React custom hook or useEffect timer managing a 150-minute countdown (9000 seconds). The timer must update every second, format time as HH:MM:SS, trigger visual warning styling when under 5 minutes remain, and automatically call the submit handler when time reaches 00:00:00 without losing candidate responses."'),
        
        ("Prompt 5: 100-Question Color-Coded Palette Navigator",
         '"Create a React QuestionNavigator palette component that renders a 100-button grid with subject filter tabs (All, Physics, Chemistry, Maths, etc.). Buttons should change background colors dynamically based on question status: Green for Answered, Slate for Unanswered, Purple for Marked for Review, and Purple Checkmark for Marked & Answered."'),
        
        ("Prompt 6: Scoring Logic & Negative Marking Algorithm",
         '"Write a pure JavaScript function calculateScore(activeQuestions, selectedAnswers) enforcing the official DDCET marking scheme: +2 marks for each correct answer, -0.5 marks for each incorrect answer, 0 marks for unattempted questions. Return total score out of 200, percentage, section breakdowns for BE-01 and BE-02, and subject-wise metrics."'),
        
        ("Prompt 7: Filterable Answer Review & Solution System",
         '"Implement a ReviewAnswers component that lets students review their test performance question by question. Include quick filter tabs for All Questions, Correct Only, Incorrect Only, and Unattempted Only, displaying student choice vs correct answer and step-by-step explanations."'),
        
        ("Prompt 8: LocalStorage Attempt Persistence & Analytics",
         '"Create utility functions saveAttemptRecord() and getAttemptHistory() using browser LocalStorage to store attempt logs with timestamps, score summaries, mode, and time spent. Build an analytics calculator for computing average score and total tests taken."'),
        
        ("Prompt 9: Responsive UI Styling & Theme Support",
         '"Write CSS styling for a modern dashboard using CSS custom properties for light and dark themes. Include gradient badges, card elevation effects, smooth transitions, responsive grid layouts for mobile and desktop, and styled modal overlays."'),
        
        ("Prompt 10: Validation & Production Optimization",
         '"Write a validation script to check that all 100 questions in masterQuestions have valid IDs, non-empty options, non-null answer indexes, and valid subject tags before the application mounts. Ensure zero memory leaks during timer updates and production Vite build."')
    ]

    for title, prompt_text in prompts:
        add_heading_styled(doc, title, level=2)
        
        # Prompt Box (Table styling)
        p_tbl = doc.add_table(rows=1, cols=1)
        p_tbl.alignment = WD_TABLE_ALIGNMENT.CENTER
        cell = p_tbl.rows[0].cells[0]
        set_cell_background(cell, "F0F4F8")
        set_cell_margins(cell, top=100, bottom=100, left=150, right=150)
        
        cp = cell.paragraphs[0]
        cp.paragraph_format.space_before = Pt(4)
        cp.paragraph_format.space_after = Pt(4)
        r_pt = cp.add_run(prompt_text)
        r_pt.font.size = Pt(10)
        r_pt.font.italic = True
        r_pt.font.color.rgb = RGBColor(40, 40, 40)
        
        doc.add_paragraph().paragraph_format.space_after = Pt(6)

    doc.add_page_break()

    # =========================================================================
    # SECTION 3: SCREENSHOTS OF FINAL WEBSITE PAGES
    # =========================================================================
    add_heading_styled(doc, "3. Screenshots of Final Website Pages", level=1)

    p_ss_intro = doc.add_paragraph()
    p_ss_intro.paragraph_format.space_after = Pt(16)
    p_ss_intro.add_run(
        "Below are high-resolution screenshots capturing the core working pages, user flows, testing modes, "
        "question navigation palette, verification dialogs, detailed score reports, answer review interfaces, "
        "and history tracking of the final DDCET Practice Quiz Application."
    )

    ss_dir = os.path.join(os.path.dirname(__file__), 'screenshots')

    screenshots_info = [
        ("Figure 1: Home Dashboard & DDCET Portal Overview",
         "01_home_dashboard.png",
         "The home landing dashboard features the Gujarat DDCET Entrance Exam Portal header, official exam structure cards (100 MCQs, 200 Marks, 150 Mins), mode selection actions, recent performance summary card, and subject breakdown grid."),
        
        ("Figure 2: Timed Full Mock Test Interface",
         "02_full_mock_test.png",
         "The full mock test view displays the live 150-minute countdown timer, subject badge, current question card, single-select options, Clear Answer control, and Mark for Review toggle."),
        
        ("Figure 3: Interactive 100-Question Navigator Palette",
         "03_question_navigator.png",
         "The 100-question navigator grid provides instant jumps across all exam questions, color-coded status badges (Answered, Unanswered, Marked for Review), and subject filter tabs."),
        
        ("Figure 4: Targeted Subject Practice Mode",
         "04_subject_practice.png",
         "Subject practice mode enables diploma students to practice targeted subjects (e.g., Mathematics, Physics) with immediate answer verification and solution explanations."),
        
        ("Figure 5: Detailed Results & Performance Analytics",
         "06_results_analytics.png",
         "The results dashboard presents the total score out of 200, percentage badge, separate performance breakdowns for BE-01 (Science & Engineering) and BE-02 (Aptitude), negative marks deduction, and subject progress bars."),
        
        ("Figure 6: Answer Review System with Solution Keys",
         "07_answer_review.png",
         "The filterable review page allows candidates to inspect every question, compare official correct answers with their selected options, read step-by-step solutions, and filter by Correct, Incorrect, or Unattempted."),
        
        ("Figure 7: Saved Test History & Progress Log",
         "08_test_history.png",
         "The test history page stores all past exam attempts in LocalStorage, displaying dates, test modes, total score, percentage, time spent, and overall performance average."),
        
        ("Figure 8: Dark Theme & Responsive UI Layout",
         "09_dark_mode_history.png",
         "The application features full dark mode support toggled seamlessly via the navigation bar, offering reduced eye strain for long study sessions across desktop and mobile devices.")
    ]

    for title, img_filename, desc in screenshots_info:
        img_path = os.path.join(ss_dir, img_filename)
        if os.path.exists(img_path):
            add_heading_styled(doc, title, level=2)
            
            # Embed image with 6 inch width
            doc.add_picture(img_path, width=Inches(6.2))
            last_paragraph = doc.paragraphs[-1]
            last_paragraph.alignment = WD_ALIGN_PARAGRAPH.CENTER
            last_paragraph.paragraph_format.space_after = Pt(4)
            
            # Caption & Description
            p_desc = doc.add_paragraph()
            p_desc.paragraph_format.space_after = Pt(16)
            p_desc.alignment = WD_ALIGN_PARAGRAPH.CENTER
            r_d = p_desc.add_run(f"Description: {desc}")
            r_d.font.size = Pt(9.5)
            r_d.font.italic = True
            r_d.font.color.rgb = RGBColor(80, 80, 80)
        else:
            print(f"Warning: Image {img_filename} not found.")

    # Save document
    out_filename = "Reactra_Documentation_DDCET_Quiz.docx"
    out_path = os.path.join(os.path.dirname(__file__), out_filename)
    doc.save(out_path)
    print(f"Document saved to {out_path}")

    # Also save copy to Downloads folder for student convenience
    downloads_path = r"C:\Users\Asus\Downloads\Reactra_Documentation_DDCET_Quiz.docx"
    doc.save(downloads_path)
    print(f"Document copy saved to {downloads_path}")

if __name__ == '__main__':
    generate()

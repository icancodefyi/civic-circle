import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import jsPDF from 'jspdf';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    // Fetch all reports from the backend
    const reportsResponse = await fetch('http://localhost:8080/api/reports');
    
    if (!reportsResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to fetch reports' },
        { status: 500 }
      );
    }

    const reports = await reportsResponse.json();

    if (!reports || reports.length === 0) {
      return NextResponse.json(
        { error: 'No reports found' },
        { status: 404 }
      );
    }

    // Prepare data for Gemini
    const reportsData = reports.map((report: any, index: number) => ({
      number: index + 1,
      title: report.title,
      description: report.description,
      category: report.category,
      priority: report.priority || 'Not Set',
      status: report.status,
      address: report.address || 'Not provided',
      createdBy: report.createdBy || 'Anonymous',
      createdAt: new Date(report.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
    }));

    // Create prompt for Gemini
    const prompt = `You are a municipal report analyst. I have ${reports.length} civic reports that need to be summarized in a professional, human-readable format for a municipal authority review document.

Here are the reports:
${JSON.stringify(reportsData, null, 2)}

Please create a comprehensive executive summary that includes:

1. **Overview Section**: A brief 2-3 sentence overview of the total reports, their general nature, and overall community concerns.

2. **Key Statistics**: Present the breakdown by:
   - Status (Pending, In Progress, Resolved, Rejected, Closed)
   - Category (types of issues)
   - Priority levels
   - Time period covered

3. **Critical Issues**: Highlight the most urgent or important reports (priority HIGH or URGENT) with brief summaries.

4. **Category Analysis**: Group reports by category and provide insights into each category's issues.

5. **Recommendations**: Based on the reports, provide 3-5 actionable recommendations for the municipal authority.

6. **Detailed Report Summaries**: For each report, write a clear, professional summary in paragraph form that includes:
   - Report number and title
   - What the issue is about
   - Location and reporter information
   - Current status and priority
   - Key concerns

Format the response in a clean, professional manner suitable for a PDF document. Use clear headings and organize the information logically. Write in a formal but accessible tone suitable for government officials and administrators.`;

    // Generate summary using Gemini 2.5 Flash
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash-exp' });
    const result = await model.generateContent(prompt);
    const summary = result.response.text();

    // Generate PDF with proper formatting
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
    });

    // PDF Styling Constants
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;
    const maxLineWidth = pageWidth - 2 * margin;
    let yPosition = margin;

    // Helper function to check if we need a new page
    const checkNewPage = (requiredSpace: number = 10) => {
      if (yPosition + requiredSpace > pageHeight - margin - 15) {
        pdf.addPage();
        yPosition = margin;
        return true;
      }
      return false;
    };

    // Helper function to add text with word wrap
    const addText = (
      text: string,
      fontSize: number,
      fontStyle: 'normal' | 'bold' | 'italic' = 'normal',
      color: number[] = [0, 0, 0],
      indent: number = 0
    ) => {
      pdf.setFontSize(fontSize);
      pdf.setFont('helvetica', fontStyle);
      pdf.setTextColor(color[0], color[1], color[2]);

      const effectiveWidth = maxLineWidth - indent;
      const lines = pdf.splitTextToSize(text, effectiveWidth);
      
      lines.forEach((line: string, index: number) => {
        checkNewPage();
        const xPos = margin + indent;
        pdf.text(line, xPos, yPosition);
        yPosition += fontSize / 2 + 2;
      });
      
      yPosition += 2; // Extra spacing after text block
    };

    // Add Professional Header
    pdf.setFillColor(79, 70, 229); // Indigo color
    pdf.rect(0, 0, pageWidth, 45, 'F');
    
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(28);
    pdf.setFont('helvetica', 'bold');
    pdf.text('CivicCircle', margin, 22);
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'normal');
    pdf.text('Community Reports Summary', margin, 32);

    // Add date
    const today = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    pdf.setFontSize(10);
    pdf.text(`Generated: ${today}`, pageWidth - margin - 70, 27, { align: 'right' });

    yPosition = 60;

    // Add decorative line
    pdf.setDrawColor(79, 70, 229);
    pdf.setLineWidth(1);
    pdf.line(margin, yPosition, pageWidth - margin, yPosition);
    yPosition += 12;

    // Parse markdown and render with proper formatting
    const lines = summary.split('\n');
    let inCodeBlock = false;
    let inList = false;
    let listLevel = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      const trimmedLine = line.trim();

      // Skip empty lines but add spacing
      if (!trimmedLine) {
        if (!inCodeBlock) {
          yPosition += 3;
        }
        continue;
      }

      // Code blocks
      if (trimmedLine.startsWith('```')) {
        inCodeBlock = !inCodeBlock;
        continue;
      }

      if (inCodeBlock) {
        checkNewPage();
        pdf.setFillColor(245, 245, 245);
        pdf.rect(margin, yPosition - 4, maxLineWidth, 8, 'F');
        addText(trimmedLine, 9, 'normal', [50, 50, 50], 5);
        continue;
      }

      // Main headings (##)
      if (trimmedLine.match(/^##\s+/)) {
        const headingText = trimmedLine.replace(/^##\s+/, '').replace(/\*\*/g, '');
        checkNewPage(20);
        yPosition += 8;
        
        // Add colored background for heading
        pdf.setFillColor(79, 70, 229);
        pdf.rect(margin - 5, yPosition - 6, maxLineWidth + 10, 10, 'F');
        
        addText(headingText, 16, 'bold', [255, 255, 255]);
        yPosition += 3;
        continue;
      }

      // Sub headings (#)
      if (trimmedLine.match(/^#\s+/)) {
        const headingText = trimmedLine.replace(/^#\s+/, '').replace(/\*\*/g, '');
        checkNewPage(15);
        yPosition += 6;
        addText(headingText, 14, 'bold', [79, 70, 229]);
        yPosition += 2;
        continue;
      }

      // Bold headings (**text**)
      if (trimmedLine.match(/^\*\*[^*]+\*\*$/)) {
        const headingText = trimmedLine.replace(/\*\*/g, '');
        checkNewPage(12);
        yPosition += 4;
        addText(headingText, 13, 'bold', [30, 30, 30]);
        yPosition += 1;
        continue;
      }

      // Numbered lists with bold (1. **text**)
      if (trimmedLine.match(/^\d+\.\s+\*\*/)) {
        const text = trimmedLine.replace(/^\d+\.\s+/, '').replace(/\*\*/g, '');
        checkNewPage();
        addText(`${trimmedLine.match(/^\d+/)?.[0]}. ${text}`, 11, 'bold', [50, 50, 50]);
        inList = true;
        continue;
      }

      // Bullet points with various markers (*, -, •)
      if (trimmedLine.match(/^[\*\-•]\s+/)) {
        const bulletText = trimmedLine.replace(/^[\*\-•]\s+/, '');
        
        // Detect nesting level
        const leadingSpaces = line.search(/\S/);
        listLevel = Math.floor(leadingSpaces / 4);
        const indent = 5 + (listLevel * 8);
        
        checkNewPage();
        
        // Clean up markdown formatting in bullet text
        let cleanText = bulletText.replace(/\*\*/g, '');
        
        // Add bullet symbol
        pdf.setFont('helvetica', 'normal');
        pdf.setFontSize(11);
        pdf.setTextColor(79, 70, 229);
        pdf.text('•', margin + indent - 3, yPosition);
        
        // Add bullet text
        addText(cleanText, 10, 'normal', [50, 50, 50], indent);
        inList = true;
        continue;
      }

      // Regular paragraphs
      if (trimmedLine) {
        // Clean markdown formatting
        let cleanText = trimmedLine
          .replace(/\*\*([^*]+)\*\*/g, '$1') // Remove bold markers but keep text
          .replace(/\*([^*]+)\*/g, '$1')     // Remove italic markers
          .replace(/`([^`]+)`/g, '$1');      // Remove code markers

        checkNewPage();
        
        // Check if this line has bold sections we want to preserve
        if (trimmedLine.includes('**')) {
          // Parse and render with mixed formatting
          const parts = trimmedLine.split(/(\*\*[^*]+\*\*)/g);
          let xPos = margin;
          
          parts.forEach(part => {
            if (part.match(/^\*\*[^*]+\*\*$/)) {
              const boldText = part.replace(/\*\*/g, '');
              pdf.setFont('helvetica', 'bold');
              pdf.setFontSize(11);
              pdf.setTextColor(30, 30, 30);
              pdf.text(boldText + ' ', xPos, yPosition);
              xPos += pdf.getTextWidth(boldText + ' ');
            } else if (part.trim()) {
              pdf.setFont('helvetica', 'normal');
              pdf.setFontSize(11);
              pdf.setTextColor(50, 50, 50);
              pdf.text(part, xPos, yPosition);
              xPos += pdf.getTextWidth(part);
            }
          });
          yPosition += 7;
        } else {
          addText(cleanText, 11, 'normal', [50, 50, 50]);
        }
        
        inList = false;
      }
    }

    // Add professional footer to all pages
    const totalPages = pdf.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      pdf.setPage(i);
      
      // Footer line
      pdf.setDrawColor(200, 200, 200);
      pdf.setLineWidth(0.5);
      pdf.line(margin, pageHeight - 15, pageWidth - margin, pageHeight - 15);
      
      // Page number
      pdf.setFontSize(9);
      pdf.setTextColor(100, 100, 100);
      pdf.setFont('helvetica', 'bold');
      pdf.text(
        `Page ${i} of ${totalPages}`,
        pageWidth / 2,
        pageHeight - 8,
        { align: 'center' }
      );
      
      // Footer text
      pdf.setFont('helvetica', 'normal');
      pdf.text(
        'CivicCircle - Community Report Management System',
        margin,
        pageHeight - 8
      );
    }

    // Convert PDF to base64
    const pdfBase64 = pdf.output('datauristring');

    return NextResponse.json({
      success: true,
      pdf: pdfBase64,
      reportCount: reports.length,
      generatedAt: new Date().toISOString(),
    });

  } catch (error) {
    console.error('Error generating report summary:', error);
    return NextResponse.json(
      { error: 'Failed to generate report summary', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}

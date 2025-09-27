import { NextRequest, NextResponse } from 'next/server';
import { jsPDF } from 'jspdf';
import { GoogleGenerativeAI } from '@google/generative-ai';

type Report = {
  id: number;
  title: string;
  description: string;
  category: string;
  status: string;
  priority?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  createdAt: string;
  updatedAt?: string;
  createdBy?: string;
};

type AIGeneratedSummary = {
  executiveSummary: string;
  keyFindings: string[];
  recommendedActions: string[];
  urgencyAssessment: string;
  impactAnalysis: string;
  nextSteps: string[];
};

// Initialize Gemini AI
const apiKey = process.env.GOOGLE_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

// Helper function to generate fallback summary when AI is not available
function generateFallbackSummary(report: Report): AIGeneratedSummary {
  return {
    executiveSummary: `This ${report.category.toLowerCase()} report titled "${report.title}" requires attention from local zaid`,
    keyFindings: [
      `Report is currently in ${report.status.replace('_', ' ').toLowerCase()} status`,
      `Issue reported on ${new Date(report.createdAt).toLocaleDateString()}`,
      report.priority ? `Priority level: ${report.priority}` : 'Priority level not specified'
    ],
    recommendedActions: [
      'Review the report details thoroughly',
      'Assign appropriate personnel for investigation',
      'Develop an action plan for resolution'
    ],
    urgencyAssessment: report.priority === 'URGENT' ? 'High' : report.priority === 'HIGH' ? 'Medium' : 'Low',
    impactAnalysis: `This ${report.category.toLowerCase()} issue may affect community well-being and requires timely intervention to prevent escalation.`,
    nextSteps: [
      'Conduct site inspection if applicable',
      'Gather additional information from stakeholders',
      'Implement corrective measures'
    ]
  };
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const reportId = searchParams.get('reportId');

  if (!reportId) {
    return NextResponse.json({ error: 'Report ID is required' }, { status: 400 });
  }

  try {
    // Fetch the report data from the backend
    const response = await fetch(`http://localhost:8080/api/reports/${reportId}`);
    
    if (!response.ok) {
      return NextResponse.json({ error: 'Report not found' }, { status: 404 });
    }

    const report: Report = await response.json();

    // Generate AI-powered summary using Gemini Flash 2.0
    let aiSummary: AIGeneratedSummary;
    
    // Check if API key is available and valid
    if (!apiKey || !genAI) {
      console.log('Google API key not configured, using fallback summary');
      // Use fallback immediately if no API key
      aiSummary = generateFallbackSummary(report);
    } else {
      try {
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });
      
      const prompt = `
        You are a professional civic report analyst. Analyze the following civic report and provide a comprehensive summary in JSON format.
        
        Report Details:
        - Title: ${report.title}
        - Category: ${report.category}
        - Status: ${report.status}
        - Priority: ${report.priority || 'Not specified'}
        - Description: ${report.description}
        - Location: ${report.address || 'Address not provided'}
        - Created: ${report.createdAt}
        - Updated: ${report.updatedAt || 'Not updated'}
        - Created By: ${report.createdBy || 'Anonymous'}
        
        Please provide a JSON response with the following structure:
        {
          "executiveSummary": "A concise 2-3 sentence overview of the report",
          "keyFindings": ["Finding 1", "Finding 2", "Finding 3"],
          "recommendedActions": ["Action 1", "Action 2", "Action 3"],
          "urgencyAssessment": "Assessment of how urgent this issue is (Low/Medium/High/Critical)",
          "impactAnalysis": "2-3 sentences about the potential impact on the community",
          "nextSteps": ["Step 1", "Step 2", "Step 3"]
        }
        
        Focus on civic governance, community impact, and actionable insights. Be professional and objective.
      `;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text();
      
      // Parse the JSON response
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        aiSummary = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error('Invalid AI response format');
      }
    } catch (aiError) {
      console.error('AI generation failed, using fallback:', aiError);
      // Fallback summary if AI fails
      aiSummary = {
        executiveSummary: `This ${report.category.toLowerCase()} report titled "${report.title}" requires attention from zaid rakhange`,
        keyFindings: [
          `Report is currently in ${report.status.replace('_', ' ').toLowerCase()} status`,
          `Issue reported on ${new Date(report.createdAt).toLocaleDateString()}`,
          report.priority ? `Priority level: ${report.priority}` : 'Priority level not specified'
        ],
        recommendedActions: [
          'Review the report details thoroughly',
          'Assign appropriate personnel for investigation',
          'Develop an action plan for resolution'
        ],
        urgencyAssessment: report.priority === 'URGENT' ? 'High' : report.priority === 'HIGH' ? 'Medium' : 'Low',
        impactAnalysis: `This ${report.category.toLowerCase()} issue may affect community well-being and requires timely intervention to prevent escalation.`,
        nextSteps: [
          'Conduct site inspection if applicable',
          'Gather additional information from stakeholders',
          'Implement corrective measures'
        ]
      };
      }
    }

    // Create Professional PDF document
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    const pageHeight = doc.internal.pageSize.height;
    const margin = 20;
    const maxWidth = pageWidth - 2 * margin;
    
    // Color scheme
    const colors = {
      primary: [41, 128, 185], // Blue
      secondary: [52, 73, 94], // Dark blue-gray
      accent: [231, 76, 60], // Red for urgent items
      success: [39, 174, 96], // Green
      text: [44, 62, 80], // Dark gray
      lightGray: [149, 165, 166]
    };

    // Helper functions
    const addWrappedText = (text: string, x: number, y: number, maxWidth: number, fontSize: number = 12, lineHeight: number = 1.5): number => {
      doc.setFontSize(fontSize);
      const lines = doc.splitTextToSize(text, maxWidth);
      doc.text(lines, x, y);
      return y + (lines.length * fontSize * lineHeight * 0.5);
    };

    const addSectionHeader = (title: string, y: number, color: number[] = colors.primary): number => {
      // Background rectangle for header
      doc.setFillColor(color[0], color[1], color[2]);
      doc.rect(margin, y - 8, maxWidth, 16, 'F');
      
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(255, 255, 255);
      doc.text(title, margin + 5, y + 2);
      
      doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
      return y + 20;
    };

    const addBulletPoint = (text: string, x: number, y: number, maxWidth: number): number => {
      doc.setFont('helvetica', 'normal');
      doc.text('•', x, y);
      return addWrappedText(text, x + 8, y, maxWidth - 8, 11);
    };

    let currentY = 30;

    // Professional Header with Logo Area
    doc.setFillColor(colors.primary[0], colors.primary[1], colors.primary[2]);
    doc.rect(0, 0, pageWidth, 50, 'F');
    
    doc.setFontSize(28);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('CIVIC CIRCLE', margin, 25);
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    doc.text('Professional Report Analysis', margin, 40);

    // Report header info
    doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
    doc.setFontSize(12);
    const generatedDate = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
    doc.text(`Generated: ${generatedDate}`, pageWidth - margin - 80, 35);

    currentY = 70;

    // Executive Summary Section
    currentY = addSectionHeader('EXECUTIVE SUMMARY', currentY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    currentY = addWrappedText(aiSummary.executiveSummary, margin + 5, currentY, maxWidth - 10, 12, 1.6);
    currentY += 15;

    // Report Information Box
    currentY = addSectionHeader('REPORT DETAILS', currentY, colors.secondary);
    
    // Create a bordered box for report details
    doc.setDrawColor(colors.lightGray[0], colors.lightGray[1], colors.lightGray[2]);
    doc.setLineWidth(1);
    doc.rect(margin + 5, currentY, maxWidth - 10, 85);
    
    const detailsStartY = currentY + 10;
    let detailY = detailsStartY;
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    
    // Report details in two columns
    const col1X = margin + 10;
    const col2X = margin + maxWidth/2 + 5;
    
    doc.text('Report ID:', col1X, detailY);
    doc.setFont('helvetica', 'normal');
    doc.text(`#${report.id}`, col1X + 30, detailY);
    
    doc.setFont('helvetica', 'bold');
    doc.text('Status:', col2X, detailY);
    doc.setFont('helvetica', 'normal');
    doc.text(report.status.replace('_', ' '), col2X + 20, detailY);
    detailY += 12;
    
    doc.setFont('helvetica', 'bold');
    doc.text('Category:', col1X, detailY);
    doc.setFont('helvetica', 'normal');
    doc.text(report.category, col1X + 30, detailY);
    
    if (report.priority) {
      doc.setFont('helvetica', 'bold');
      doc.text('Priority:', col2X, detailY);
      doc.setFont('helvetica', 'normal');
      // Color code priority
      if (report.priority === 'URGENT') doc.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2]);
      else if (report.priority === 'HIGH') doc.setTextColor(255, 165, 0);
      else if (report.priority === 'MEDIUM') doc.setTextColor(255, 193, 7);
      doc.text(report.priority, col2X + 20, detailY);
      doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
    }
    detailY += 12;
    
    doc.setFont('helvetica', 'bold');
    doc.text('Created:', col1X, detailY);
    doc.setFont('helvetica', 'normal');
    const createdDate = new Date(report.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    doc.text(createdDate, col1X + 30, detailY);
    
    if (report.updatedAt && report.updatedAt !== report.createdAt) {
      doc.setFont('helvetica', 'bold');
      doc.text('Updated:', col2X, detailY);
      doc.setFont('helvetica', 'normal');
      const updatedDate = new Date(report.updatedAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
      doc.text(updatedDate, col2X + 20, detailY);
    }
    detailY += 12;

    if (report.address) {
      doc.setFont('helvetica', 'bold');
      doc.text('Location:', col1X, detailY);
      doc.setFont('helvetica', 'normal');
      const addressLines = doc.splitTextToSize(report.address, maxWidth/2 - 20);
      doc.text(addressLines, col1X + 30, detailY);
    }

    currentY += 95;

    // AI-Generated Analysis Sections
    
    // Urgency Assessment with visual indicator
    currentY = addSectionHeader('URGENCY ASSESSMENT', currentY, 
      aiSummary.urgencyAssessment === 'Critical' || aiSummary.urgencyAssessment === 'High' ? colors.accent : colors.primary);
    
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(14);
    if (aiSummary.urgencyAssessment === 'Critical' || aiSummary.urgencyAssessment === 'High') {
      doc.setTextColor(colors.accent[0], colors.accent[1], colors.accent[2]);
    }
    doc.text(`Level: ${aiSummary.urgencyAssessment.toUpperCase()}`, margin + 5, currentY);
    doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
    currentY += 15;

    // Key Findings
    currentY = addSectionHeader('KEY FINDINGS', currentY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    for (const finding of aiSummary.keyFindings) {
      currentY = addBulletPoint(finding, margin + 5, currentY, maxWidth - 10);
      currentY += 5;
    }
    currentY += 10;

    // Impact Analysis
    currentY = addSectionHeader('IMPACT ANALYSIS', currentY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(12);
    currentY = addWrappedText(aiSummary.impactAnalysis, margin + 5, currentY, maxWidth - 10, 12, 1.6);
    currentY += 15;

    // Check if we need a new page
    if (currentY > pageHeight - 100) {
      doc.addPage();
      currentY = 30;
    }

    // Recommended Actions
    currentY = addSectionHeader('RECOMMENDED ACTIONS', currentY, colors.success);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    for (const action of aiSummary.recommendedActions) {
      currentY = addBulletPoint(action, margin + 5, currentY, maxWidth - 10);
      currentY += 5;
    }
    currentY += 10;

    // Next Steps
    currentY = addSectionHeader('NEXT STEPS', currentY);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    for (let i = 0; i < aiSummary.nextSteps.length; i++) {
      doc.setFont('helvetica', 'bold');
      doc.text(`${i + 1}.`, margin + 5, currentY);
      doc.setFont('helvetica', 'normal');
      currentY = addWrappedText(aiSummary.nextSteps[i], margin + 15, currentY, maxWidth - 20, 11);
      currentY += 8;
    }
    currentY += 10;

    // Original Description Section
    if (currentY > pageHeight - 60) {
      doc.addPage();
      currentY = 30;
    }
    
    currentY = addSectionHeader('ORIGINAL REPORT DESCRIPTION', currentY, colors.secondary);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    currentY = addWrappedText(report.description, margin + 5, currentY, maxWidth - 10, 11, 1.5);

    // Location Information (if available)
    if (report.latitude && report.longitude) {
      currentY += 15;
      currentY = addSectionHeader('LOCATION COORDINATES', currentY);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(11);
      doc.text(`Latitude: ${report.latitude.toFixed(6)}`, margin + 5, currentY);
      doc.text(`Longitude: ${report.longitude.toFixed(6)}`, margin + 5, currentY + 12);
      doc.setTextColor(colors.primary[0], colors.primary[1], colors.primary[2]);
      doc.text('View on Google Maps', margin + 5, currentY + 24);
      const mapsUrl = `https://www.google.com/maps?q=${report.latitude},${report.longitude}`;
      doc.textWithLink('🔗 Open Location', margin + 5, currentY + 36, { url: mapsUrl });
      doc.setTextColor(colors.text[0], colors.text[1], colors.text[2]);
    }

    // Professional Footer
    const footerY = pageHeight - 25;
    doc.setLineWidth(0.5);
    doc.setDrawColor(colors.lightGray[0], colors.lightGray[1], colors.lightGray[2]);
    doc.line(margin, footerY - 5, pageWidth - margin, footerY - 5);
    
    doc.setFillColor(248, 249, 250);
    doc.rect(0, footerY - 3, pageWidth, 25, 'F');
    
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(colors.lightGray[0], colors.lightGray[1], colors.lightGray[2]);
    doc.text('This professional report was generated by Civic Circle AI Analysis System', margin, footerY + 5);
    doc.text(`Report ID: #${report.id} | Generated: ${generatedDate} | Confidential Document`, margin, footerY + 15);

    // Generate PDF buffer
    const pdfBuffer = doc.output('arraybuffer');

    // Return PDF as response
    return new NextResponse(pdfBuffer, {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="report-${reportId}-summary.pdf"`,
      },
    });

  } catch (error) {
    console.error('Error generating report:', error);
    return NextResponse.json(
      { error: 'Failed to generate report summary' },
      { status: 500 }
    );
  }
}
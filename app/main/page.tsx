"use client";

import { useEffect, useState } from 'react';
import mermaid from 'mermaid';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Script from 'next/script';  // Import Script component
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCopy, faDownload } from "@fortawesome/free-solid-svg-icons";
// import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { PrismaClient } from '@prisma/client';



export default function Home() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [type, setType] = useState('');
  const [isMounted, setIsMounted] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [paypalLoaded, setPaypalLoaded] = useState(false); // Track PayPal script loading
  const [isFormatting, setIsFormatting] = useState(false);
  const [diagramTypes, setDiagramTypes] = useState<
    { id: number; title: string }[]
  >([]);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    if (!isMounted) {
      setIsMounted(true);
      // Initialize Mermaid globally only once
      mermaid.initialize({
        theme: 'default',
        startOnLoad: false,
        flowchart: {
          useMaxWidth: true,
        },
        sequence: {
          showSequenceNumbers: true,
        },
      });
    }
  }, [isMounted]);

  const loadPayPalButtons = () => {
    if (window.paypal) {
      window.paypal.Buttons({
          createOrder: function (data: any, actions: any) {
            return actions.order.create({
            purchase_units: [{ amount: { value: '1.00' } }]
            });
          },
          onApprove: function (data: any, actions: any) {
            return actions.order.capture().then(async function (details: any) {
            const response = await fetch('/api/payment-success', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ orderID: data.orderID, payerID: data.payerID, paymentDetails: details })
              });
              if (response.ok) {
              alert('Donation successful! Thank you, ' + details.payer.name.given_name);
              } else {
              alert('There was an issue processing your donation. Please contact support.');
              }
            });
        }
      }).render('#paypal-button-container');
    }
  };

  useEffect(() => {
    if (!paypalLoaded) {
      setPaypalLoaded(true);
    } else {
      loadPayPalButtons(); // Reload PayPal buttons whenever PayPal script has loaded
    }
  }, [paypalLoaded]);

  const downloadFile = () => {
    const blob = new Blob([output], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'output.htm';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const downloadPDF = () => {
    const mermaidElement = document.querySelector('.mermaid');
    if (mermaidElement) {
      html2canvas(mermaidElement as HTMLElement).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();

        const imgWidth = canvas.width;
        const imgHeight = canvas.height;

        const aspectRatio = imgWidth / imgHeight;

        let newWidth = pdfWidth;
        let newHeight = pdfWidth / aspectRatio;

        if (newHeight > pdfHeight) {
          newHeight = pdfHeight;
          newWidth = pdfHeight * aspectRatio;
        }

        pdf.addImage(imgData, 'PNG', 10, 10, newWidth - 20, newHeight - 20);
        pdf.save('diagram.pdf');
      });
    } else {
      console.error('Mermaid element not found');
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(output).then(() => {
      alert('Copied to clipboard');
    }).catch(err => {
      console.error('Failed to copy: ', err);
      });
  };

  const handleGenerate = async () => {
    const response = await fetch('/api/openai', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input, type }),
    });

    if (response.ok) {
      const data = await response.json();
      let diagramOutput = data.output.trim();

      if (type === 'Sequence Diagram' || type === 'Flowchart') {
        // Clean up the Mermaid instructions
        diagramOutput = diagramOutput.replace(/^```mermaid\s+/, '').replace(/```$/, '').replace(/```/g, '').trim();
      }

      setOutput(diagramOutput);
    } else {
      console.error('Failed to generate output');
    }
  };

  useEffect(() => {
    const container = document.querySelector('.mermaid-output');
    if ((type === 'Flowchart' || type === 'Sequence Diagram') && output) {
      
      if (container) {
        // Clear existing content
        container.innerHTML = '';
        try {
          // Inject the cleaned Mermaid code into the container
          container.innerHTML = `<div class="mermaid">${output}</div>`;

          // Reinitialize Mermaid to render the diagram using mermaid.run()
          mermaid.run();
        } catch (error) {
          console.error('Mermaid rendering error: ', error);
        }
      } else {
        console.error('Mermaid container not found');
      }
    }else {
      // If type is not Flowchart or Sequence Diagram, clear the output box
      if (container) {
        container.innerHTML = '';
      }
    }
  }, [output, type]);

  const exportToDrawIO = async () => {
    if (!output) {
      alert('No diagram data available to export.');
      return;
    }

    const prompt = `Convert the following Mermaid.js sequence diagram to draw.io XML format without any additional comments or explanations:
${output}`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 2000
      })
    });


    if (response.ok) {
      const data = await response.json();
      const xmlOutput = data.drawioXml;
       console.log('API response:', data); // Debug log

      if (data.choices && data.choices[0] && data.choices[0].message && data.choices[0].message.content) {
        let xmlOutput = data.choices[0].message.content.trim();

        xmlOutput = xmlOutput.replace(/^```[\s\S]*?xml\s*/i, '').replace(/```$/, '').trim();

        // Strip any potential triple backticks if present
        if (xmlOutput.startsWith('```') && xmlOutput.endsWith('```')) {
          xmlOutput = xmlOutput.slice(3, -3).trim();
        }

        console.log('Extracted XML:', xmlOutput); // Log extracted XML for debugging

        if (!xmlOutput) {
          alert('Failed to extract the XML content.');
          return;
        }

        const base64EncodedContent = btoa(xmlOutput);
        const drawioUrl = `https://app.diagrams.net/?title=diagram.drawio#R${xmlOutput}`;

        window.open(drawioUrl, '_blank');
      } else {
        alert('Invalid response format. Please check the API response structure.');
      }
    } else {
      alert('Failed to fetch the converted XML format from the server.');
    }
  };

  const downloadToSVG = () => {
  const mermaidElement = document.querySelector('.mermaid'); // Assumes the diagram is rendered with Mermaid

    if (!mermaidElement) {
      alert("No diagram available to export.");
      return;
    }

    // Convert the Mermaid diagram to SVG
    const svgData = new XMLSerializer().serializeToString(mermaidElement);
  const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    // Create a downloadable link
  const a = document.createElement('a');
    a.href = url;
  a.download = 'diagram.svg';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };


  const handleSave = async () => {
    try {
    const response = await fetch('/api/saveModule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: 1,
        title: 'Generated Diagram',
          user_prompt: input,
          system_prompt: output,
        created_by: 'system',
          category_id: 1,

          sub_category_id: 1,
      })
      });
    

      if (!response.ok) {
      throw new Error('Failed to save module');
      }

      const savedModule = await response.json();
      alert("Module saved successfully!");
      return savedModule;

    } catch (error) {
      console.error("Error saving module:", error);
      alert("Failed to save module");
      throw error;
    }
  };

  const handleFormatText = async () => {
    if (!input.trim()) return;

    setIsFormatting(true);
    try {
      const response = await fetch("/api/format-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          input: input,
          type: type,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to format text");
      }

      const data = await response.json();

      if (data.output) {
        setInput(data.output);
      } else {
        throw new Error("Formatted text not found in response");
      }
    } catch (error) {
      console.error("Error formatting text:", error);
      alert("Failed to format the text. Please try again.");
    } finally {
      setIsFormatting(false);
    }
  };

  useEffect(() => {
    const fetchDiagramTypes = async () => {
      const response = await fetch('/api/diagramTypes');
      const data = await response.json();
      if (data && data.data) {
        setDiagramTypes(data.data);
        // Set the first diagram type as the default
        setType(data.data[0]?.title || '');  // Default to the first title
      } else {
        console.error('Unexpected response:', data);
      }
    };
    fetchDiagramTypes();
  }, []);  // Empty dependency array to fetch only once when component mounts

  const handleTypeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setType(event.target.value);
    setInput(''); 
    setOutput('');
  };

  return (
    <>
      {/* <TopMenu /> Add the TopMenu component here */}
      <div className="p-4">
        <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-center py-16">
          <h1 className="text-4xl font-bold mb-4">TarzanAI</h1>
        <p className="text-lg">AI Diagram & Code Generator - Generate software diagrams & code from text</p>
          {/* Watch Demo Thumbnail */}
          <div className="mt-6 flex justify-center">
            <img
              src="/images/demo-icon.png"
              alt="Watch Demo"
              className="w-21 h-7 cursor-pointer"
              onClick={openModal} // Open modal when image is clicked
            />
          </div>

          {/* Modal */}
          {isModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
              <div className="bg-white p-6 rounded-lg relative w-11/12 max-w-2xl">
                {/* Close Button */}
                <button
                  className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
                  onClick={closeModal}
                >
                  &times;
                </button>

                {/* YouTube Video */}
                <div className="video-container">
                  <iframe
                    width="100%"
                    height="315"
                    src="https://www.youtube.com/embed/aDBfQT-1C1Q"
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* PayPal SDK Integration */}
        {/* <Script
        src="https://www.paypal.com/sdk/js?client-id=AXHOAiW-KeruPbDdnJoUq2l3lJ2RdtWscYUTPsrFfwTBVKZevYZNbmX3C0xQz57xOOWjPLz74liEdx23"
        strategy="afterInteractive"
        onLoad={loadPayPalButtons}  // Load PayPal buttons after the script is loaded
      /> */}

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "20px 0",
          }}
        >
          <select value={type} onChange={handleTypeChange} className="mt-4 p-2 border rounded bg-white text-black">
        {diagramTypes.map((diagram) => (
          <option key={diagram.id} value={diagram.title} className="text-black">
            {diagram.title}
          </option>
        ))}
      </select>

        </div>

        <div className="flex mt-4">
          <textarea
            className="textarea w-1/2 h-64 p-2 border rounded mr-4 text-black overflow-auto"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        {(type === 'Flowchart' || type === 'Sequence Diagram') ? (
            <div className="textarea w-1/2 h-64 p-2 border rounded mr-4 text-black overflow-auto relative">
              <div className="absolute top-2 right-2">
              <button className="copy-btn small-text" onClick={copyToClipboard}>
                <FontAwesomeIcon className="fa fa-copy" icon={faCopy} 
                style={{fontSize: 16 }}/> {/*Copy Output*/}
                </button>
              <button className="download-btn small-text" onClick={downloadToSVG}>
              <FontAwesomeIcon className="fa fa-download" icon={faDownload} 
                style={{fontSize: 16 }}/> {/*Download*/}
                </button>
                {/* <button className="download-btn small-text" onClick={exportToDrawIO}>
                <i className="fa fa-download"></i>Export to draw.io
              </button> */}
              </div>
            {isMounted && (
              <div className="mermaid-output" />
            )}
            </div>
          ) : (
            <div className="textarea w-1/2 h-64 p-2 border rounded mr-4 text-black overflow-auto relative">
              <div className="absolute top-2 right-2">
              <button className="copy-btn small-text" onClick={copyToClipboard}>
              <FontAwesomeIcon className="fa fa-copy" icon={faCopy} 
                style={{fontSize: 16 }}/> {/*Copy Output*/}
                </button>
              <button className="download-btn small-text" onClick={downloadFile}>
              <FontAwesomeIcon className="fa fa-download" icon={faDownload} 
                style={{fontSize: 16 }}/> {/*Download*/}
                </button>
              </div>
              <textarea
                className="w-full h-full p-2 border rounded text-black overflow-auto"
                value={output}
                readOnly
              />
            </div>
          )}
        </div>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>

      <button
                  disabled={!input.trim() || isFormatting}
                  className={`bottom-2 right-2 px-4 py-2 rounded-md border-2 border-blue-500 button-spacing
      ${
        input.trim() && !isFormatting
          ? "text-blue-500 hover:bg-blue-50 cursor-pointer"
          : "text-gray-400 border-gray-300 cursor-not-allowed"
      } focus:outline-none transition-colors duration-200`}
                  onClick={handleFormatText}
                >
                  {isFormatting ? "Formatting..." : "Format Text"}
                </button>
        <button onClick={handleGenerate} className="button-primary rounded button-spacing">
            Generate
          </button>
        <button onClick={handleSave} className="button-primary rounded button-spacing">
            Save
          </button>
        <button onClick={() => { setInput(''); setOutput(''); }} className="button rounded button-spacing">
            Clear
          </button>
        </div>
        <p className="mt-4 text-black">
        If you find this tool helpful, consider making a donation to support its development, Thanks!!
        </p>


        {/* PayPal SDK Integration */}
        <Script
          src="https://www.paypal.com/sdk/js?client-id=AXHOAiW-KeruPbDdnJoUq2l3lJ2RdtWscYUTPsrFfwTBVKZevYZNbmX3C0xQz57xOOWjPLz74liEdx23"
          strategy="afterInteractive"
          onLoad={() => setPaypalLoaded(true)} // Trigger loading state when script loads
        />
        <div id="paypal-button-container" className="mt-4"></div>
      </div>
    </>
  );
}

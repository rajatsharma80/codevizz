"use client";

import { useEffect, useState } from 'react';
import mermaid from 'mermaid';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import Script from 'next/script';  // Import Script component

export default function Home() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [type, setType] = useState('HTML code');
  const [isMounted, setIsMounted] = useState(false);

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
    const response = await fetch('/api/generate', {
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

  return (
    <div className="p-4">
      <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white text-center py-16">
        <h1 className="text-4xl font-bold mb-4">TarzanAI</h1>
        <p className="text-lg">AI Diagram Generator - Generate software diagrams from text</p>
      </div>

      {/* PayPal SDK Integration */}
      <Script
        src="https://www.paypal.com/sdk/js?client-id=AXHOAiW-KeruPbDdnJoUq2l3lJ2RdtWscYUTPsrFfwTBVKZevYZNbmX3C0xQz57xOOWjPLz74liEdx23"
        strategy="afterInteractive"
        onLoad={loadPayPalButtons}  // Load PayPal buttons after the script is loaded
      />

      <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
        <select value={type} onChange={(e) => { setType(e.target.value); setInput(''); setOutput(''); }}
          className="mt-4 p-2 border rounded bg-white text-black">
          <option value="HTML code" className="text-black">HTML code</option>
          <option value="JUnit" className="text-black">JUnit</option>
          <option value="Java code" className="text-black">Java code</option>
          <option value="Flowchart" className="text-black">Flowchart</option>
          <option value="Sequence Diagram" className="text-black">Sequence Diagram</option>
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
                <i className="fa fa-copy"></i> Copy Output
              </button>
              <button className="download-btn small-text" onClick={downloadPDF}>
                <i className="fa fa-download"></i>Download
              </button>
            </div>
            {isMounted && (
              <div className="mermaid-output" />
            )}
          </div>
        ) : (
          <div className="textarea w-1/2 h-64 p-2 border rounded mr-4 text-black overflow-auto relative">
            <div className="absolute top-2 right-2">
              <button className="copy-btn small-text" onClick={copyToClipboard}>
                <i className="fa fa-copy"></i>Copy Output
              </button>
              <button className="download-btn small-text" onClick={downloadFile}>
                <i className="fa fa-download"></i>Download
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
        <button onClick={handleGenerate} className="button-primary rounded button-spacing">
          Generate
        </button>
        <button onClick={() => { setInput(''); setOutput(''); }} className="button rounded button-spacing">
          Clear
        </button>
      </div>
      <p className="mt-4 text-black">
        If you find this tool helpful, consider making a donation to support its development, Thanks!!
      </p>
      <div id="paypal-button-container" className="mt-4"></div>
    </div>
  );
}
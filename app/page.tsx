"use client";

import { useEffect, useState } from 'react';
import mermaid from 'mermaid';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export default function Home() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [type, setType] = useState('HTML code');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

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
      html2canvas(mermaidElement as HTMLElement).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        
        // Get PDF dimensions
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = pdf.internal.pageSize.getHeight();
        
        // Get image dimensions
        const imgWidth = canvas.width;
        const imgHeight = canvas.height;
        
        // Calculate aspect ratio
        const aspectRatio = imgWidth / imgHeight;
        
        // Calculate dimensions to fit within PDF
        let newWidth = pdfWidth;
        let newHeight = pdfWidth / aspectRatio;
        
        if (newHeight > pdfHeight) {
          newHeight = pdfHeight;
          newWidth = pdfHeight * aspectRatio;
        }
        
        // Add image to PDF
        pdf.addImage(imgData, 'PNG', 10, 10, newWidth - 20, newHeight - 20);
        pdf.save('diagram.pdf');
      });
    } else {
      console.error('Mermaid element not found');
    }
  };

  // Copy to clipboard function
  const copyToClipboard = () => {
    navigator.clipboard.writeText(output).then(() => {
      alert('Copied to clipboard');
    }).catch(err => {
      console.error('Failed to copy: ', err);
    });
  };

  // Initialize mermaid globally once
  useEffect(() => {
    mermaid.initialize({
      theme: 'default',
      startOnLoad: false,  // Disable automatic loading
      sequence: {
        showSequenceNumbers: true,
      },
    });

    // PayPal integration (this part seems unrelated to Mermaid but it can stay here)
    const script = document.createElement('script');
    script.src = "https://www.paypal.com/sdk/js?client-id=AXHOAiW-KeruPbDdnJoUq2l3lJ2RdtWscYUTPsrFfwTBVKZevYZNbmX3C0xQz57xOOWjPLz74liEdx23";
    script.addEventListener('load', () => {
      if (window.paypal) {
        window.paypal.Buttons({
          createOrder: function(data: any, actions: any) {
            return actions.order.create({
              purchase_units: [{ amount: { value: '1.00' } }]
            });
          },
          onApprove: function(data: any, actions: any) {
            return actions.order.capture().then(async function(details: any) {
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
    });
    document.body.appendChild(script);
  }, []);

  const handleGenerate = async () => {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input, type }),
    });

    if (response.ok) {
      const data = await response.json();
      let diagramOutput = data.output.trim();
      console.log("Diagram type ", type);
      // Handle sequence diagram syntax cleanup
      if (type === 'Sequence Diagram' ) {
        console.log("Diagram printing");
        diagramOutput = diagramOutput.replace(/^```mermaid\s+/, '').replace(/```$/, '').replace(/```/g, '') .trim();
        console.log("Diagram Output: ", diagramOutput);
      }else{
        console.log("Diagram not printing");
      }
      setOutput(diagramOutput);
    } else {
      console.error('Failed to generate output');
    }
  };

  useEffect(() => {
    // Mermaid needs to be re-initialized after the output updates
    if (type === 'Sequence Diagram' && output) {
      try {
        // Reinitialize Mermaid for the newly injected content
        mermaid.init(undefined, document.querySelectorAll('.mermaid'));
      } catch (error) {
        console.error('Mermaid rendering error: ', error);
      }
    }
  }, [output, type]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">TarzanAI</h1>
      <div style={{ display: 'flex', justifyContent: 'center', margin: '20px 0' }}>
        <select value={type} onChange={(e) => { setType(e.target.value); setInput(''); setOutput(''); }}
          className="mt-4 p-2 border rounded bg-white text-black">
          <option value="HTML code" className="text-black">HTML code</option>
          <option value="JUnit" className="text-black">JUnit</option>
          <option value="Java code" className="text-black">Java code</option>
          <option value="Sequence Diagram" className="text-black">Sequence Diagram</option>
        </select>
      </div>
      <div className="flex mt-4">
        <textarea
          className="textarea w-1/2 h-64 p-2 border rounded mr-4 text-black overflow-auto"
          value={input}
          onChange={(e) => {setInput(e.target.value) }}
        />
        {type === 'Sequence Diagram' ? (
          <div className="textarea w-1/2 h-64 p-2 border rounded mr-4 text-black overflow-auto relative">
            <div className="absolute top-2 right-2">
              <button onClick={copyToClipboard} className="copy-btn small-text">
                <i className="fa fa-copy"></i> Copy Output
              </button>
              <button onClick={downloadPDF} className="download-btn small-text">
                <i className="fa fa-download"></i>Download
              </button>
            </div>
            {isMounted && (
              <div dangerouslySetInnerHTML={{ __html: `<div class="mermaid">${output}</div>` }} />
            )}
          </div>
        ) : (
          <div className="textarea w-1/2 h-64 p-2 border rounded mr-4 text-black overflow-auto relative">
            <div className="absolute top-2 right-2">
              <button onClick={copyToClipboard} className="copy-btn small-text">
                <i className="fa fa-copy"></i>Copy Output
              </button>
              <button onClick={downloadFile} className="download-btn small-text">
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
        <button onClick={() => setInput('')} className="button rounded button-spacing">
          Clear
        </button>
      </div>
      <p className="mt-4 text-black">If you find this tool helpful, consider making a donation to support its development, Thanks!!</p>
      <div id="paypal-button-container" className="mt-4"></div>
    </div>
  );
}
